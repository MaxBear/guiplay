import * as app_const from '../constants/Others'
import * as types from '../constants/ActionTypes'

import api from '../api/api'

const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

const guid = () => {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const initPinPad = () => (dispatch, getState) => {
  var Pins = {}
  for (var i=0; i <app_const.NUM_PASSWORD_DIGITS; i++) {
    Pins = {
      ...Pins,
      [i]:"",
    }
  }
  dispatch({
    type: types.INIT_PINS,
    Pins,
  })
}

export const login = credentials => (dispatch, getState) => {
}

export const initWebsites =() => (dispatch, getState) => {
  api.makeHttpRequest("/play/api/products", "GET", {}, getState(), dispatch, result=>{
    if (result.status===200) {
      dispatch({
        type: types.INIT_WEBSITES,
        websites: result.data,
      })
    }
  })
}

export const setPinCode = (Idx,PinCode) => (dispatch, getState) => {
  dispatch({
    type: types.SET_PIN,
    Idx,
    PinCode,
  })
}

const receiveAlert = (AlertType, Message) => ({
  type: types.RECEIVE_ALERT,
  Id: guid(),
  AlertType,
  Message,
})

export const removeAlert = (Id) => (dispatch, getState) => {
  dispatch({
    type: types.REMOVE_ALERT,
    Id,
  })
}

export const receiveDialedSession = (session) => (dispatch, getState) => {
  dispatch({
    type: types.RECEIVE_DIALED_SESSION,
    DialedSession:{...session}
  })
  const {Error} = session
  if (Error!=="") {
    dispatch(receiveAlert("error", Error))
  }
}

export const receiveStoppedSession = (session) => (dispatch, getState) => {
  const {Error} = session
  if (Error==="") {
    dispatch({
      type: types.RECEIVE_STOPPED_SESSION,
      StoppedSession:{...session}
    })
  } else {
    dispatch(receiveAlert("error", Error))
  }
}

export const authenticate = (website, password) => (dispatch, getState) => {
  const url = "/play/api/" + website + "/authenticate"
  api.makeHttpRequest(url, "POST", {"pin": password}, getState(), dispatch, result=>{
    if (result.status===200) {
      const {UserId, Valid, Admin} = result.data
      dispatch({
        type: types.SET_USER_SESSION,
        Authenticated: Valid,
        UserId,
        Admin
      })
      if (Valid) {
        dispatch(getCompanyVideoAssets(website))
        dispatch(getUserVideoSessions(website, UserId))
      }
    }
  })
}

export const getCompanyVideoAssets = (website) => (dispatch, getState) => {
  const url = "/play/api/" + website
  api.makeHttpRequest(url, "GET", {}, getState(), dispatch, result=>{
    if (result.status===200) {
      const {WebsiteId, Videos} = result.data
      dispatch({
        type: types.RECEIVE_COMPANY_VIDEO_ASSETS,
        WebsiteId,
        Videos,
      })
    }
  })
}

export const playVideoAsset = (website, UserId, VideoTag, DstAddr, dtmf, testServer) => (dispatch, getState) => {
  if (VideoTag==="") {
    dispatch(receiveAlert("error", "Please select a video"))
    return
  }
  if (DstAddr==="") {
    dispatch(receiveAlert("error", "Please enter a video address"))
    return
  }
  // remove the trailing space
  var addr = DstAddr.trim()
  // check dst addr
  var regexp = /(?:sips?:)?[^@\s]+@\S+/;
  if (!addr.match(regexp)) {
    dispatch(receiveAlert("error", "Please enter a valid destination address, eg. user@domain.com, sip:user@domain.com"))
    return
  }

  const url = "/play/api/" + website + "/dial"
  api.makeHttpRequest(url, "POST", {
    website,
    VideoTag,
    DstAddr: addr,
    Dtmf: dtmf==="" ? 0 : parseInt(dtmf, 10),
    UserId,
    Test: testServer,
  }, getState(), dispatch, result=>{
    if (result.status!==200) {
      dispatch(receiveAlert("error", result.data))
    }
  })
}

export const getUserVideoSessions = (website, UserId) => (dispatch, getState) => {
  const url = "/play/api/" + website + "/list/" + UserId
  api.makeHttpRequest(url, "GET", {}, getState(), dispatch, result=>{
    switch(result.status) {
      case 200:
        dispatch({
          type: types.RECEIVE_VIDEO_SESSIONS,
          VideoSessions: result.data.RunningSessions,
          FailedVideoSessions: result.data.FailedSessions,
        })
        break;
      case 500:
        console.log(result.data);
        break;
      default:
        console.log(result.status + " " + result.data);

    }
  })
}

export const stopVideoSession = (website, params) => (dispatch, getState) => {
  const url = "/play/api/" + website + "/hangup"
  api.makeHttpRequest(url, "POST", {
    ...params
  }, getState(), dispatch, result=>{
    if (result.status!==200) {
      dispatch(receiveAlert("error", result.data))
    }
  })
}

export const removeFailedVideoSession = (RendServerIp, SessionId, StartEpoch) => (dispatch, getState) => {
  dispatch({
    type: types.REMOVE_FAILED_SESSION,
    Session:{
      RendServerIp,
      SessionId,
      StartEpoch
    }
  })
}
