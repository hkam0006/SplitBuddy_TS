import { AppBar, Stack, Toolbar, Button, IconButton, useMediaQuery, TextField, InputAdornment } from "@mui/material"
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { signOut } from "firebase/auth";

import AppLogo from "./AppLogo"
import { auth } from "../firebase";
import theme from "../theme/theme";

const TopBar = () => {
  const isXs: boolean = useMediaQuery(theme.breakpoints.only('xs'))

  async function handleLogout() {
    await signOut(auth)
  }


  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <AppLogo variant='h5' isXs={isXs} />
        <TextField
          variant="standard"
          size="medium"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }} />
        <Stack direction='row' spacing={1}>
          {
            isXs ? (
              <>
                <IconButton color='primary' size='small'><AddCircleIcon /></IconButton>
                <IconButton size='small' onClick={() => handleLogout()} ><LogoutIcon /></IconButton>
              </>
            ) : (
              <>
                <Button variant="contained">Add Group</Button>
                <Button endIcon={<LogoutIcon />} onClick={() => handleLogout()} >Log Out</Button>
              </>
            )
          }
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar;