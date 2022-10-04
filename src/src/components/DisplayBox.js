import * as colors from '../constants/StyleColors'

import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import React from 'react';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { theme } from '../theme'

const useStyles = makeStyles((theme) => ({
  box: {
    margin: theme.spacing(1,0),
    padding: theme.spacing(2,0,2,0),
    backgroundColor: fade(colors.IVR_PLAY_BOX_GREY, 0.7),
    width: '100vw',
    display: 'flex'
  },
}))

export default function DisplayBox(props) {
  const classes = useStyles();
  return (
    <MuiThemeProvider theme={theme}>
      <Box borderRadius={10} className={classes.box}>
        {props.children}
      </Box>
    </MuiThemeProvider>
  )
}
