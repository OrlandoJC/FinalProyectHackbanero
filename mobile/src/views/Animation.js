import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text, View, Animated, Easing } from 'react-native'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

class Animation extends Component {
  state = { height: new Animated.Value(100) }

  handleAnimation = () => {
    const { height } = this.state
    height.setValue(100)
    Animated.timing(height, {toValue: 500, duration: 300, delay: 0, easing: Easing.bezier(0.4, 0.0, 0.2, 1)}).start()
  }

  render () {
    const { height } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Estas en Anitaion View
        </Text>
        <AnimatedTouchableOpacity
          onPress={this.handleAnimation}
          style={[styles.button, {height}]}>
          <Text>Spring</Text>
        </AnimatedTouchableOpacity>
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
  button: {
    backgroundColor: 'blue'
  }
})

export default Animation
