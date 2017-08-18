import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import { AsyncStorage } from 'react-native'
import { persistStore, autoRehydrate } from 'redux-persist'
import devTools from 'remote-redux-devtools'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import AppNavigator from '../routes'

const API_URL = 'http://localhost:3000/graphql'

const initialState = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams('Login')
)

const navReducer = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state
}

const networkInterface = createNetworkInterface({
  uri: API_URL
})

export const client = new ApolloClient({networkInterface})

const reducers = combineReducers({
  apollo: client.reducer(),
  navigation: navReducer
})

const enhancer = compose(
  applyMiddleware(client.middleware()),
  autoRehydrate(),
  devTools({ realtime: true })
)

export const store = createStore(reducers, enhancer)
// persistStore(store, { storage: AsyncStorage })