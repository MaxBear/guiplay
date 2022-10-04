import React, {Component} from 'react'

import PlayAlerts from '../components/PlayAlerts'
import { connect } from 'react-redux'
import { getAlerts } from '../reducers/PlayAlerts'
import { removeAlert } from '../actions'

class PlayAlertsContainer extends Component{
   render() {
     const {alerts, removeAlert} = this.props;
     return (
       <div>
         {
           Object.keys(alerts).map((id, idx) => {
             var alert = alerts[id];
             return <PlayAlerts
               key={idx}
               msgid={id}
               severity={alert.Type}
               message={alert.Message}
               removeAlert={removeAlert}
             />
           })
         }
       </div>
     )
   }
}

const mapStateToProps = (state, ownProps) => {
  return {
    alerts: getAlerts(state.PlayAlerts),
  }
}

export default connect(
  mapStateToProps,
  {
      removeAlert
  }
)(PlayAlertsContainer)
