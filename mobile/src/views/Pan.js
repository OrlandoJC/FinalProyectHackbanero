import React, { Component } from 'react'
import { StyleSheet, PanResponder, Text, View } from 'react-native'

class Pan extends Component {
  state = { grant: false, offsetLeft: 0, offsetTop: 0 }
  panResponder = {}

  componentWillMount () {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd
    })
  }

  handleStartShouldSetPanResponder = () => {
    return true
  }

  handlePanResponderGrant = () => {
    this.setState({ grant: true })
  }

  handlePanResponderMove = (e, gestureState) => {
    this.setState({
      offsetLeft: gestureState.dx
    })
  }

  handlePanResponderEnd = () => {
    this.setState({ grant: false })
  }

  render () {
    const { grant, offsetLeft, offsetTop } = this.state
    const reponderStyles = {
      backgroundColor: grant ? 'blue' : 'gray',
      top: offsetTop + 100,
      left: offsetLeft + 100
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Estas en Pan View
        </Text>

        <View
          {...this.panResponder.panHandlers}
          style={[styles.responder, reponderStyles]}
        />
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
  responder: {
    height: 100,
    width: 100
  }
})

export default Pan
