import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import AdminLoginContainer from './AdminLoginContainer'
import { Provider } from 'react-redux'
import React from 'react'
import VideoAssetsContainer from './VideoAssetsContainer'

const Root = ({store}) => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={AdminLoginContainer} />
          <Route path="/:website(\S+)" component={VideoAssetsContainer} />
        </Switch>
      </Router>
    </Provider>
  )
}

export default Root
