import { applyMiddleware, createStore } from 'redux'

import React from 'react'
import Root from './containers/Root'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import { render } from 'react-dom'
import thunk from 'redux-thunk'

const middleware = [ thunk ];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

render(
  <Root store={store} />,
  document.getElementById('root')
)
