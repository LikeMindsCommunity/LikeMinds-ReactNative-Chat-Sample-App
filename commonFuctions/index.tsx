import React, {Alert, Linking, Text} from 'react-native';
import STYLES from '../constants/Styles';
import {useAppDispatch, useAppSelector} from '../store';
import {PDF_TEXT, VIDEO_TEXT} from '../constants/Strings';
import {
  SELECTED_FILES_TO_UPLOAD,
  SELECTED_FILES_TO_UPLOAD_THUMBNAILS,
} from '../store/types/types';
import {createThumbnail} from 'react-native-create-thumbnail';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import {diffChars, diffLines, diffWords} from 'diff';

const REGEX_USER_SPLITTING = /(<<.+?\|route:\/\/\S+>>)/gu;
export const REGEX_USER_TAGGING =
  /<<(?<name>[^<>|]+)\|route:\/\/(?<route>[^?]+(\?.+)?)>>/g;

{
  /* This is a generic arrow function to remove a specific key. 
  The first argument is the name of the key to remove, the second is the object from where you want to remove the key. 
  Note that by restructuring it, we generate the curated result, then return it. */
}
export const removeKey = (key: any, {[key]: _, ...rest}) => rest;

// This function helps us to decode time(created_epoch: 1675421848540) into DATE if more than a day else TIME if less than a day.
export function getFullDate(time: any) {
  if (!!time) {
    let t = new Date(time);
    let today = new Date(Date.now());
    let date = t.getDate();
    let month = t.getMonth() + 1;
    let year = t.getFullYear();

    let todayStr = `${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`;
    let tStr = `${date}/${month}/${year}`;
    if (todayStr === tStr) {
      return `${t.getHours()}:${t.getMinutes()}`;
    } else {
      return tStr;
    }
  } else {
    return;
  }
}

function detectLinks(message: string, isLongPress?: boolean) {
  const regex = /((?:https?:\/\/)?(?:www\.)?(?:\w+\.)+\w+(?:\/\S*)?)/i;
  let parts = message.split(regex);
  let i = 0;
  if (parts?.length > 0) {
    return (
      <Text>
        {parts?.map((val: any, index: any) => (
          <Text key={val + index}>
            {/* key should be unique so we are passing `val(abc) + index(number) = abc2` to make it unique */}
            {regex.test(val) ? (
              <Text
                onPress={async () => {
                  if (!!!isLongPress) {
                    let urlRegex = /(https?:\/\/[^\s]+)/gi;
                    let isMatched = urlRegex.test(val);

                    if (isMatched) {
                      await Linking.openURL(val);
                    } else {
                      await Linking.openURL(`https://${val}`);
                    }
                  }
                }}>
                <Text
                  style={{
                    color: STYLES.$COLORS.LIGHT_BLUE,
                    fontSize: STYLES.$FONT_SIZES.MEDIUM,
                    fontFamily: STYLES.$FONT_TYPES.LIGHT,
                  }}>
                  {val}
                </Text>
              </Text>
            ) : (
              <Text>{val}</Text>
            )}
          </Text>
        ))}
      </Text>
    );
  } else {
    return message;
  }
}

export function getNameInitials(name: string) {
  let initials = '';

  const words = name.split(' ');

  for (let i = 0; i < words?.length && initials?.length < 2; i++) {
    if (words[i]?.length > 0) {
      initials += words[i][0].toUpperCase();
    }
  }

  return initials;
}

// naruto: naruto|route://member_profile/88226?member_id=__id__&community_id=__community__>>
// test string = '<<Sanjay kumar 🤖|route://member/1260>> <<Ishaan Jain|route://member/1003>> Hey google.com';
// This decode function helps us to decode tagged messages like the above test string in to readable format.
// This function has two responses: one for Homefeed screen and other is for chat screen(Pressable ones are for chat screen).
export const decode = (
  text: string | undefined,
  enableClick: boolean,
  isLongPress?: boolean,
) => {
  if (!text) {
    return;
  }
  let arr: any[] = [];
  let parts = text?.split(REGEX_USER_SPLITTING);

  if (!!parts) {
    for (const matchResult of parts) {
      if (!!matchResult.match(REGEX_USER_TAGGING)) {
        let match = REGEX_USER_TAGGING.exec(matchResult);
        if (match !== null) {
          const {name, route} = match?.groups!;
          arr.push({key: name, route: route});
        }
      } else {
        arr.push({key: matchResult, route: null});
      }
    }

    return enableClick ? (
      <Text>
        {arr.map((val, index) => (
          <Text
            style={{
              color: STYLES.$COLORS.PRIMARY,
              fontFamily: STYLES.$FONT_TYPES.LIGHT,
            }}
            key={val.key + index}>
            {/* key should be unique so we are passing `val(abc) + index(number) = abc2` to make it unique */}

            {!!val.route ? (
              <Text
                onPress={() => {
                  if (!!!isLongPress) {
                    Alert.alert(`navigate to the route ${val?.route}`);
                  }
                }}
                style={{
                  color: STYLES.$COLORS.LIGHT_BLUE,
                  fontSize: STYLES.$FONT_SIZES.MEDIUM,
                  fontFamily: STYLES.$FONT_TYPES.LIGHT,
                }}>
                {val.key}
              </Text>
            ) : (
              detectLinks(val.key, isLongPress)
            )}
          </Text>
        ))}
      </Text>
    ) : (
      <Text>
        {arr.map((val, index) => (
          <Text
            style={{
              color: STYLES.$COLORS.PRIMARY,
              fontFamily: STYLES.$FONT_TYPES.LIGHT,
            }}
            key={val.key + index}>
            {!!val.route ? (
              <Text
                style={{
                  color: STYLES.$COLORS.PRIMARY,
                  fontFamily: STYLES.$FONT_TYPES.BOLD,
                }}>
                {val.key}
              </Text>
            ) : (
              val.key
            )}
          </Text>
        ))}
      </Text>
    );
  } else {
    return text;
  }
};

