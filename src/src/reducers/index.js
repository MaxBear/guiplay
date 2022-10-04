import DialApiCalls from './DialApiCalls'
import PinPad from './PinPad'
import PlayAlerts from './PlayAlerts'
import UserSession from './UserSession'
import VideoAssets from './VideoAssets'
import VideoSessions from './VideoSessions'
import Websites from './Websites'
import { combineReducers } from 'redux'

export default combineReducers({
  PinPad,
  Websites,
  UserSession,
  PlayAlerts,
  VideoAssets,
  VideoSessions,
  DialApiCalls
})
