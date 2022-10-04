import {RECEIVE_ALERT, REMOVE_ALERT} from '../constants/ActionTypes'

import { combineReducers } from 'redux'

const Alert = (state={}, action) => {
   switch(action.type) {
      default:
      return state
   }
}

const byId = (state={}, action) => {
  switch(action.type) {
    case RECEIVE_ALERT:
      return {
        // replace instead of append errors
        // ...state,
        [action.Id] : {
          Type: action.AlertType,
          Message: action.Message
        }
      }
    case REMOVE_ALERT:
      let clone = {...state}
      delete clone[action.Id]
      return clone
    default:
      const { Id } = action
      if (Id) {
        return {
          ...state,
          [Id]: Alert(state[Id], action)
        }
      }
      return state
  }
}

const Ids = (state=[], action) => {
  switch(action.type) {
    case RECEIVE_ALERT:
      return [...state, action.Id]
    case REMOVE_ALERT:
      let idx = state.indexOf(action.Id)
      return [...state.slice(0, idx), ...state.slice(idx+1)]
    default:
      return state
  }
}

export default combineReducers({
  byId,
  Ids,
})

export const getAlerts = (state) => {
  return state.byId
}
