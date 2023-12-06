import { React, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MenuIcon from '@mui/icons-material/Menu';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import {Dialog, Grid, Button, Toolbar, Box, AppBar, IconButton, Typography, TextField, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, Tabs, Tab, Stack} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <TopLevel />
);

function TopLevel() {
  const [un, setUn] = useState("")
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page setUn={setUn} />} />
        <Route path="/app" element={<App username={un} />} />
      </Routes>
    </Router>
  )
}

function Page({setUn}) {
  const [loginBox, loginOpen] = useState(true); // Set loginOpen to true to open the login box by default
  const [loginErrState, setLoginErr] = useState(0);
  const navigate = useNavigate(); // Use useNavigate

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setLoginErr(0);
  }

  // Handle successful login
  const handleLoginSuccess = () => {
    loginOpen(false);
    setLoginErr(2);
    navigate('/app'); // Navigate to '/app' after successful login using useNavigate
  };

  return (
    <>
      <HeaderBlock loginOpen={loginOpen} />
      <LoginBox loginBox={loginBox} loginOpen={loginOpen} onLoginSuccess={handleLoginSuccess} setLoginErr={setLoginErr} setUn={setUn} />
      <Snackbar open={loginErrState === 1} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error">Login Attempt Failed</Alert>
      </Snackbar>
      <Snackbar open={loginErrState === 2} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="success">Logged In Successfully</Alert>
      </Snackbar>
    </>
  );
}



function LoginBox({ loginBox, loginOpen, onLoginSuccess, setLoginErr, setUn }) {
  const [loginInfo, infoChange] = useState({ username: "", password: "" });

  return (
    <Dialog open={loginBox}>
      <DialogTitle> Login </DialogTitle>
      <DialogContent>
        <DialogContentText>Enter Credentials</DialogContentText>
        <Grid container sx={{ width: 1 }} spacing={2}>
          <Grid item xs={12}>
            <TextField label="Username" id="username" type="text" sx={{ width: 1 }} onChange={(event) => {
              let up = loginInfo
              loginInfo.username = event.target.value
              infoChange(loginInfo)
            }} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Password" id="password" type="password" sx={{ width: 1 }} onChange={(event) => {
              let up = loginInfo
              loginInfo.password = event.target.value
              infoChange(loginInfo)
            }} />
          </Grid>
          <Grid item xs={6}>
            <Button color="inherit" onClick={() => loginOpen(false)} sx={{ width: 1 }}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button color="inherit" sx={{ width: 1 }} onClick={() => {
              loginOpen(false);
              (async () => {
                try {
                  let header = new Headers({ "Content-Type": "application/json" })
                  const response = await fetch("http://localhost:5000/api/login", { method: "POST", body: JSON.stringify(loginInfo), headers: header })
                  if (response.ok) {
                    onLoginSuccess(); // Call the onLoginSuccess callback on successful login
                    setUn(loginInfo.username)
                  } else {
                    setLoginErr(1)
                  }
                } catch (error) {
                  setLoginErr(1)
                }
              })();
            }}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

function HeaderBlock({ loginOpen }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={() => loginOpen(true)}>Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
