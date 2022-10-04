import {RECEIVE_DIALED_SESSION, RECEIVE_VIDEO_SESSIONS} from '../constants/ActionTypes'
import {RECEIVE_STOPPED_SESSION, REMOVE_FAILED_SESSION} from '../constants/ActionTypes'

import { combineReducers } from 'redux'

const SessionKey = (sess) => {
  const {SessionId, RendServerIp, StartEpoch} = sess
  return SessionId + "_" + RendServerIp + "_" + StartEpoch;
}

function ip2int(ip) {
    return ip.split('.').reduce(function(ipInt, octet) { return (ipInt<<8) + parseInt(octet, 10)}, 0) >>> 0;
}

const VideoSession = (state={}, action) => {
   switch(action.type) {
      default:
      return state
   }
}

function UnpackDialedSessionResp(resp) {
  const {RendServerIp, SessionId, StartEpoch} = resp.Response
  const sess = {
    SessionId,
    RendServerIp: ip2int(RendServerIp),
    StartEpoch
  }
  return SessionKey(sess)
}

function UnpackStoppedSessionResp(resp) {
  const {Request: request, Response: response} = resp
  const {SessionId, StartEpoch} = request
  const {RendServerIp} = response
  const sess = {
    SessionId,
    RendServerIp: ip2int(RendServerIp),
    StartEpoch
  }
  return SessionKey(sess)
}

function MakeSessions(VideoSessions) {
  return VideoSessions.reduce((obj, session) =>{
    obj[SessionKey(session)] = session
    return obj
  }, {})
}

const byId = (state={}, action) => {
  var sessKey = ""
  var sessions = {}
  switch(action.type) {
    case RECEIVE_DIALED_SESSION:
      sessKey = UnpackDialedSessionResp(action.DialedSession)
      const {VideoTag, DstAddr,} = action.DialedSession.Request;
      const {SessionId, RendServerIp, StartEpoch, RendServerHostname} = action.DialedSession.Response;
      if (action.DialedSession.Error==="") {
        return {
          ...state,
          [sessKey]: {
            RendServerHostname,
            SessionId,
            RendServerIp: ip2int(RendServerIp),
            VideoTag,
            DstAddr,
            Est: 0,
            StartEpoch,
            StopEpoch: 0,
            Status: "PENDING"
          }
        }
      }
      return state
    case RECEIVE_VIDEO_SESSIONS:
      var activeSessions = MakeSessions(action.VideoSessions)
      sessions = {
        ...state,
        ...activeSessions}
      Object.keys(sessions).forEach((item, i) => {
        if (!Object.keys(activeSessions).includes(item) && sessions[item].Status==="STARTED") {
          sessions[item].Status = "FINISHED"
        }
      });
      // delete all the "finished" sessions
      Object.keys(sessions).filter(item => sessions[item].Status==="FINISHED").forEach((item, i) => {
        delete sessions[item]
      });
      action.FailedVideoSessions.forEach((item, i) => {
        sessKey = SessionKey(item)
        if (Object.keys(sessions).includes(sessKey)) {
          sessions[sessKey].Status = "FAILED"
          sessions[sessKey].Error = "Unable to establish video session"
        }
      });
      return sessions
    case RECEIVE_STOPPED_SESSION:
      sessKey = UnpackStoppedSessionResp(action.StoppedSession)
      sessions = {...state}
      if (Object.keys(sessions).includes(sessKey)) {
        // remove session from list of active sessins
        delete sessions[sessKey]
      }
      return sessions
    case REMOVE_FAILED_SESSION:
      sessKey = SessionKey(action.Session)
      if (Object.keys(sessions).includes(sessKey)) {
        delete sessions[sessKey]
      }
      return state
    default:
      if (action.RendServerIp && action.SessionId && action.StartEpoch) {
        sessKey = SessionKey(action);
        return {
          ...state,
          [sessKey]: {...VideoSession(state[sessKey], action)}
        }
      }
      return state
  }
}

// remove from target item in ids array
function RemoveIds(ids, target) {
  ids.forEach((id, i) => {
    var idx = target.indexOf(id)
    if (idx>=0) {
      target = [...target.slice(0, idx), ...target.slice(idx+1)]
    }
  });
  return target
}

const Ids = (state = {ActiveIds:[], PendingIds:[]}, action) => {
  var sessKey = ""
  var clone = {}
  switch (action.type) {
    case RECEIVE_DIALED_SESSION:
      sessKey = UnpackDialedSessionResp(action.DialedSession)
      if (action.DialedSession.Error==="") {
        if (!state.PendingIds.includes(sessKey)) {
          state = {
            ...state,
            PendingIds:[sessKey].concat(state.PendingIds)
          }
        }
        if (!state.ActiveIds.includes(sessKey)) {
          state = {
            ...state,
            ActiveIds:[sessKey].concat(state.ActiveIds)
          }
        }
        return state
      }
      return state
    case RECEIVE_VIDEO_SESSIONS:
      var activeSessions = MakeSessions(action.VideoSessions)
      var failedSessions = MakeSessions(action.FailedVideoSessions)
      var finishedSessionIds = []
      var activeSessionIds = Object.keys(activeSessions)
      state.ActiveIds.forEach((item, i) => {
        if (!state.PendingIds.includes(item) &&
          !Object.keys(activeSessions).includes(item) &&
          !Object.keys(failedSessions).includes(item)) {
          finishedSessionIds.push(item)
        }
        if (Object.keys(failedSessions).includes(item)) {
          activeSessionIds = [...activeSessionIds, item]
        }
      });
      clone = {
        ...state,
        ActiveIds: [...activeSessionIds]
      }
      // remove finished sessions and clean up pending MakeSessions
      state =  {
        ActiveIds: RemoveIds(finishedSessionIds, clone.ActiveIds),
        PendingIds: RemoveIds([...Object.keys(activeSessions), ...Object.keys(failedSessions)], clone.PendingIds)
      }
      return state
    case RECEIVE_STOPPED_SESSION:
      sessKey = UnpackStoppedSessionResp(action.StoppedSession)
      clone = state
      return {
        ActiveIds: RemoveIds([sessKey], clone.ActiveIds),
        PendingIds: RemoveIds([sessKey], clone.PendingIds),
      }
    case REMOVE_FAILED_SESSION:
      sessKey = SessionKey(action.Session)
      return {
        ...state,
        ActiveIds: RemoveIds([sessKey], state.ActiveIds),
      }
    default:
      return state
  }
}

export default combineReducers({
   byId,
   Ids,
})

export const getVideoSessionById = (state, id) => {
  return state.byId[id]
}

export const getVideoSessions = (state) => {
  var ids = state.Ids.ActiveIds
  state.Ids.PendingIds.forEach((item, i) => {
    if (!ids.includes(item)) {
      ids.push(item)
    }
  });
  var sessions = ids.map(id=>getVideoSessionById(state, id))
  // sort ids by session start epoch
  var sortedSessions = sessions.sort((a,b) =>{
    a = a.StartEpoch
    b = b.StartEpoch
    return a < b ? 1 : (a>b ? -1:0)
  })
  return sortedSessions
}
