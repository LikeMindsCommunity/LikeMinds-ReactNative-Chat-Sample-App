import {Platform, StyleSheet} from 'react-native';
import STYLES from '../../constants/Styles';
import Layout from '../../constants/Layout';

export const styles = StyleSheet.create({
  page: {
    backgroundColor: STYLES.$BACKGROUND_COLORS.LIGHT,
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: STYLES.$PADDINGS.MEDIUM,
    alignItems: 'center',
    backgroundColor: STYLES.$COLORS.TERTIARY,
  },
  avatar: {
    width: STYLES.$AVATAR.WIDTH,
    height: STYLES.$AVATAR.HEIGHT,
    borderRadius: STYLES.$AVATAR.BORDER_RADIUS,
    marginRight: STYLES.$MARGINS.SMALL,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: -3,
    // backgroundColor: 'pink',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.PRIMARY,
  },
  participantsTitle: {
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.PRIMARY,
  },
  headingContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  backBtn: {height: 40, width: 40, resizeMode: 'contain'},
  search: {height: 20, width: 20, resizeMode: 'contain'},
  chatRoomInfo: {gap: 5},
  participants: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'pink',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  input: {
    // flexGrow: 1,
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.SECONDARY,
    paddingVertical: 10,
    marginBottom: 2,
    // backgroundColor: 'pink',
    width: Layout.window.width - 150,
  },
  selected: {
    backgroundColor: STYLES.$COLORS.PRIMARY,
    height: 25,
    width: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    position: 'absolute',
    right: 5,
    bottom: 0,
  },
});
