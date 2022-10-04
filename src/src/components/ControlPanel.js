import * as colors from '../constants/StyleColors'

import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Checkbox from '@material-ui/core/Checkbox';
import DisplayBox from '../components/DisplayBox'
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { theme } from '../theme'

const MenuDefaultText = "Select Video"

const useStyles = makeStyles((theme) => ({
  controlContainer: {
    margin: theme.spacing(0,0),
    padding: theme.spacing(0,0,0),
    // backgroundColor: 'green',
  },
  button: {
    color: 'white',
    margin: theme.spacing(1,0),
    backgroundColor: colors.IVR_PLAY_BLUE,
  },
  formControl: {
    margin: theme.spacing(0),
    padding: theme.spacing(1, 0, 1),
    backgroundColor: colors.IVR_PLAY_SELECT_BACKGROUND,
  },
  select: {
    margin: theme.spacing(0),
    padding: theme.spacing("2px", "16px", 0),
  },
  txtLabel: {
    // use default color
  },
  txtFocused: {
    // use default color
    fontSize: '16px'
  },
  txtNotchedOutline: {
    'fontSize': '12px',
    borderWidth: '0px',
    borderColor: '#ffffff !important'
  },
  txtOutlinedInput: {
    padding: theme.spacing(0, 0, 0),
    'fontSize': '16px',
    '&$txtFocused $txtNotchedOutline': {
      borderWidth: '2px',
      borderColor: `${colors.IVR_PLAY_TEXTFIELD_BORDER} !important`,
    }
  },
  iconRoot: {
    width: 45,
    height:25,
    // paddingLeft: theme.spacing(0),
  },
  MenuItem: {
    color: "black",
    paddingLeft: theme.spacing(1),
  },
  MenuItemSelected: {
    color: "white",
  },
  MenuPaper: {
    border: '1px solid #5f646b',
    backgroundColor: '#eeeeee'
  },
  MenuList: {
    margin: theme.spacing(0,0),
    padding: theme.spacing(0,0,0),
  },
  // following two should be combined to one and rendered conditionally
  ListItemText: {
    fontSize: '16px',
  },
  StatusText: {
    // backgroundColor:"yellow",
    display: "flex",
    // alignItems: 'left',
  },
  PaddingGrid: {
    // backgroundColor:"green",
  },
  TextField : {
    backgroundColor: 'white',
  }
}));

function IvrPlayTextField(props) {
  const classes = useStyles();
  return (
    <TextField
      {...props}
      fullWidth
      variant="outlined"
      InputLabelProps={{
        style: {color:'black'},
        classes: {
          root: classes.txtLabel,
          focused: classes.txtFocused,
        },
      }}
      InputProps={{
        classes: {
          root: classes.txtOutlinedInput,
          focused: classes.txtFocused,
          notchedOutline: classes.txtNotchedOutline,
        }
      }}
      className={classes.TextField}
    />
  )
}

export default function ControlPanel(props) {
  const [checked, setChecked] = React.useState(false);
  const [DstAddr, setDstAddr]  = useState("")
  const [Dtmf, setDtmf] = useState("")
  const [VideoTag, setVideoTag] = useState("")

  const {ValidWebsite, website, videos, UserId, Admin, VideoAssetsLookup} = props;
  const WebsiteName = ValidWebsite ? website : 'demo'
  const ElementGridWidth = process.env.REACT_APP_ENABLE_DTMF==="true" ? 3 : 4;

  const classes = useStyles();

  const handleClickCheckbox = (event) => {
    setChecked(event.target.checked);
  };

  const handleClickPlay = (event) => {
    var tag = VideoTag===MenuDefaultText ? "" : VideoTag
    props.playVideoAsset(website, UserId, tag, DstAddr, Dtmf, checked)
  };

  return (
    <DisplayBox>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {Admin ?
              <Grid item sm={1} xs={12} style={{display: 'flex', alignItems: 'center'}}>
                <FormControlLabel
                  control={
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                      checkedIcon={<CheckBoxIcon fontSize="large" />}
                      checked={checked}
                      onChange={handleClickCheckbox}
                      name="Test" />
                    }
                    label="Test"
                />
              </Grid> :
              <Grid item sm={1} xs={false} className={classes.PaddingGrid}></Grid>
            }
            <Grid item sm={3} xs={12} className={classes.StatusText}>
              <FormControl variant="filled" className={classes.formControl} fullWidth>
                {/* <InputLabel id="selectLabelVideo" style={{color:'white'}}>
                  <Typography style={{fontWeight:'bold'}}>
                    Select video
                  </Typography>
                </InputLabel> */}
                <Select
                  className={classes.select}
                  displayEmpty
                  input={<Input disableUnderline={true} />}
                  renderValue={(selected) => {
                    var text = Object.keys(VideoAssetsLookup).includes(selected) ? VideoAssetsLookup[selected].Comment : MenuDefaultText
                    return  (
                      <Typography style={{fontWeight:'bold', color:"white"}}>
                        {text}
                      </Typography>
                    )
                  }}
                  inputProps={{ 'aria-label': 'Without label' }}
                  labelId="selectLabelVideo"
                  id="selectVideo"
                  value={VideoTag}
                  MenuProps={{ classes: { paper: classes.MenuPaper, list: classes.MenuList } }}
                  onChange={e=>setVideoTag(e.target.value)}
                  onOpen={e=>setVideoTag("")}
                  >
                    <MenuItem button
                      key={0}
                      value={MenuDefaultText}
                      style={{backgroundColor: '#bdbdbd'}}>
                      <ListItemText primary={"Select video"}/>
                    </MenuItem>
                    {videos.map((video, idx) => (
                      <div key={idx+1} value={video.Tag}>
                        <Divider/>
                        <MenuItem key={idx+1}
                          value={video.Tag}
                          disableGutters={false}
                          selected={video.Tag===VideoTag}
                          classes={{root:classes.MenuItem, selected:classes.MenuItemSelected}}
                          >
                            <ListItemIcon>
                              <Icon classes={{root: classes.iconRoot}} >
                                <img src={'/menu_images/' + video.Tag + '.svg'} alt={WebsiteName} />
                              </Icon>
                            </ListItemIcon>
                            <ListItemText primary={video.Comment}
                              classes={{primary: classes.ListItemText}}
                            />
                          </MenuItem>
                        </div>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={1} xs={false} className={classes.PaddingGrid}></Grid>
                <Grid item sm={4} xs={12} className={classes.StatusText}>
                  <IvrPlayTextField
                    id="txtSipDstUri"
                    label="Enter video address (SIP URI)"
                    type="text"
                    value={DstAddr}
                    onChange={e=>setDstAddr(e.target.value)}
                    required
                  />
                </Grid>
                {process.env.REACT_APP_ENABLE_DTMF==="true" &&
                <Grid item sm={ElementGridWidth} xs={12} style={{backgroundColor:"red", display: 'flex', alignItems: 'left'}}>
                  <IvrPlayTextField
                    id="txtPin"
                    label="PIN"
                    type="number"
                    value={Dtmf}
                    onChange={e=>setDtmf(e.target.value)}
                  />
                </Grid>
                }
                <Grid item sm={1} xs={false} className={classes.PaddingGrid}></Grid>
                <Grid item sm={1} xs={12} className={classes.StatusText}>
                  <Button className={classes.button}
                    variant="contained"
                    onClick={handleClickPlay}
                    >
                      <Typography style={theme.typography.body1}>
                        PLAY
                      </Typography>
                    </Button>
                </Grid>
                <Grid item sm={1} xs={false} className={classes.PaddingGrid}></Grid>
            </Grid>
          </Grid>
        </Grid>
      </DisplayBox>
    );
  }
