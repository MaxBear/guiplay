import React, {Component} from 'react'
import {getUserVideoSessions, receiveDialedSession, receiveStoppedSession} from '../actions'
import {removeFailedVideoSession, stopVideoSession} from '../actions'

import VideoStatus from '../components/VideoStatus'
import { connect } from 'react-redux'
import { getVideoSessions } from '../reducers/VideoSessions'

class VideoStatusContainer extends Component{
  state = {
      time: Date.now(),
      websocket: null,
  }

  timeout = 250; // Initial timeout duration as a class variable

  connect = () => {
    const {website, UserId, receiveDialedSession, receiveStoppedSession} = this.props
    var ws
    if (process.env.NODE_ENV!=="development") {
      ws = new WebSocket('wss://' + process.env.REACT_APP_WSS_USER + ':' + process.env.REACT_APP_WSS_PASSWORD + '@' + process.env.REACT_APP_API_HOST + '/play/api/ws/' + website + '/' + UserId);
    } else {
      ws = new WebSocket('wss://' + process.env.REACT_APP_API_HOST + ':5004/play/api/ws/' + website + '/' + UserId);
    }

    let that = this; // cache the this
    var connectInterval;

    // websocket onopen event listener
    ws.onopen = () => {
      this.setState({ websocket: ws });

      that.timeout = 250; // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    // websocket onclose event listener
    ws.onclose = e => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      );

      that.timeout = that.timeout + that.timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    ws.onerror = err => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      ws.close();
    };

    ws.onmessage = (msg) => {
      var data = JSON.parse(msg.data)
      if (process.env.NODE_ENV==="development") {
        console.log(data);
      }
      switch(data.ResponseType) {
        case "dial":
          receiveDialedSession(data);
          break;
        case "hangup":
          receiveStoppedSession(data);
          break;
        default:
          break
      }
    };
  };

  check = () => {
    const { websocket } = this.state;
    if (!websocket || websocket.readyState === WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
  };

  componentDidMount() {
    const {website, UserId, getUserVideoSessions} = this.props

    this.interval = setInterval(() => {
      this.setState({time: Date.now()})
      getUserVideoSessions(website, UserId)
    }, 5000);

    if (this.state.websocket==null) {
      this.connect();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {UserId, time, website, Admin, ActiveVideoSessions, VideoAssetsLookup} = this.props
    const {stopVideoSession, removeFailedVideoSession} = this.props
    return (
      <VideoStatus time={time}
        website={website}
        UserId={UserId}
        Admin={Admin}
        ActiveVideoSessions={ActiveVideoSessions}
        VideoAssetsLookup={VideoAssetsLookup}
        stopVideoSession={stopVideoSession}
        removeFailedVideoSession={removeFailedVideoSession}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {VideoAssetsLookup} = ownProps
  const {UserId, Authenticated} = state.UserSession;
  return {
    Authenticated,
    UserId,
    VideoAssetsLookup,
    ActiveVideoSessions: getVideoSessions(state.VideoSessions),
  }
}

export default connect(
  mapStateToProps,
  {
    stopVideoSession,
    removeFailedVideoSession,
    receiveDialedSession,
    receiveStoppedSession,
    getUserVideoSessions
  }
)(VideoStatusContainer)
