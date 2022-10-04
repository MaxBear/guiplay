import {INIT_WEBSITES} from '../constants/ActionTypes'
import { combineReducers } from 'redux'

const byId = (state={}, action) => {
  switch(action.type) {
    case INIT_WEBSITES:
      return {
         ...state,
         ...action.websites.reduce((obj, website) =>{
            obj[website.WebsiteId] = website.WebsiteName
            return obj
         }, {})
      }
    default:
      return state
  }
}

const Ids = (state=[], action) => {
  switch(action.type) {
    case INIT_WEBSITES:
      return action.websites.map(website => website.WebsiteId)
    default:
      return state
  }
}

export default combineReducers({
  byId,
  Ids,
})

export const getWebsiteById = (state, idx) => {
  return state.byId[idx]
}

export const isValidWebsite = (state, WebsiteName) => {
  return state.Ids.filter(id => state.byId[id]===WebsiteName).length>0
}
