import { useEffect, useState } from "react";
import useStore from "../../store";
import useApp, { GroupObject, InviteProps } from "../hooks/useApp";
import AppLoader from "../utils/AppLoader";
import { AppBar, Grid, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InviteCard from "../InviteCard";
import { useNavigate } from "react-router-dom";

const InvitesScreen: React.FC = () => {
  const { invites, areInvitesFetched } = useStore()
  const { fetchInvites } = useApp()
  const [loader, setLoader] = useState<boolean>(true)

  const navigate = useNavigate()

  useEffect(() => {
    if (!areInvitesFetched) fetchInvites(setLoader)
    else setLoader(false)
  }, [])

  if (loader) return <AppLoader />

  return (
    <>
      <AppBar position='static'>
        <Toolbar sx={{ alignItems: "center" }}>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="back"
            sx={{ mr: 2 }}
            onClick={() => navigate("/dashboard")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography color='primary' variant="h6" sx={{ flexGrow: 1 }}>
            Invites
          </Typography>
        </Toolbar>
      </AppBar>

      <Stack my={3} mx={3} alignItems='center'>
        <Grid container spacing={{ sm: 4, xs: 2 }}>
          {invites.map((inv) =>
            <InviteCard senderEmail={inv.senderEmail} senderId={inv.senderId} groupName="bruh" />
          )}
        </Grid>
      </Stack>
    </>
  )

}

export default InvitesScreen