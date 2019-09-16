import React from 'react';
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  Button,
  TextInput,
} from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import color from '../theme/color';
import unsplashService from '../services/unsplashService';

const BATCH_SIZE = 5;

class UserSearchList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchKey: 'Page',
      isLoading: false,
      page: 1,
      error: null,
    };

    this.dataArray = [];
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = async () => {
    const { page } = this.state;

    this.setState({ isLoading: true });
    console.log(this.state.searchKey);
    unsplashService.searchUsers(this.state.searchKey, 1)
      .then(unsplashService.toJson)
      .then((data) => {
        this.dataArray = page === 1 ? data.results : [...this.dataArray, ...data.results];
        console.log(data.results);
        this.setState({
          error: data.error || null,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
      });
  };

  renderHeader = () => (
    <SearchBar
      placeholder="Type Here..."
      lightTheme
      round
      onChangeText={(text) => this.searchFilterFunction(text)}
      autoCorrect={false}
    />
  );

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      subtitle={item.username}
      leftAvatar={{
        source: item.profile_image.small && { uri: item.profile_image.small },
        title: '',
      }}
      bottomDivider
      chevron
    />
  )

  renderFooter = () => {
    const { isLoading } = this.state;

    if (!isLoading) return null;

    return (
      <ActivityIndicator
        style={{ marginVertical: 24 }}
        size="large"
        color={color.blue}
      />
    );
  };

  getItemLayout = (data, index) => ({
    length: 800,
    index,
  });

  searchFilterFunction = (text) => {
    unsplashService.searchUsers(text, BATCH_SIZE)
      .then(unsplashService.toJson)
      .then((data) => {
        this.dataArray = page === 1 ? data.results : [...this.dataArray, ...data.results];
        this.setState({
          error: data.error || null,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
      });
  };

  render() {
    const { error } = this.state;

    if (error || this.dataArray.length == 0) {
      return (
        <View>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            returnKeyType="search"
            autoFocus
            onKeyPress={this.handleKeyPress}
            onSubmitEditing={this.makeRemoteRequest}
            value={this.state.searchKey}
          />
          <Text style={{ fontSize: 16, color: color.greyDark }}>
            {'Yikes, something went wrong! :o'}
          </Text>
          <Button
            onPress={this.makeRemoteRequest}
            title="Try Again"
            color={color.blue}
          />
        </View>
      );
    }

    return (
      <View>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          returnKeyType="search"
          autoFocus
          onChange={(event) => {
            this.setState({
              searchKey: event.nativeEvent.text,
            });
          }}
          onKeyPress={this.handleKeyPress}
          onSubmitEditing={this.makeRemoteRequest}
          value={this.state.searchKey}
        />
        <FlatList
          data={this.dataArray}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          windowSize={BATCH_SIZE}
        />
      </View>
    );
  }
}

export default UserSearchList;
