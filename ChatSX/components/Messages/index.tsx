import {View, Text, Image, TouchableOpacity, Pressable} from 'react-native';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {styles} from './styles';
import STYLES from '../../constants/Styles';
import {decode} from '../../commonFuctions';
import ReplyConversations from '../ReplyConversations';
import AttachmentConversations from '../AttachmentConversations';
import ReactionGridModal from '../ReactionGridModal';
import {useAppDispatch, useAppSelector} from '../../../store';
import {
  LONG_PRESSED,
  SELECTED_MESSAGES,
  SET_POSITION,
} from '../../store/types/types';
import {PollConversationView} from '../Poll';
import {useQuery} from '@realm/react';
import {myClient} from '../../..';
import {ChatroomChatRequestState} from '../../enums/chatoomChatRequestStateEnum';

interface Messages {
  item: any;
  isIncluded: boolean;
  onScrollToIndex: any;
  navigation: any;
  openKeyboard: any;
  longPressOpenKeyboard: any;
  removeReaction: any;
  handleTapToUndo: any;
  handleFileUpload: any;
  chatroomType: any;
}

const Messages = ({
  item,
  isIncluded,
  onScrollToIndex,
  navigation,
  openKeyboard,
  longPressOpenKeyboard,
  removeReaction,
  handleTapToUndo,
  handleFileUpload,
  chatroomType,
}: Messages) => {
  const {user} = useAppSelector(state => state.homefeed);

  const {
    selectedMessages,
    isLongPress,
    stateArr,
    conversations,
    chatroomDetails,
    chatroomDBDetails,
  }: any = useAppSelector(state => state.chatroom);

  const [selectedReaction, setSelectedReaction] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [reactionArr, setReactionArr] = useState([] as any);
  const userIdStringified = user?.id?.toString();
  const isTypeSent = item?.member?.id == userIdStringified ? true : false;
  const chatRequestedBy = chatroomDBDetails?.chatRequestedBy;
  const chatroomWithUser = chatroomDBDetails?.chatroomWithUser;
  const isItemIncludedInStateArr = stateArr.includes(item?.state);
  const status = ChatroomChatRequestState;

  const dispatch = useAppDispatch();
  let defaultReactionArrLen = item?.reactions?.length;

  //this useEffect update setReactionArr in format of { reaction: 👌, memberArr: []}
  useEffect(() => {
    let tempArr = [] as any;
    if (defaultReactionArrLen === 0) {
      setReactionArr([]);
    }
    for (let i = 0; i < defaultReactionArrLen; i++) {
      if (defaultReactionArrLen > 0) {
        let isIncuded = tempArr.some(
          (val: any) => val['reaction'] === item?.reactions[i]?.reaction,
        );
        if (isIncuded) {
          let index = tempArr.findIndex(
            (val: any) => val['reaction'] === item?.reactions[i]?.reaction,
          );
          tempArr[index].memberArr = [
            ...tempArr[index]?.memberArr,
            item?.reactions[i]?.member,
          ];
          setReactionArr([...tempArr] as any);
        } else {
          let obj = {
            reaction: item?.reactions[i]?.reaction,
            memberArr: [item?.reactions[i]?.member],
          };
          tempArr = [...tempArr, obj];
          setReactionArr([...tempArr] as any);
        }
      }
    }
  }, [item?.reactions]);

  const reactionLen = reactionArr.length;

  // function handles event on longPress action on a message
  const handleLongPress = (event: any) => {
    const {pageX, pageY} = event.nativeEvent;
    dispatch({
      type: SET_POSITION,
      body: {pageX: pageX, pageY: pageY},
    });
    longPressOpenKeyboard();
  };

  // function handles event on Press action on a message
  const handleOnPress = (event: any) => {
    const {pageX, pageY} = event.nativeEvent;
    dispatch({
      type: SET_POSITION,
      body: {pageX: pageX, pageY: pageY},
    });
    openKeyboard();
  };

  // function handles event on Press reaction below a message
  const handleReactionOnPress = (event: any, val?: any) => {
    const {pageX, pageY} = event.nativeEvent;
    dispatch({
      type: SET_POSITION,
      body: {pageX: pageX, pageY: pageY},
    });
    let isStateIncluded = stateArr.includes(item?.state);
    if (isLongPress) {
      if (isIncluded) {
        const filterdMessages = selectedMessages.filter(
          (val: any) => val?.id !== item?.id && !isStateIncluded,
        );
        if (filterdMessages.length > 0) {
          dispatch({
            type: SELECTED_MESSAGES,
            body: [...filterdMessages],
          });
        } else {
          dispatch({
            type: SELECTED_MESSAGES,
            body: [...filterdMessages],
          });
          dispatch({type: LONG_PRESSED, body: false});
        }
      } else {
        if (!isStateIncluded) {
          dispatch({
            type: SELECTED_MESSAGES,
            body: [...selectedMessages, item],
          });
        }
      }
    } else {
      setSelectedReaction(val);
      setModalVisible(true);
    }
  };

  const conversationDeletor = item?.deletedByMember?.sdkClientInfo?.uuid;
  const conversationDeletorName = item?.deletedByMember?.name;
  const conversationCreator = item?.member?.sdkClientInfo?.uuid;
  const chatroomWithUserUuid = user?.sdkClientInfo?.uuid;
  const chatroomWithUserMemberId = user?.id;
  const users = useQuery('UserSchemaRO');
  const currentUserUuid = users[0]?.userUniqueID;

  // Method to trim the initial DM connection message based on loggedInMember id
  const answerTrimming = (answer: string) => {
    const loggedInMember = currentUserUuid;
    const chatroomWithUser =
      chatroomDBDetails?.chatroomWithUser?.sdkClientInfo?.uuid;

    if (loggedInMember === chatroomWithUser) {
      const startingIndex = answer.lastIndexOf('<');
      const receivingUser = answer.substring(0, startingIndex - 2);
      return receivingUser;
    } else {
      const startingIndex = answer.indexOf('<');
      const endingIndex = answer.indexOf('>');
      const sendingUser =
        answer.substring(0, startingIndex - 1) +
        answer.substring(endingIndex + 2);
      return sendingUser;
    }
  };

  return (
    <View style={styles.messageParent}>
      <View>
        {!!item?.deletedBy ? (
          chatroomType !== status.dmChatroom ? (
            currentUserUuid === conversationDeletor ? (
              <View
                style={[
                  styles.message,
                  isTypeSent ? styles.sentMessage : styles.receivedMessage,
                  isIncluded
                    ? {backgroundColor: STYLES.$COLORS.SELECTED_BLUE}
                    : null,
                ]}>
                <Text style={styles.deletedMsg}>You deleted this message</Text>
              </View>
            ) : conversationCreator === conversationDeletor ? (
              <View
                style={[
                  styles.message,
                  isTypeSent ? styles.sentMessage : styles.receivedMessage,
                  isIncluded
                    ? {backgroundColor: STYLES.$COLORS.SELECTED_BLUE}
                    : null,
                ]}>
                <Text style={styles.deletedMsg}>
                  This message has been deleted by {conversationDeletorName}
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.message,
                  isTypeSent ? styles.sentMessage : styles.receivedMessage,
                  isIncluded
                    ? {backgroundColor: STYLES.$COLORS.SELECTED_BLUE}
                    : null,
                ]}>
                <Text style={styles.deletedMsg}>
                  This message has been deleted by Community Manager
                </Text>
              </View>
            )
          ) : currentUserUuid === conversationDeletor ? (
            <View
              style={[
                styles.message,
                isTypeSent ? styles.sentMessage : styles.receivedMessage,
                isIncluded
                  ? {backgroundColor: STYLES.$COLORS.SELECTED_BLUE}
                  : null,
              ]}>
              <Text style={styles.deletedMsg}>You deleted this message</Text>
            </View>
          ) : (
            <View
              style={[
                styles.message,
                isTypeSent ? styles.sentMessage : styles.receivedMessage,
                isIncluded
                  ? {backgroundColor: STYLES.$COLORS.SELECTED_BLUE}
                  : null,
              ]}>
              <Text style={styles.deletedMsg}>
                This message has been deleted by {conversationDeletorName}
              </Text>
            </View>
          )
        ) : !!item?.replyConversationObject ? (
          <ReplyConversations
            isIncluded={isIncluded}
            item={item}
            isTypeSent={isTypeSent}
            onScrollToIndex={onScrollToIndex}
            openKeyboard={() => {
              openKeyboard();
            }}
            longPressOpenKeyboard={() => {
              longPressOpenKeyboard();
            }}
            reactionArr={reactionArr}
            navigation={navigation}
            handleFileUpload={handleFileUpload}
          />
        ) : !!!item?.replyConversationObject && item?.attachmentCount > 0 ? (
          <AttachmentConversations
            navigation={navigation}
            isIncluded={isIncluded}
            item={item}
            isTypeSent={isTypeSent}
            openKeyboard={() => {
              openKeyboard();
            }}
            longPressOpenKeyboard={() => {
              longPressOpenKeyboard();
            }}
            handleFileUpload={handleFileUpload}
          />
        ) : item?.state === 10 ? (
          <View
            style={[
              styles.pollMessage,
              isTypeSent ? styles.sentMessage : styles.receivedMessage,
              isIncluded
                ? {backgroundColor: STYLES.$COLORS.SELECTED_BLUE}
                : null,
            ]}>
            <PollConversationView
              navigation={navigation}
              item={item}
              isIncluded={isIncluded}
              openKeyboard={() => {
                openKeyboard();
              }}
              longPressOpenKeyboard={() => {
                longPressOpenKeyboard();
              }}
            />
          </View>
        ) : (
          <View>
            {isItemIncludedInStateArr ? (
              <View>
                {/* state 19 is for the reject DM state message */}
                {/* Logic is when to show TAP TO UNDO => 
                      Item's state == 19 && 
                      conversation array's first element's ID == 19 && 
                      conversations[0]?.id == item?.id && 
                      chatRequestBy user should be same as user (when we reject DM chat request by changes to the person who rejected the request)
                */}
                {item?.state === 19 &&
                conversations[0]?.state === 19 &&
                conversations[0]?.id === item?.id &&
                (!!chatroomWithUser
                  ? chatroomWithUser?.id == userIdStringified
                  : null) ? (
                  <Pressable
                    onPress={() => {
                      handleTapToUndo();
                    }}
                    style={[styles.statusMessage]}>
                    <Text
                      style={[
                        styles.textCenterAlign,
                        {
                          color: STYLES.$COLORS.PRIMARY,
                          fontFamily: STYLES.$FONT_TYPES.LIGHT,
                        },
                      ]}>
                      {`${item?.answer} `}
                      <Text
                        style={{
                          color: STYLES.$COLORS.LIGHT_BLUE,
                          fontFamily: STYLES.$FONT_TYPES.LIGHT,
                        }}>
                        Tap to undo.
                      </Text>
                    </Text>
                  </Pressable>
                ) : (
                  <View style={[styles.statusMessage]}>
                    <Text style={styles.textCenterAlign}>
                      {
                        // State 1 refers to initial DM message, so in that case trimming the first user name
                        item?.state === 1 && chatroomType === status.dmChatroom
                          ? decode(
                              answerTrimming(item?.answer),
                              true,
                              false,

                              conversationCreator,

                              chatroomWithUserUuid,
                              chatroomWithUserMemberId,
                            )
                          : decode(
                              item?.answer,
                              true,
                              false,

                              conversationCreator,

                              chatroomWithUserUuid,
                              chatroomWithUserMemberId,
                            )
                      }
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View
                style={[
                  styles.alignMessage,
                  {
                    justifyContent: isTypeSent ? 'flex-end' : 'flex-start',
                  },
                ]}>
                <View
                  style={[
                    styles.message,
                    isTypeSent ? styles.sentMessage : styles.receivedMessage,
                    isIncluded
                      ? {backgroundColor: STYLES.$COLORS.SELECTED_BLUE}
                      : null,
                  ]}>
                  {!!(item?.member?.id == userIdStringified) ? null : (
                    <Text style={styles.messageInfo} numberOfLines={1}>
                      {item?.member?.name}
                      {!!item?.member?.customTitle ? (
                        <Text
                          style={
                            styles.messageCustomTitle
                          }>{` • ${item?.member?.customTitle}`}</Text>
                      ) : null}
                    </Text>
                  )}
                  <Text>{decode(item?.answer, true)}</Text>
                  <View style={styles.alignTime}>
                    {item?.isEdited ? (
                      <Text style={styles.messageDate}>{`Edited • `}</Text>
                    ) : null}
                    <Text style={styles.messageDate}>{item?.createdAt}</Text>
                  </View>
                </View>
                {(reactionArr.length > 0 ||
                  item?.answer?.split('').length > 100) &&
                !isTypeSent ? (
                  <Pressable
                    onLongPress={handleLongPress}
                    delayLongPress={200}
                    onPress={handleOnPress}>
                    <Image
                      style={{
                        height: 25,
                        width: 25,
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/images/add_more_emojis3x.png')}
                    />
                  </Pressable>
                ) : null}
                {/* <View
                  style={[
                    styles.message,
                    isTypeSent ? styles.sentMessage : styles.receivedMessage,
                    isIncluded
                      ? {backgroundColor: STYLES.$COLORS.SELECTED_BLUE}
                      : null,
                  ]}>
                  <PollConversationView />
                </View> */}
              </View>
            )}
          </View>
        )}

        {!isItemIncludedInStateArr ? (
          <View>
            {isTypeSent ? (
              <View
                style={[
                  styles.typeSent,
                  isIncluded
                    ? {
                        borderBottomColor: STYLES.$COLORS.SELECTED_BLUE,
                        borderLeftColor: STYLES.$COLORS.SELECTED_BLUE,
                      }
                    : null,
                ]}
              />
            ) : (
              <View
                style={[
                  styles.typeReceived,
                  isIncluded
                    ? {
                        borderBottomColor: STYLES.$COLORS.SELECTED_BLUE,
                        borderRightColor: STYLES.$COLORS.SELECTED_BLUE,
                      }
                    : null,
                ]}
              />
            )}
          </View>
        ) : null}
      </View>

      {!item?.deletedBy ? (
        reactionLen > 0 && reactionLen <= 2 ? (
          <View
            style={[
              isTypeSent
                ? styles.reactionSentParent
                : styles.reactionReceivedParent,
            ]}>
            {reactionArr.map((val: any, index: any) => (
              <TouchableOpacity
                onLongPress={handleLongPress}
                delayLongPress={200}
                onPress={event => {
                  handleReactionOnPress(event, val?.reaction);
                }}
                style={[
                  styles.reaction,
                  isIncluded
                    ? {backgroundColor: STYLES.$COLORS.SELECTED_BLUE}
                    : {backgroundColor: 'white'},
                ]}
                key={val + index}>
                <Text>{val?.reaction}</Text>
                <Text style={styles.messageText}>{val?.memberArr?.length}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : reactionLen > 2 ? (
          <View
            style={
              isTypeSent
                ? styles.reactionSentParent
                : styles.reactionReceivedParent
            }>
            <TouchableOpacity
              onLongPress={handleLongPress}
              delayLongPress={200}
              onPress={event => {
                handleReactionOnPress(event, reactionArr[0]?.reaction);
              }}
              style={[
                styles.reaction,
                isIncluded
                  ? {backgroundColor: STYLES.$COLORS.SELECTED_BLUE}
                  : {backgroundColor: 'white'},
              ]}>
              <Text>{reactionArr[0]?.reaction}</Text>
              <Text style={styles.messageText}>
                {reactionArr[0]?.memberArr?.length}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onLongPress={handleLongPress}
              delayLongPress={200}
              onPress={event => {
                handleReactionOnPress(event, reactionArr[1]?.reaction);
              }}
              style={[
                styles.reaction,
                isIncluded
                  ? {backgroundColor: STYLES.$COLORS.SELECTED_BLUE}
                  : {backgroundColor: 'white'},
              ]}>
              <Text>{reactionArr[1]?.reaction}</Text>
              <Text style={styles.messageText}>
                {reactionArr[1]?.memberArr?.length}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onLongPress={handleLongPress}
              delayLongPress={200}
              onPress={event => {
                handleReactionOnPress(event, null);
              }}
              style={[
                styles.moreReaction,
                isIncluded
                  ? {backgroundColor: STYLES.$COLORS.SELECTED_BLUE}
                  : {backgroundColor: STYLES.$COLORS.TERTIARY},
              ]}>
              <View>
                <Image
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                  }}
                  source={require('../../assets/images/more_dots3x.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : null
      ) : null}

      <ReactionGridModal
        defaultReactionArr={item?.reactions}
        reactionArr={reactionArr}
        modalVisible={modalVisible}
        selectedReaction={selectedReaction}
        setModalVisible={val => {
          setModalVisible(val);
        }}
        removeReaction={(reactionArr: any, removeFromList?: any) => {
          removeReaction(item, reactionArr, removeFromList);

          //logic to check clicked index and findIndex are same so that we can remove reaction
          let index = item?.reactions.findIndex(
            (val: any) => val?.member?.id == userIdStringified,
          );

          if (
            index !== -1 &&
            item?.reactions[index]?.member?.id == reactionArr?.id // this condition checks if clicked reaction ID matches the findIndex ID
          ) {
            setModalVisible(false);
          }
        }}
      />
    </View>
  );
};

export default Messages;
