/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Routes from './src/Routes';

const { width, height } = Dimensions.get("window")

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
        <Routes/>
    )
  }
}

const styles = StyleSheet.create({

});