export const decodeForNotifications = (text: string | undefined) => {
  if (!text) {
    return;
  }
  let arr: any[] = [];
  let parts = text?.split(/(?:<<)?([\w\s🤖@]+\|route:\/\/\S+>>)/g);
  const TEMP_REGEX_USER_TAGGING =
    /(?:<<)?((?<name>[^<>|]+)\|route:\/\/(?<route>[^?]+(\?.+)?)>>)/g;

  if (!!parts) {
    for (const matchResult of parts) {
      if (!!matchResult.match(TEMP_REGEX_USER_TAGGING)) {
        let match = TEMP_REGEX_USER_TAGGING.exec(matchResult);
        if (match !== null) {
          const {name, route} = match?.groups!;
          arr.push({key: name, route: route});
        }
      } else {
        arr.push({key: matchResult, route: null});
      }
    }
    let decodedText = '';
    for (let i = 0; i < arr.length; i++) {
      decodedText = decodedText + arr[i].key;
    }
    return decodedText;
  } else {
    return text;
  }
};

// This functions formatted the copied messages.
export function decodeStr(text: string | undefined) {
  if (!text) {
    return;
  }
  let arr: any[] = [];
  let parts = text.split(REGEX_USER_SPLITTING);

  if (!!parts) {
    for (const matchResult of parts) {
      let keyValue = matchResult.match(REGEX_USER_TAGGING);
      let memberName;
      let tag;
      if (!!keyValue) {
        memberName = keyValue[1];
        tag = keyValue[2];
        arr.push({key: memberName, route: true});
      } else if (!!matchResult) {
        arr.push({key: matchResult, route: null});
      }
    }
    let str: string = '';
    arr.forEach(val => {
      str = str + val.key;
    });
    return str;
  } else {
    return text;
  }
}

// this function return copied messages in formatted form using decodeStr
export function copySelectedMessages(selectedMessages: any) {
  if (selectedMessages?.length === 1 && !!!selectedMessages[0]?.deleted_by) {
    if (!!selectedMessages[0]?.answer) {
      return decodeStr(selectedMessages[0]?.answer);
    } else {
      return '';
    }
  } else {
    const copiedMessages = selectedMessages
      .map((message: any) => {
        if (!!message?.answer && !!!message?.deleted_by) {
          const timestamp = `[${message?.date}, ${message?.created_at}]`;
          const sender = message?.member?.name;
          const text = decodeStr(message?.answer);
          return `${timestamp} ${sender}: ${text}`;
        } else {
          return '';
        }
      })
      .join('\n');
    return copiedMessages;
  }
}

