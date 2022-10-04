import * as app_const from '../constants/Others'

import React, {Component} from 'react'
import {authenticate, initPinPad, setPinCode} from '../actions'
import {getPassword, getPasswordLength} from '../reducers/PinPad'

import Dialog from '@material-ui/core/Dialog';
import DigitTextField from '../components/DigitTextField'
import Grid from '@material-ui/core/Grid';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core/styles';

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

class LoginContainer extends Component{
  render() {
    const {PasswordLength, Password, website, authenticate} = this.props
    if (PasswordLength===app_const.NUM_PASSWORD_DIGITS) {
      authenticate(website, Password)
    }
    return (
      <Dialog aria-labelledby="customized-dialog-title" open={true}>
        <DialogContent dividers>
          <Typography style={{fontSize:'12px'}}>PIN</Typography>
          <Grid container spacing={1} style={{display: 'flex', alignItems: 'center'}}>
            {this.props.PinIds.map(i=> {
              const {NextPinIdx, setPinCode} = this.props
              var pin = this.props.PinCodeById[i]
              return (
                <Grid container item xs={2} key={i}>
                  <DigitTextField Idx={i} PinValue={pin} NextPinIdx={NextPinIdx} setPinCode={setPinCode}/>
                </Grid>
              )
            })}
          </Grid>
        </DialogContent>
      </Dialog>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    website: ownProps.website,
    Authenticated: state.UserSession.Authenticated,
    PinIds : state.PinPad.Ids,
    PinCodeById: state.PinPad.byId,
    NextPinIdx: state.PinPad.NextIdx,
    Password: getPassword(state.PinPad),
    PasswordLength: getPasswordLength(state.PinPad),
  }
}

export default connect(
  mapStateToProps,
  {
    initPinPad,
    setPinCode,
    authenticate
  }
)(LoginContainer)
