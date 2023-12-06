import { React, useState } from 'react';
import './index.css';
import MenuIcon from '@mui/icons-material/Menu';
import {Button, Toolbar, Box, AppBar, IconButton, Typography, TextField, Snackbar, Alert, Tabs, Tab, Stack, Radio, RadioGroup, FormLabel, FormControl, FormControlLabel} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function BestRated() {
  const [min, setMin] = useState('C')
  const [tableView, setTableView] = useState([])
  const [reqFailed, setStat] = useState(false)
  const [reqFailed2, setStat2] = useState(false)

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
    field: "cname",
    headerName: "City",
    editable: false,
    flex: 1
  }, {
    field: "no2grade",
    headerName: "NO2 Grade",
    editable: false,
    flex: 1
  }, {
    field: "o3grade",
    headerName: "Ozone Grade",
    editable: false,
    flex: 1
  }, {
    field: "so2grade",
    headerName: "SO2 Mean",
    editable: false,
    flex: 1
  }, {
    field: "cograde",
    headerName: "CO Mean",
    editable: false,
    flex: 1
  }]

  return (
    <Box sx={{justifyContent: "center", display: "flex"}}>
      <Stack sx={{width: 0.5}}>
        <Stack direction="row">
          <FormControl sx={{display: "flex"}}>
            <FormLabel>Minimum Pollutant Grade</FormLabel>
            <RadioGroup defaultValue="C" onChange={(event) => {
              setMin(event.target.value);
            }} row>
              <FormControlLabel value="A" control={<Radio />} label="A" />
              <FormControlLabel value="B" control={<Radio />} label="B" />
              <FormControlLabel value="C" control={<Radio />} label="C" />
              <FormControlLabel value="F" control={<Radio />} label="F" />
            </RadioGroup>
          </FormControl>
          <Button color="inherit" onClick={() => {
              (async() => {
                try {
                  let response = await fetch("http://localhost:5000/api/getPollutantScore?" + new URLSearchParams({min: min, dateMin: "2000-01-01"}), {method: "GET"})
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
            }}  variant="outlined" >
            Find
          </Button>
        </Stack>
        <DataGrid columns={columns} rows={tableView} getRowId={(row) => row.cname} initialState={{
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
          <Alert severity="error">Failed to Contact Server</Alert>
        </Snackbar>
      </Stack>
    </ Box>
  )
}

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
          if (event.code === "Enter") { // enter
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
          <Alert severity="error">Server Unreachable a</Alert>
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
      break
    case 2:
      intendedContent = <BestRated />
      break
    default:
      intendedContent = <p>Shouldn't be here</p>
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
