import AdminLogin from '../components/AdminLogin'
import React from 'react'
import { connect } from 'react-redux'
import { login } from '../actions'
import { withRouter } from 'react-router-dom'

const AdminLoginContainer = (props) => {
   return (
      <AdminLogin {...props}/>
   )
}

const mapStateToProps = (state, ownProps) => {
   return {
      location: ownProps.location,
      Authenticated: false,
   }
}

export default withRouter(connect(
   mapStateToProps,
   {login}
)(AdminLoginContainer))
