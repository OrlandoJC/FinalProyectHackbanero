import { StackNavigator } from 'react-navigation'

import { HomeScreen, Pan, Animation, LayoutAnimation } from '../views'

export default StackNavigator({
  Home: { screen: HomeScreen },
  Animation: { screen: Animation },
  Pan: { screen: Pan },
  LayoutAnimation: { screen: LayoutAnimation }
}, {
  headerMode: 'none'
})
