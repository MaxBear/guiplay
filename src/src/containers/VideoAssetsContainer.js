import React, {Component} from 'react'
import {initPinPad, initWebsites, playVideoAsset} from '../actions'

import CircularIndeterminate from '../components/Spinner'
import ControlPanel from '../components/ControlPanel'
import LoginContainer from './LoginContainer'
import PlayAlertsContainer from './PlayAlertsContainer'
import VideoStatusContainer from './VideoStatusContainer'
import Website from '../components/Website'
import {connect} from 'react-redux'
import {existPendingDialedSessions} from '../reducers/DialApiCalls'
import {getVideoAssets} from '../reducers/VideoAssets'
import {isValidWebsite} from '../reducers/Websites'
import {withRouter} from 'react-router-dom'

class VideoAssetsContainer extends Component {
  _isMounted = false

  componentDidMount() {
    const {initPinPad, initWebsites} = this.props
    initPinPad()
    initWebsites()
  }

  render(){
    const {Authenticated, website, UserId, Admin, pendingDialedSessions} = this.props
    const {ValidWebsite, NumValidWebsites, VideoAssetsLookup} =  this.props
    return (
      <div>
        {NumValidWebsites > 0  ? <React.Fragment>
          {!Authenticated && <LoginContainer website={website}/>}
          {pendingDialedSessions>0 && <CircularIndeterminate website={website}/>}
          <PlayAlertsContainer />
          <Website website={website} ValidWebsite={ValidWebsite}>
              <ControlPanel {...this.props} />
              {Authenticated && <VideoStatusContainer UserId={UserId} Admin={Admin} website={website} VideoAssetsLookup={VideoAssetsLookup}/>}
          </Website>
        </React.Fragment>:null}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {website} = ownProps.match.params
  const {UserId, Authenticated, Admin} = state.UserSession;
  return {
    website,
    ValidWebsite: isValidWebsite(state.Websites, website),
    NumValidWebsites: state.Websites.Ids.length,
    Authenticated,
    UserId,
    Admin,
    videos: getVideoAssets(state.VideoAssets),
    pendingDialedSessions: existPendingDialedSessions(state.DialApiCalls, website, UserId),
    VideoAssetsLookup: state.VideoAssets.byId,
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    initPinPad,
    initWebsites,
    playVideoAsset
  }
)(VideoAssetsContainer))
