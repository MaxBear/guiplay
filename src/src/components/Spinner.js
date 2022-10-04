import * as colors from '../constants/StyleColors'

import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    // transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    zIndex: '2000',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    // color: colors.IVR_PLAY_HALLOWEEN_RED,
    color: props => props.color,
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

export default function CircularIndeterminate(props) {
  const {website} = props;

  const styleProps = {
    color:  website==="halloween" ? colors.IVR_PLAY_HALLOWEEN_RED : colors.IVR_PLAY_BACKGROUND_DEFAULT,
  }
  const classes = useStyles(styleProps);

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </div>
  );
}
