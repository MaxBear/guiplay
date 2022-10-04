import {DIAL_API_REQUEST_START, RECEIVE_DIALED_SESSION} from '../constants/ActionTypes'

const DialApiCalls = (state={}, action) => {
  var key = ""
  switch (action.type) {
    case DIAL_API_REQUEST_START:
      var {website, UserId} = action.data;
      key = website + ":" + UserId;
      if (!Object.keys(state).includes(key)) {
        return {
          [key]: 1
        }
      }
      return {
        [key]: state[key] + 1
      };
    case RECEIVE_DIALED_SESSION:
      ({Product:website, UserId} = action.DialedSession.Request);
      key = website + ":" + UserId;
      var clone = {...state}
      if (Object.keys(clone).includes(key)) {
        clone[key] -= 1
        if (clone[key]===0) {
          delete clone[key]
        }
      }
      return clone
    default:
      return state
  }
}

export default DialApiCalls

export const existPendingDialedSessions = (state, website, UserId) => {
  const key = website + ":" + UserId
  return Object.keys(state).includes(key) && state[key]>0
}
