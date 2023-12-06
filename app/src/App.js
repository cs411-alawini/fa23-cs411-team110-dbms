import { React, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MenuIcon from '@mui/icons-material/Menu';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import {Dialog, Grid, Button, Toolbar, Box, AppBar, IconButton, Typography, TextField, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, Tabs, Tab, Stack} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

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
              } catch (error) {
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

export default function Content() {
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
