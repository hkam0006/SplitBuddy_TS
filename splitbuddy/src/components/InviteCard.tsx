import { Box, Button, Grid, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from "react";


type InviteCardProps = {
  groupName: string,
  senderEmail: string,
  senderId: string
}

const InviteCard = ({ groupName, senderEmail, senderId }: InviteCardProps) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid item xs={12} sm={3}>
      <Stack p={3} bgcolor="background.paper" spacing={1} borderColor="#ffea61">
        <Stack direction='row' justifyContent='space-between' alignItems='center' >
          <Box>
            <Typography variant="body2" fontWeight={400} textOverflow='ellipsis'>
              {`${senderEmail} has invited you to join asdasdasdasdasdas '${groupName}'. `}
            </Typography>
          </Box>
        </Stack>
        <Stack alignItems='end'>
          <Box>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
              variant="contained"
            >
              Actions
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>Accept</MenuItem>
              <MenuItem color="red" onClick={handleClose}>Decline</MenuItem>
            </Menu>
          </Box>
        </Stack>
      </Stack>
    </Grid>
  )
}

export default InviteCard