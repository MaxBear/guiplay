import {SET_USER_SESSION} from '../constants/ActionTypes'

const initialState = {
  UserId: 0,
  Admin: false,
  Authenticated: false,
}

const UserSession = (state=initialState, action) => {
  switch (action.type) {
    case SET_USER_SESSION:
    const {UserId, Authenticated, Admin} = action
    return {
      UserId,
      Authenticated,
      Admin
    }
    default:
    return state
  }
}

export default UserSession