// this function formats the recordedTime(future) in days hours and minutes
export function formatTime(recordedTime: number): string {
  const date: Date = new Date(recordedTime);
  const now: Date = new Date();

  const diff: number = date.getTime() - now.getTime();
  const seconds: number = Math.floor(diff / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else {
    return `${minutes}m`;
  }
}

export const fetchResourceFromURI = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

interface VideoThumbnail {
  selectedImages: any;
  selectedFilesToUpload?: any;
  selectedFilesToUploadThumbnails?: any;
  initial: boolean; // true when selecting Videos for first time, else false.
}

// function to get thumbnails from videos
export const getVideoThumbnail = async ({
  selectedImages,
  selectedFilesToUpload,
  selectedFilesToUploadThumbnails,
  initial,
}: VideoThumbnail) => {
  let arr: any = [];
  let dummyArrSelectedFiles: any = selectedImages;
  for (let i = 0; i < selectedImages?.length; i++) {
    let item = selectedImages[i];
    if (item?.type?.split('/')[0] === VIDEO_TEXT) {
      await createThumbnail({
        url: item.uri,
        timeStamp: 10000,
      })
        .then(response => {
          arr = [...arr, {uri: response.path}];
          dummyArrSelectedFiles[i] = {
            ...dummyArrSelectedFiles[i],
            thumbnail_url: response.path,
          };
        })
        .catch(err => {});
    } else {
      arr = [...arr, {uri: item.uri}];
    }
  }
  return {
    selectedFilesToUploadThumbnails: initial
      ? arr
      : [...selectedFilesToUploadThumbnails, ...arr],
    selectedFilesToUpload: initial
      ? dummyArrSelectedFiles
      : [...selectedFilesToUpload, ...dummyArrSelectedFiles],
  };
};

// function to get thumbnails of all pdf
export const getAllPdfThumbnail = async (selectedImages: any) => {
  let arr: any = [];
  for (let i = 0; i < selectedImages?.length; i++) {
    let item = selectedImages[i];
    const filePath = item.uri;
    const page = 0;
    if (item?.type?.split('/')[1] === PDF_TEXT) {
      const res = await PdfThumbnail.generate(filePath, page);
      if (!!res) {
        arr = [...arr, {uri: res?.uri}];
      }
    } else {
      arr = [...arr, {uri: item.uri}];
    }
  }
  return arr;
};

// function to get thumbnails of pdf
export const getPdfThumbnail = async (selectedFile: any) => {
  let arr: any = [];
  const filePath = selectedFile.uri;
  const page = 0;
  if (selectedFile?.type?.split('/')[1] === PDF_TEXT) {
    const res = await PdfThumbnail.generate(filePath, page);
    if (!!res) {
      arr = [...arr, {uri: res?.uri}];
    }
  } else {
    arr = [...arr, {uri: selectedFile.uri}];
  }
  return arr;
};

export function splitWordsWithSpace(input: string) {
  const words = input.split(' ');

  for (let i = 0; i < words.length; i++) {
    if (words[i + 1] === '') {
      words[i] += ' ';
    }
  }

  return words;
}

export function detectMentions(input: string) {
  const mentionRegex = /@(\w+)/g;
  const matches = [];
  let match;

  while ((match = mentionRegex.exec(input)) !== null) {
    const startIndex = match.index;
    const endIndex = mentionRegex.lastIndex;
    const nextChar = input.charAt(endIndex);

    if (
      nextChar !== ' ' &&
      nextChar !== '@' &&
      match[1] !== 'everyone' &&
      match[1] !== 'participants'
    ) {
      matches.push(match[1]);
    }
  }

  if (input.endsWith(' @') || input === '@' || input.endsWith('\n@')) {
    matches.push('');
  }

  return matches;
}

export function replaceLastMention(
  input: string,
  taggerUserName: string,
  mentionUsername: string,
  memberID: any,
) {
  let mentionRegex: RegExp;

  if (taggerUserName === '') {
    mentionRegex = /(?<=^|\s)@($)/g;
  } else {
    mentionRegex = new RegExp(
      `@${taggerUserName}\\b(?!.*@${taggerUserName}\\b)`,
      'gi',
    );
  }
  const replacement = `@[${mentionUsername}](${memberID}) `;
  const replacedString = input.replace(mentionRegex, replacement);
  return replacedString;
}

/**
 * Generates new value when we changing text.
 *
 * @param parts full parts list
 * @param originalText original plain text
 * @param changedText changed plain text
 */
export const mergeTwoStringsToSaveRouteURL = (
  originalText: string,
  changedText: string,
) => {
  // Merge strings based on regex pattern
  const mergedString = originalText.replace(
    /<<(.*?)\|route:\/\/.*?>>/,
    (_, username) => {
      if (username) {
        return `${changedText} ${username}`;
      } else {
        return originalText;
      }
    },
  );

  return mergedString;

  // let newParts: any[] = [];

  // let cursor = 0;

  // changes.forEach(change => {
  //   switch (true) {
  //     /**
  //      * We should:
  //      * - Move cursor forward on the changed text length
  //      */
  //     case change.removed: {
  //       // cursor += change.count;
  //       break;
  //     }

  //     /**
  //      * We should:
  //      * - Push new part to the parts with that new text
  //      */
  //     case change.added: {
  //       // newParts.push(generatePlainTextPart(change.value));

  //       break;
  //     }

  //     /**
  //      * We should concat parts that didn't change.
  //      * - In case when we have only one affected part we should push only that one sub-part
  //      * - In case we have two affected parts we should push first
  //      */
  //     default: {
  //       // if (change.count !== 0) {
  //       //   newParts = newParts.concat(getPartsInterval(parts, cursor, change.count));

  //       //   cursor += change.count;
  //       // }

  //       break;
  //     }
  //   }
  // });
};

export const deleteRouteIfAny = (string: string, inputValue: string) => {
  if (
    inputValue.endsWith('>>') &&
    string.indexOf('>') === string.lastIndexOf('>')
  ) {
    // Replace the entire URL with an empty string
    const replacedText = string.replace(/<<.*?\|route:\/\/.*?>>/, '');

    return replacedText;
  } else {
    return string;
  }
};
