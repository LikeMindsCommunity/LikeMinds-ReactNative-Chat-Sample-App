import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import STYLES from '../ChatSX/constants/Styles';
import {Credentials} from '../ChatSX/credentials';

interface ChildProps {
  isTrue: boolean;
  setIsTrue: (isTrue: boolean) => void;
}

const FetchKeyInputScreen: React.FC<ChildProps> = ({isTrue, setIsTrue}) => {
  const [userUniqueID, setUserUniqueID] = useState('');
  const [userName, setUserName] = useState('');
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleAddNotes = (userUniqueID: string, userName: string) => {
    Credentials.setCredentials(userName, userUniqueID);
  };

  useEffect(() => {
    if (userUniqueID && userName && isButtonClicked) {
      return setIsTrue(!isTrue);
    }
  }, [isButtonClicked]);

  const handleButtonPress = () => {
    // Perform some action when the button is pressed
    // You can access the input values from input1 and input2 variables
    handleAddNotes(userUniqueID, userName);

    userUniqueID && userName
      ? setIsButtonClicked(true)
      : setIsButtonClicked(false);

    if (userUniqueID && userName) {
      Keyboard.dismiss();
    }
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
        value={userName}
        onChangeText={text => setUserName(text)}
        placeholderTextColor={'grey'}
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
