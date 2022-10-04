import * as colors from '../constants/StyleColors'

import Button from '@material-ui/core/Button';
import DisplayBox from '../components/DisplayBox'
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment'
import { theme } from '../theme'

const useStyles = makeStyles((theme) => ({
  controlContainer: {
    margin: theme.spacing(0,0),
    padding: theme.spacing(0,0,0),
  },
  button: {
    color : "white",
    margin: theme.spacing(1,0),
    backgroundColor : colors.IVR_PLAY_HALLOWEEN_RED,
  },
  typo: {
    color: colors.IVR_PLAY_BOX_LABEL,
    margin: theme.spacing(0,1),
    textAlign: "left"
  },
  typoBold: {
    color: colors.IVR_PLAY_BOX_LABEL,
    fontWeight: "bold",
    textAlign: "left"
  },
  margin: {
      margin: theme.spacing(1),
    },
  StatusText: {
    // backgroundColor:"yellow",
    display: "flex",
    // alignItems: 'left',
  },
  PaddingGrid: {
    // backgroundColor:"green",
  }
}));

export default function VideoStatus(props) {
  const classes = useStyles();
  const {time, website, Admin, ActiveVideoSessions, VideoAssetsLookup, UserId} = props;
  var dt = moment.utc(time).local().format()

  const handleClickStop = (event, RendServerHostname, SessionId, VideoTag, StartEpoch, UserId) => {
    var params = {
      RendServerHostname,
      SessionId,
      StartEpoch,
      VideoTag,
      UserId
    }
    props.stopVideoSession(website, params)
  };

  const handleRemoveFailed = (event, RendServerIp, SessionId, StartEpoch) => {
    props.removeFailedVideoSession(RendServerIp, SessionId, StartEpoch)
  }

  return (
    <Grid container className={classes.controlContainer}>
      {process.env.NODE_ENV==="development" &&
        <Grid container spacing={2}>
          <Grid item xs={12} style={{display: 'flex', alignItems: 'center'}}>
            <Typography className={classes.typo}>
              {dt}
            </Typography>
          </Grid>
        </Grid>
      }
      {
        ActiveVideoSessions.map((sess, idx) => {
          var StartTime = moment.unix(sess.StartEpoch).local().format()
          var disableButton = sess.Status!=="STARTED" && sess.Status!=="FAILED"
          var buttonLabel = ""
          var buttonBackgroundColor = ""
          if (sess.Status==="FAILED") {
            buttonLabel = "Delete"
            buttonBackgroundColor = "#666C73" 
          } else if (sess.Status==="STARTED"){
            buttonLabel = "STOP"
            buttonBackgroundColor = colors.IVR_PLAY_HALLOWEEN_RED
          } else if (sess.Status==="PENDING") {
            buttonLabel = "PENDING"
            buttonBackgroundColor = "#bdbdbd"
          }
          // var StopTime = sess.StopEpoch===0 ? "" : moment.unix(sess.StopEpoch).local().format()
          var comment = Object.keys(VideoAssetsLookup).includes(sess.VideoTag) ? VideoAssetsLookup[sess.VideoTag].Comment : ""
          return (
            <DisplayBox key={idx}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item sm={1} xs={false} className={classes.PaddingGrid}></Grid>
                    <Grid item sm={3} xs={12} className={classes.StatusText}>
                      <Typography className={classes.typoBold}>
                        Playing:
                      </Typography>
                      <Typography className={classes.typo}>
                        {comment}
                      </Typography>
                    </Grid>
                    <Grid item sm={1} xs={false} className={classes.PaddingGrid}></Grid>
                    <Grid item sm={4} xs={12} className={classes.StatusText}>
                      <Grid container spacing={1}>
                        <Grid sm={12} xs={12} item className={classes.StatusText}>
                          <Typography className={classes.typoBold}>
                            Where:
                          </Typography>
                          <Typography className={classes.typo}>
                            {sess.DstAddr}
                          </Typography>
                        </Grid>
                        <Grid sm={12} xs={12} item className={classes.StatusText}>
                          <Typography className={classes.typoBold}>
                            Status:
                          </Typography>
                          <Typography className={classes.typo}>
                            {sess.Status}
                          </Typography>
                          {sess.Error!=="" &&
                            <Typography className={classes.typo}>
                              {sess.Error}
                            </Typography>
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item sm={1} xs={false} className={classes.PaddingGrid}></Grid>
                    <Grid item sm={1} xs={12} className={classes.StatusText}>
                      <Button className={classes.button}
                        variant="contained"
                        disabled={disableButton}
                        style={{backgroundColor:buttonBackgroundColor}}
                        onClick={sess.Status==="STARTED" ?
                        (e)=>handleClickStop(e, sess.RendServerHostname, sess.SessionId, sess.VideoTag, sess.StartEpoch, UserId) :
                        (e)=>handleRemoveFailed(e, sess.RendServerIp, sess.SessionId, sess.StartEpoch)}
                        >
                          <Typography style={theme.typography.body1}>
                            {buttonLabel}
                          </Typography>
                      </Button>
                    </Grid>
                    <Grid item sm={1} xs={false} className={classes.PaddingGrid}></Grid>
                  </Grid>
                </Grid>
                {Admin &&
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item sm={1} xs={false} className={classes.PaddingGrid}></Grid>
                      <Grid item sm={4} xs={12}  className={classes.StatusText}>
                        <Typography className={classes.typoBold}>
                          StartTime :
                        </Typography>
                        <Typography className={classes.typo}>
                          {StartTime}
                        </Typography>
                      </Grid>
                      {/* <Grid item sm={1} xs={false} className={classes.PaddingGrid}></Grid> */}
                      <Grid item sm={4} xs={12}  className={classes.StatusText}>
                        <Typography className={classes.typoBold}>
                          Server :
                        </Typography>
                        <Typography className={classes.typo}>
                          {sess.RendServerHostname}
                        </Typography>
                      </Grid>
                      <Grid item sm={3} xs={false} className={classes.PaddingGrid}></Grid>
                    </Grid>
                  </Grid>
                }
              </Grid>
            </DisplayBox>
          )
        })
      }
    </Grid>
  );
}
