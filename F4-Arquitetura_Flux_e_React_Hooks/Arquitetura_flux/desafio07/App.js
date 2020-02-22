import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.Welcome}>Welcome to React</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  Welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;
