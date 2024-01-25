import { AppBar, Stack, Toolbar, Button, IconButton, useMediaQuery, TextField, InputAdornment } from "@mui/material"
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { signOut } from "firebase/auth";

import AppLogo from "./AppLogo"
import { auth } from "../firebase";
import theme from "../theme/theme";
import { SetStateAction } from "react";

type GroupObject = {
  name: string,
  id: string
}

type TopBarProps = {
  filteredBoards: GroupObject[],
  setFilteredBoards: React.Dispatch<SetStateAction<GroupObject[]>>,
  unfilteredBoards: GroupObject[],
}

const TopBar = ({ filteredBoards, setFilteredBoards, unfilteredBoards }: TopBarProps) => {
  const isXs: boolean = useMediaQuery(theme.breakpoints.only('xs'))

  async function handleLogout() {
    await signOut(auth)
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (event.target.value.length === 0) {
      return setFilteredBoards(unfilteredBoards)
    }
    const searchQuery = event.target.value.toLowerCase()
    const arrayCopy = filteredBoards.filter((grp) => grp.name.toLowerCase().includes(searchQuery))
    setFilteredBoards(arrayCopy)
  }

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <AppLogo variant='h5' isXs={isXs} />
        <TextField
          variant="standard"
          size="medium"
          placeholder="Search..."
          onChange={(e) => handleSearch(e)}
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