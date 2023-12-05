import {React, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MenuIcon from '@mui/icons-material/Menu';
import {Dialog, Grid, Button, Toolbar, Box, AppBar, IconButton, Typography, TextField, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert} from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Page />
);

function Page() {
  const [loginBox, loginOpen] = useState(false)
  const [loginErrState, setLoginErr] = useState(0);

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return
    }

    setLoginErr(0);
  }

  return (
    <>
      <HeaderBlock loginOpen={loginOpen} />
      <LoginBox loginOpen={loginOpen} loginBox={loginBox} setErr={setLoginErr}/>
      <Snackbar open={loginErrState === 1} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error">Login Attempt Failed</Alert>
      </ Snackbar>
      <Snackbar open={loginErrState === 2} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="success">Logged In Successfully</Alert>
      </ Snackbar>
    </>
  )
}

function LoginBox({loginOpen, loginBox, setErr}) {
  const [loginInfo, infoChange] = useState({username: "", password: ""})

  return (
    <Dialog open={loginBox}>
        <DialogTitle> Login </DialogTitle>
        <DialogContent>
          <DialogContentText>Enter Credentials</DialogContentText>
          <Grid container sx={{width: 1}} spacing={2}>
            <Grid item xs={13}>
              <TextField label="Username" id="username" type="text" sx={{width: 1}} onChange={(event: object) => {
                let up = loginInfo
                loginInfo.username = event.target.value
                infoChange(loginInfo)
              }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Password" id="password" type="password" sx={{width: 1}} onChange={(event: Object) => {
                let up = loginInfo
                loginInfo.password = event.target.value
                infoChange(loginInfo)
              }}/>
            </Grid>
            <Grid item xs={6}>
              <Button color="inherit" onClick={() => loginOpen(false)} sx={{width: 1}}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button color="inherit" sx={{width: 1}} onClick={() => {
                loginOpen(false);
                (async () => {
                  const response = await fetch("http://localhost:5000/api/login", {method: "POST", body: JSON.stringify(loginInfo)})
                  if (response.ok) {
                    setErr(2)
                  } else {
                    setErr(1)
                  }
                })();
              }}>
                Submit
              </Button>
            </Grid>
          </ Grid>
        </ DialogContent>
      </ Dialog>
  )
}

function HeaderBlock({loginOpen}) {
  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{flexGrow: 1}} />
          <Button color="inherit" onClick={() => loginOpen(true)}>Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
