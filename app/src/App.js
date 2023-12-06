import { React, useState } from 'react';
import './index.css';
import AddIcon from '@mui/icons-material/Add';
import {Button, Toolbar, Box, AppBar, IconButton, Typography, TextField, Snackbar, Alert, Tabs, Tab, Stack, Radio, RadioGroup, FormLabel, FormControl, FormControlLabel, Select, Grid, MenuItem, InputLabel, Card, CardContent, CircularProgress, Fab, Dialog, DialogTitle, DialogContent, DialogContentText, CardActions} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

function BestRated() {
  const [min, setMin] = useState('C')
  const [tableView, setTableView] = useState([])
  const [reqFailed, setStat] = useState(false)
  const [reqFailed2, setStat2] = useState(false)
  const [loading, setLoading] = useState(false)

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
                  setLoading(true)
                  let response = await fetch("http://localhost:5000/api/getPollutantScore?" + new URLSearchParams({min: min, dateMin: "2000-01-01"}), {method: "GET"})
                  if (response.ok) {
                    const parsed = await response.json()
                    setTableView(parsed)
                    setLoading(false)
                  } else {
                    setStat(true)
                    setLoading(false)
                  }
                } catch (error) {
                  setStat2(true)
                  setLoading(false)
                }
              })();
            }}  variant="outlined" >
            Find
          </Button>
          <CircularProgress sx={{visibility: loading ? "visible" : "hidden"}} />
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

var cities = null;
function Reviews({username}) {
  const [reviews, setReviews] = useState([])
  const [reqFailed, setStat] = useState(false)
  const [reqFailed2, setStat2] = useState(false)
  const [citiesLoaded, setCitiesLoaded] = useState(cities !== null)
  const [cityChosen, setCityChosen] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [addingReview, setAddingReview] = useState(false)

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

  if (cities === null) {
    (async() => {
      try {
        let response = await fetch("http://localhost:5000/api/cities")
        if (response.ok) {
          cities = await response.json()
          setCitiesLoaded(true)
        } else {
          setStat(true)
        }
      } catch (error) {
        setStat2(true)
      }
    })();
  }

  const cityElements = () => {
    if (cities) {
      return cities.map((city) => (
        <MenuItem value={city.City}>{city.City}</MenuItem>
      ))
    }
  }

  const cardElements = () => {
    return reviews.map((review) => (
      <Grid item xs={6}>
        <Card sx={{height: 1}}>
          <CardContent>
            <Typography variant="h6" fontWeight="fontWeightBold">{review.Username}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary">{review.ReviewDate}</Typography>
            <Typography>{review.ReviewText}</Typography>
          </CardContent>
          <CardActions>
            <IconButton sx={{visibility: review.Username === username ? "visible" : "hidden"}} onClick={() => {
              (async() => {
                try {
                  let header = new Headers({"Content-Type": "application/json"})
                  const response = await fetch("http://localhost:5000/api/delete-review", {method: "POST", headers: header, body: JSON.stringify({ReviewID: review.ReviewID})});
                  if (response.ok) {
                    const response = await fetch("http://localhost:5000/api/location-reviews?" + new URLSearchParams({location: cityChosen}));
                    if (response.ok) {
                      setReviews(await response.json())
                    } else {
                      setStat(true)
                    }
                  } else {
                    setStat(true)
                  }
                } catch (error) {
                  setStat2(true)
                }
              })();
            }}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    ))
  }

  const theme = useTheme();
  return (
    <Box sx={{justifyContent: "center", display: "flex"}}>
      <GlobalStyles styles={{ Fab: { bottom: theme.spacing(2), right: theme.spacing(2)} }} />
      <Stack sx={{width: 0.5}} spacing={2}>
        <FormControl>
          <InputLabel>City</InputLabel>
          <Select label="City" onChange={(ev) => {
            setCityChosen(ev.target.value);
            (async() => {
              try {
                const response = await fetch("http://localhost:5000/api/location-reviews?" + new URLSearchParams({location: ev.target.value}));
                if (response.ok) {
                  setReviews(await response.json())
                } else {
                  setStat(true)
                }
              } catch (error) {
                setStat2(true)
              }
            })();
          }}>
            {citiesLoaded && cityElements()}
          </Select>
        </FormControl>
        <Grid container spacing={2}>
          {cardElements()}
        </Grid>
        <Fab color="primary" sx={{visibility: cityChosen === "" ? "hidden" : "visible", position: "fixed", bottom: theme.spacing(2), right: theme.spacing(2)}} onClick={() => {
          setAddingReview(true)
        }}>
          <AddIcon />
        </Fab>
        <Snackbar open={reqFailed} autoHideDuration={6000} onClose={handleClose}>
          <Alert severity="error">Internal Server Error</Alert>
        </Snackbar>
        <Snackbar open={reqFailed2} autoHideDuration={6000} onClose={handleClose2}>
          <Alert severity="error">Unable to Reach the Server</Alert>
        </Snackbar>
      </Stack>
      <Dialog open={addingReview}>
        <DialogTitle> Add a Review </DialogTitle>
        <DialogContent>
          <DialogContentText>Describe the pollution in {cityChosen}: </DialogContentText>
          <Stack spacing={2}>
            <TextField multiline={true} label="Description" onChange={(ev) => {
              setReviewText(ev.target.value)
            }}/>
            <Button onClick={() => {
              setAddingReview(false);
              (async() => {
                try {
                  let header = new Headers({"Content-Type": "application/json"})
                  const response = await fetch("http://localhost:5000/api/add-review", {method: "POST", headers: header, body: JSON.stringify({username: username, review: reviewText, location: cityChosen})});
                  if (response.ok) {
                    const response = await fetch("http://localhost:5000/api/location-reviews?" + new URLSearchParams({location: cityChosen}));
                    if (response.ok) {
                      setReviews(await response.json())
                    } else {
                      setStat(true)
                    }
                  } else {
                    setStat(true)
                  }
                } catch (error) {
                  setStat2(true)
                }
              })();
            }}>Submit</Button>
            <Button onClick={() => {
              setAddingReview(false)
            }}>Cancel</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default function Content({username}) {
  const [currentTab, setTab] = useState(0)

  let intendedContent = null;

  switch(currentTab) {
    case 0:
      intendedContent = <Searchable />
      break
    case 1:
      intendedContent = <Reviews username={username} />
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
