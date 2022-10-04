import { RECEIVE_COMPANY_VIDEO_ASSETS } from '../constants/ActionTypes'
import { combineReducers } from 'redux'

const Video = (state={}, action) => {
   switch(action.type) {
      default:
      return state
   }
}

const byId = (state={}, action) => {
   switch(action.type) {
      case RECEIVE_COMPANY_VIDEO_ASSETS:
         return {
            ...state,
            ...action.Videos.reduce((obj, video) =>{
               obj[video.Tag] = video
               return obj
            }, {})
         }
      default:
         const { tag } = action
         if (tag) {
            return {
               ...state,
               [tag]: Video(state[tag], action)
            }
         }
         return state
   }
}

const Ids = (state = [], action) => {
   switch (action.type) {
         case RECEIVE_COMPANY_VIDEO_ASSETS:
            return action.Videos.map(video => video.Tag)
         default:
            return state
   }
}

const WebsiteId = (state=0, action) => {
   switch (action.type) {
         case RECEIVE_COMPANY_VIDEO_ASSETS:
            return action.WebsiteId
         default:
            return state
   }
}

export default combineReducers({
   byId,
   Ids,
   WebsiteId
})

export const getVideoAssetById = (state, id) => {
   return state.byId[id]
}

export const getVideoAssets = (state) => {
   return state.Ids.map(id=>getVideoAssetById(state, id))
}
