import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { theme } from '../theme'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  main: {
    margin: theme.spacing(5,0),
    // padding: theme.spacing(0,16,0),
  },
  image: {
    backgroundImage: props => `url(${props.url})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  logo: {
    margin: theme.spacing(0,0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  logoText: {
    padding: theme.spacing(4,0,8),
    display: 'flex',
    // backgroundColor: 'yellow'
  },
  controlContainer: {
    margin: theme.spacing(0,0),
    padding: theme.spacing(0,0,0),
    // backgroundColor: 'green',
  },
  footer: {
     // margin: theme.spacing(8,0),
     marginTop: theme.spacing(8),
     paddingTop: theme.spacing(3),
     paddingBottom: theme.spacing(3),
     display: 'flex',
     flexDirection: 'column',
     alignItems: 'center',
     // backgroundColor: 'blue'
  },
}));

export default function Website(props) {
  const {ValidWebsite, website, children} = props;
  const WebsiteName = ValidWebsite ? website : 'demo'
  const styleProps = {
    url:  ValidWebsite ? '/background_images/' + WebsiteName + '.png' : null,
  }
  const classes = useStyles(styleProps);
  return (
    <MuiThemeProvider theme={theme}>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid container justify="center" className={classes.image}>
          <Container className={classes.main}>
            <Grid container className={classes.logo}>
              <Grid item>
                <img src={'/logo_images/' + WebsiteName + '.svg'} alt={website} />
              </Grid>
              <Grid item>
                <Typography variant="h5" component="p" align="center" className={classes.logoText}>
                  Play video in virtual meeting rooms and on video endpoints.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={classes.controlContainer}>
              {children}
            </Grid>
            <Grid container className={classes.footer} spacing={1}>
              <Grid item>
                <img src='/logo_images/play-logo-small.svg' alt='play.vc'/>
              </Grid>
              <Grid item>
                <Typography variant="overline">
                  Version {process.env.REACT_APP_VERSION}
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
}
