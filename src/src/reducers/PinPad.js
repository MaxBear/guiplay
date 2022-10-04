import * as app_const from '../constants/Others'

import {INIT_PINS, SET_PIN} from '../constants/ActionTypes'

import { combineReducers } from 'redux'
import moment from 'moment'

const byId = (state={}, action) => {
  switch(action.type) {
    case INIT_PINS:
      return action.Pins
    case SET_PIN:
      const {PinCode, Idx} = action
      var NewPinCode = state[Idx]
      if (isDigit(PinCode)){
        NewPinCode = PinCode
      } else if (PinCode==="Backspace") {
        NewPinCode = ""
      }
      return {
        ...state,
        [Idx]: NewPinCode,
      }
    default:
      return state
  }
}

const Ids = (state=[], action) => {
  switch(action.type) {
    case INIT_PINS:
      return Object.keys(action.Pins).map(id => parseInt(id, 10))
    case SET_PIN:
      return state
    default:
      return state
  }
}

const NextIdx = (state={Idx:0, Ts:0}, action) => {
  switch(action.type) {
    case INIT_PINS:
      return {Idx:0, Ts:0}
    case SET_PIN:
      if (isDigit(action.PinCode)){
        // only update timestamp when a digit is entered
        return {Idx: (action.Idx + 1) % app_const.NUM_PASSWORD_DIGITS, Ts: moment.utc()}
      }
      return state
    default:
      return state
  }
}

export default combineReducers({
  byId,
  Ids,
  NextIdx,
})

export const isDigit = (d) => {
  return !isNaN(parseInt(d, 10))
}

export const getPinById = (state, idx) => {
  return state.byId[idx]
}

export const nextPinIdx = (state) => {
  return NextIdx
}

export const getPasswordLength = (state) => {
  return state.Ids.filter(idx => isNaN(parseInt(state.byId[idx], 10))===false).length;
}

export const getPassword = (state) => {
  return state.Ids.reduce((obj, idx) =>{
     return obj += state.byId[idx]
  }, "")
}
