import { Box, Button, Grid, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from "react";
import useApp, { InviteProps } from "./hooks/useApp";


type InviteCardProps = {
  groupName: string,
  senderEmail: string,
  senderId: string,
  inviteObject: InviteProps
}

const InviteCard = ({ groupName, senderEmail, inviteObject }: InviteCardProps) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { declineInvite, acceptInvite } = useApp()

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
              {`${senderEmail} has invited you to join '${groupName}'. `}
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
              <MenuItem sx={{ color: "#43a047" }} onClick={() => acceptInvite(inviteObject)}>Accept</MenuItem>
              <MenuItem sx={{ color: "#f44336" }} onClick={() => declineInvite(inviteObject)}>Decline</MenuItem>
            </Menu>
          </Box>
        </Stack>
      </Stack>
    </Grid>
  )
}

export default InviteCard