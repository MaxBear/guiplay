import {DIAL_API_REQUEST_START} from '../constants/ActionTypes'
import axios from 'axios'

export default {
  makeHttpRequest: (url, method, data, state, dispatch, cb) => {
    if (url.endsWith("/dial")) {
      dispatch({
        type: DIAL_API_REQUEST_START,
        data: data,
      })
    }
    axios({
      method: method,
      url: url,
      // headers: {},
      auth: {
        username: process.env.REACT_APP_API_USER,
        password: process.env.REACT_APP_API_PASSWORD
      },
      data: data
    })
    .then(response=>{
      cb(response)
    })
    .catch(error=>{
      cb(error.response)
    })
  }
}
