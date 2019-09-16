import React from 'react';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import styles from './styles';
import UserSearch from '../components/UserSearch';

class UserSearchScreen extends React.Component {
  state = {};

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <View style={styles.container}>
        <UserSearch />
      </View>
    );
  }
}

export default UserSearchScreen;
