import React, {Component} from 'react'

import Alert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  alert: {
    fontSize: "12px",
  }
});

class PlayAlert extends Component{
  handleClose = (e, msgid) => {
    this.props.removeAlert(msgid)
  }

  render() {
    const {classes, msgid, severity, message} = this.props
    return (
      <Alert
        variant="filled"
        severity={severity}
        classes={{root:classes.alert}}
        onClose={(e) => this.handleClose(e, msgid)}>
        {message}
      </Alert>
    )
  }
}

export default withStyles(styles)(PlayAlert)
