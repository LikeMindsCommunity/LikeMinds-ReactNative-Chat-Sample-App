import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import STYLES from '../ChatSX/constants/Styles';

const FetchKeyInputScreen = () => {
  const [userUniqueID, setUserUniqueID] = useState('');
  const [userName, setUserName] = useState('');
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleButtonPress = () => {
    // Perform some action when the button is pressed
    // You can access the input values from input1 and input2 variables
    AsyncStorage.setItem('userUniqueID', userUniqueID);
    AsyncStorage.setItem('userName', userName);
    userName && userUniqueID
      ? setIsButtonClicked(true)
      : setIsButtonClicked(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="User unique ID"
        placeholderTextColor={'grey'}
        value={userUniqueID}
        onChangeText={text => setUserUniqueID(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="User Name"
        placeholderTextColor={'grey'}
        value={userName}
        onChangeText={text => setUserName(text)}
      />
      <TouchableOpacity
        style={{
          backgroundColor: STYLES.$COLORS.LIGHT_BLUE,
          padding: 10,
          borderRadius: 10,
        }}
        onPress={handleButtonPress}>
        <Text
          style={{
            color: STYLES.$COLORS.TERTIARY,
            fontSize: STYLES.$FONT_SIZES.XL,
            fontFamily: STYLES.$FONT_TYPES.LIGHT,
          }}>
          Submit
        </Text>
      </TouchableOpacity>

      {!!userUniqueID && !!isButtonClicked ? (
        <Text
          style={{
            color: STYLES.$COLORS.PRIMARY,
            fontSize: STYLES.$FONT_SIZES.MEDIUM,
            fontFamily: STYLES.$FONT_TYPES.LIGHT,
          }}>
          Please kill the app and open it again
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black',
  },
});

export default FetchKeyInputScreen;
