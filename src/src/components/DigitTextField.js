import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    fontSize: 30
  },
  labelRoot: {
    fontSize: "30px",
    color: "red",
    "&$labelFocused": {
      color: "purple"
    }
  },
  labelFocused: {},
  TextFieldInputProps:{
    maxLength: 1,
    fontSize: "25px",
    textAlign: 'center'
  },
}));

export default function DigitTextField(props) {
  const classes = useStyles()  ;
  const {Idx, PinValue, NextPinIdx, setPinCode} = props

  const handleOnChange = (e) => {
    setPinCode(Idx, e.key)
  };

  return (
    <TextField
      key={Idx + NextPinIdx.Ts}
      value={PinValue}
      variant="outlined"
      style = {{width: 60}}
      inputProps = {{
        maxLength: 1
      }}
      InputProps={{
        classes: {
          input: classes.TextFieldInputProps,
        },
      }}
      autoFocus={Idx===NextPinIdx.Idx}
      onKeyUp={handleOnChange}
    />
  )
}
