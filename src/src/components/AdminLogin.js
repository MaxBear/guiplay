import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import React, {Component} from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import { Redirect } from 'react-router-dom'
import Typography from '@material-ui/core/Typography';
import { theme } from '../theme'

const styles = theme => ({
   main: {
      width: 'auto',
      display: 'block', // Fix IE 11 issue.
      margin: theme.spacing(0,3),
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
         width: 400,
         marginLeft: 'auto',
         marginRight: 'auto',
      },
   },
   paper: {
      margin: theme.spacing(8, 2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(2, 3, 3),
   },
   avatar: {
      margin: theme.spacing(1,0)
   },
   form: {
      width: '100%', // Fix IE 11 issue.
      margin: theme.spacing(0, 0)
   },
   submit: {
      marginTop: theme.spacing(3)
   },
})

class AdminLogin extends Component {
   state = {
      email: "",
      password: "",
   }

   handleEmailInput = (e) => {
      this.setState({email: e.target.value})
   }

   handlePasswordInput = (e) => {
      this.setState({password: e.target.value})
   }

   handleSubmit = (e) => {
      e.preventDefault()
      const {email, password} = this.state
      this.props.login({
         email,
         password,
      })
   };

   render() {
      const { from } = this.props.location.state || { from: { pathname: "/" } };
      const {classes, Authenticated, wrongCredential} = this.props

      if (Authenticated) return <Redirect to={from} />;
      return (
         <MuiThemeProvider theme={theme}>
            <main className={classes.main}>
               <CssBaseline />
               <Paper className={classes.paper}>
                  <Avatar className={classes.avatar} alt="PLAY.VC" src="/logo_images/MnsLogo.png">
                  </Avatar>
                  <Typography component="h1" variant="h5" gutterBottom>
                     Sign in
                  </Typography>
                  {wrongCredential &&
                     <Typography variant="body2" color="error" gutterBottom>
                        Faied to authenticate, please enter a valid username and password
                     </Typography>
                  }
                  <form className={classes.form}>
                     <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <Input id="email" name="email" autoComplete="email" autoFocus onChange={this.handleEmailInput}/>
                     </FormControl>
                     <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input name="password" type="password" id="password" autoComplete="current-password" onChange={this.handlePasswordInput}/>
                     </FormControl>
                     <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.submit}
                        onClick={this.handleSubmit}>
                        <Typography variant="h6" style={{fontWeight:'bold', color:"white"}}>
                          Sign in
                        </Typography>
                     </Button>
                  </form>
               </Paper>
            </main>
         </MuiThemeProvider>
      )
   }
}

export default withStyles(styles)(AdminLogin)
