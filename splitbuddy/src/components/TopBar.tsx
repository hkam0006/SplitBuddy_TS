import { AppBar, Stack, Toolbar, Button, IconButton, useMediaQuery, TextField, InputAdornment } from "@mui/material"
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { signOut } from "firebase/auth";

import AppLogo from "./AppLogo"
import { auth } from "../firebase";
import theme from "../theme/theme";
import React, { SetStateAction } from "react";
import { GroupObject } from "./hooks/useApp";
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from "react-router-dom";


type TopBarProps = {
  filteredBoards: GroupObject[],
  setFilteredBoards: React.Dispatch<SetStateAction<GroupObject[]>>,
  unfilteredBoards: GroupObject[],
  showAddGroupModal: React.MouseEventHandler<HTMLButtonElement>
}

const TopBar = ({ filteredBoards, setFilteredBoards, unfilteredBoards, showAddGroupModal }: TopBarProps) => {
  const isXs: boolean = useMediaQuery(theme.breakpoints.only('xs'))

  async function handleLogout() {
    await signOut(auth)
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (event.target.value.length === 0) {
      return setFilteredBoards(unfilteredBoards)
    }
    const searchQuery = event.target.value.toLowerCase()
    const arrayCopy = unfilteredBoards.filter((grp) => grp.name.toLowerCase().includes(searchQuery))
    setFilteredBoards(arrayCopy)
  }

  const navigate = useNavigate()

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
                <IconButton size='small' sx={{ bgcolor: "#ffea61" }} onClick={() => navigate("/invites/")}><EmailIcon sx={{ color: "black" }} /></IconButton>
                <IconButton size='small' onClick={() => handleLogout()} ><LogoutIcon /></IconButton>
              </>
            ) : (
              <>
                <Button startIcon={<EmailIcon />} variant="contained" onClick={() => navigate("/invites/")}>Group Invites</Button>
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