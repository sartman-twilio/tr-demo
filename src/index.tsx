import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {combineReducers, createStore} from 'redux'
import {reduce} from './state/Reducers'
import {Provider} from 'react-redux'
import {App} from './App'

// ========================================

const store = createStore(reduce)

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'),
)

export default combineReducers({
  reduce,
})
