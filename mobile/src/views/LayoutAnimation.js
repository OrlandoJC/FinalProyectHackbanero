import React, { Component } from 'react'
import { StyleSheet, Text, View, FlatList, Button, LayoutAnimation, UIManager } from 'react-native'

class LayoutAnimationA extends Component {
  constructor () {
    super()

    UIManager.setLayoutAnimationEnabledExperimental
    && UIManager.setLayoutAnimationEnabledExperimental(true)

    this.state = { height: 100, data: [{ val: 1 }] }
  }

  handleAddItem = () => {
    LayoutAnimation.linear()
    this.setState({ height: 300, data: [...this.state.data, { val: 1 }] })
  }

  render () {
    const { height } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Estas en LayoutAnimation
        </Text>

        <Button
          title='Add 1'
          onPress={this.handleAddItem}
        />

        <View style={[styles.box, {height}]} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  box: {
    height: 100,
    width: 100,
    backgroundColor: 'red'
  }
})

export default LayoutAnimationA
