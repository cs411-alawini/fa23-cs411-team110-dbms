import { React, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MenuIcon from '@mui/icons-material/Menu';
<<<<<<< HEAD
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Dialog, Grid, Button, Toolbar, Box, AppBar, IconButton, Typography, TextField, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
=======
import {Dialog, Grid, Button, Toolbar, Box, AppBar, IconButton, Typography, TextField, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, Tabs, Tab, Stack} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
>>>>>>> eb76f1c (Search function)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Page />} />
      <Route path="/app" element={<App />} />
    </Routes>
  </Router>
);

function Page() {
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
<<<<<<< HEAD
      <LoginBox loginOpen={loginOpen} onLoginSuccess={handleLoginSuccess} setLoginErr={setLoginErr} />
=======
      <LoginBox loginOpen={loginOpen} loginBox={loginBox} setErr={setLoginErr}/>
      <Content />
>>>>>>> eb76f1c (Search function)
      <Snackbar open={loginErrState === 1} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error">Login Attempt Failed</Alert>
      </Snackbar>
      <Snackbar open={loginErrState === 2} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="success">Logged In Successfully</Alert>
      </Snackbar>
    </>
  );
}

<<<<<<< HEAD
function LoginBox({ loginOpen, onLoginSuccess, setLoginErr }) {
  const [loginInfo, infoChange] = useState({ username: "", password: "" });

  return (
    <Dialog open={loginOpen}>
      <DialogTitle> Login </DialogTitle>
      <DialogContent>
        <DialogContentText>Enter Credentials</DialogContentText>
        <Grid container sx={{ width: 1 }} spacing={2}>
          <Grid item xs={13}>
            <TextField label="Username" id="username" type="text" sx={{ width: 1 }} onChange={(event) => {
              let up = loginInfo
              loginInfo.username = event.target.value
              infoChange(loginInfo)
            }} />
=======
function Searchable() {
  const [query, setQuery] = useState("")
  const [reqFailed, setStat] = useState(false)
  const [reqFailed2, setStat2] = useState(false)
  const [tableView, setTableView] = useState([])

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return
    }

    setStat(false);
  }

  function handleClose2(event, reason) {
    if (reason === "clickaway") {
      return
    }

    setStat2(false);
  }

  const columns = [{
    field: "City",
    headerName: "City",
    editable: false,
    flex: 1
  }, {
    field: "No2Mean",
    headerName: "Nitrogen Dioxide Mean",
    editable: false,
    flex: 1
  }, {
    field: "O3Mean",
    headerName: "Ozone Mean",
    editable: false,
    flex: 1
  }, {
    field: "So2Mean",
    headerName: "Sulfur Dioxide Mean",
    editable: false,
    flex: 1
  }, {
    field: "CoMean",
    headerName: "Carbon Monoxide Mean",
    editable: false,
    flex: 1
  }]

  return (
    <Box sx={{justifyContent: "center", display: "flex"}}>
      <Stack sx={{width: 0.5}}>
        <TextField label="Search for a city" type="text" sx={{width: 1}} onChange={(event) => {
          setQuery(event.target.value)
        }} onKeyDown={(event) => {
          console.log(event.code)
          if (event.code == "Enter") { // enter
            (async() => {
              try {
                let response = await fetch("http://localhost:5000/api/search?" + new URLSearchParams({search: query}), {method: "GET"})
                if (response.ok) {
                  const parsed = await response.json()
                  setTableView(parsed)
                } else {
                  setStat(true)
                }
              } catch {
                setStat2(true)
              }
            })();
          }
        }}/>
        <DataGrid columns={columns} rows={tableView} getRowId={(row) => row.City } initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }} />
        <Snackbar open={reqFailed} autoHideDuration={6000} onClose={handleClose}>
          <Alert severity="error">Internal Server Error</Alert>
        </Snackbar>
        <Snackbar open={reqFailed2} autoHideDuration={6000} onClose={handleClose2}>
          <Alert severity="error">Server Inaccessible / Bug</Alert>
        </Snackbar>
      </Stack>
    </ Box>
  )
}

function Content() {
  const [currentTab, setTab] = useState(0)

  let intendedContent = null;

  switch(currentTab) {
    case 0:
      intendedContent = <Searchable />
      break
    case 1:
      intendedContent = <TextField />
  }

  return (
    <>
      <Tabs value={currentTab} onChange={(ev, val) => setTab(val)} centered>
        <Tab label="Search"/>
        <Tab label="Review" />
        <Tab label="Top Cities" />
      </Tabs>
      {intendedContent}
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
            <Grid item xs={12}>
              <TextField label="Username" id="username" type="text" sx={{width: 1}} onChange={(event) => {
                let up = loginInfo
                loginInfo.username = event.target.value
                infoChange(loginInfo)
              }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Password" id="password" type="password" sx={{width: 1}} onChange={(event) => {
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
                  let header = new Headers({"Content-Type": "application/json"})
                  const response = await fetch("http://localhost:5000/api/login", {method: "POST", body: JSON.stringify(loginInfo), headers: header})
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
>>>>>>> eb76f1c (Search function)
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
                let header = new Headers({ "Content-Type": "application/json" })
                const response = await fetch("http://localhost:5000/api/login", { method: "POST", body: JSON.stringify(loginInfo), headers: header })
                if (response.ok) {
                  onLoginSuccess(); // Call the onLoginSuccess callback on successful login
                } else {
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
