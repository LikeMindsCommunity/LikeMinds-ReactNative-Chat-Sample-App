import {Platform, StyleSheet} from 'react-native';
import Layout from '../../constants/Layout';
import STYLES from '../../constants/Styles';

export const styles = StyleSheet.create({
  textInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    borderRadius: 30,
    overflow: 'hidden',
    // maxWidth: Layout.window.width - 75,
    width: Layout.window.width - 75,
    borderColor: STYLES.$COLORS.MSG,
    borderWidth: 1,
    // backgroundColor:'pink'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 5,
    margin: 5,
  },
  addMoreButton: {
    padding: 10,
    paddingLeft: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiButton: {
    padding: 10,
  },
  emoji: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  inputParent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingLeft: 0,
    // width: Layout.window.width - 180,
    // width:'65%', // when both emoji and updload icon is there
    // width: '90%', // when none of emoji and updload icon is there
    width: '70%',
  },
  input: {
    flexGrow: 1,
    fontSize: STYLES.$FONT_SIZES.XL,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    maxHeight: 120,
    padding: 0,
    marginBottom: 2,
    overflow: 'scroll',
  },
  sendButton: {
    height: 50,
    width: 50,
    // padding: 15,
    backgroundColor: STYLES.$COLORS.SECONDARY,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    marginLeft: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emojiPicker: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 10,
    // elevation: 2,
  },

  centeredView: {
    flexGrow: 1,
    marginTop: 20,
  },
  modalViewParent: {
    position: 'absolute',
    bottom: 80,
    flexGrow: 1,
    width: Layout.window.width,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    padding: 5,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  alignModalElements: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 20,
  },
  cameraStyle: {backgroundColor: '#06C3AF', padding: 15, borderRadius: 50},
  imageStyle: {backgroundColor: '#9F5BCA', padding: 15, borderRadius: 50},
  docStyle: {backgroundColor: '#9F5BCA', padding: 15, borderRadius: 50},
  replyBoxParent: {
    backgroundColor: 'white',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  replyBox: {marginHorizontal: 10, marginTop: 10},
  replyBoxClose: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: STYLES.$COLORS.SELECTED_BLUE,
    padding: 5,
    borderRadius: 10,
  },
  replyCloseImg: {height: 5, width: 5, resizeMode: 'contain'},
});
