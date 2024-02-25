import { AppBar, Button, Container, Fab, Grid, IconButton, Stack, Toolbar, Typography, useMediaQuery } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useApp, { ExpenseType, GroupObject } from "../hooks/useApp";
import useStore from "../../store";

import { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/firestore";
import ExpenseList from "../ExpenseList";
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SettleExpenseList from "../SettledExpenseList";
import theme from "../../theme/theme";
import ErrorGroup from "../ErrorGroup";
import AddExpenseModal from "../AddExpenseModal";
import InviteMembersModal from "../InviteMembersModal";
import AppLoader from "../utils/AppLoader";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import { auth } from "../../firebase";

export const monthMap: { [number: number]: string } = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
}

const GroupScreen = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [group, setGroup] = useState<GroupObject | undefined>()
  const { uid: groupId } = useParams()
  const navigate = useNavigate()
  const { groups } = useStore()
  const { fetchSingleGroup, deleteGroup, leaveGroup } = useApp()

  const [unsettled, setUnsettled] = useState<ExpenseType[]>([])
  const [settled, setSettled] = useState<ExpenseType[]>([])
  const [addExpenseModal, showAddExpenseModal] = useState<boolean>(false)
  const [inviteMembersModal, showInviteMembersModal] = useState<boolean>(false)

  useEffect(() => {
    let unsub: Unsubscribe | undefined
    if (groupId) {
      fetchSingleGroup(groupId,
        setGroup,
        setLoading,
        setSettled,
        setUnsettled).then((res) => {
          res = unsub
        })
    }
    return () => {
      if (unsub) unsub()
    }
  }, [])

  const isXs = useMediaQuery(theme.breakpoints.only('xs'))

  if (!group) return <ErrorGroup />

  if (loading || !auth.currentUser) return <AppLoader />

  function handleDeleteGroup() {
    if (!groupId || !window.confirm("Are you sure you want to delete this group?")) {
      return
    }
    deleteGroup(groupId).then((success) => {
      if (success) navigate("/dashboard")
    })
  }

  function handleLeaveGroup() {
    if (!groupId || !window.confirm("Are you sure you want to leave this group?")) {
      return
    }
    leaveGroup(groupId).then((success) => {
      if (success) {
        navigate("/dashboard")
      }
    })
  }

  function deleteButton(): JSX.Element {
    if (auth.currentUser?.uid === group?.owner) {
      return !isXs ?
        <Button
          startIcon={<DeleteForeverIcon />}
          variant='contained'
          color="error"
          onClick={() => handleDeleteGroup()}
        >
          Delete Group
        </Button> : <IconButton
          color="error"
          onClick={() => handleDeleteGroup()}
        >
          <DeleteForeverIcon />
        </IconButton>
    } else {
      return !isXs ?
        <Button
          startIcon={<GroupRemoveIcon />}
          variant='contained'
          color="error"
          onClick={() => handleLeaveGroup()}
        >
          Leave Group
        </Button> : <IconButton
          color="error"
          onClick={() => handleLeaveGroup()}
        >
          <GroupRemoveIcon />
        </IconButton>
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ alignItems: "center", borderBottom: "5px solid #ffea61" }}>
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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {group.name}
          </Typography>
          <Stack direction='row' spacing={2}>
            {!isXs ?
              <Button
                onClick={() => showInviteMembersModal(true)}
                variant="contained"
                startIcon={<GroupAddIcon />}>
                Invite
              </Button> :
              <IconButton
                color="primary"
                onClick={() => showInviteMembersModal(true)}
              >
                <GroupAddIcon />
              </IconButton>
            }
            {deleteButton()}
          </Stack>
        </Toolbar>
      </AppBar>

      {addExpenseModal && <AddExpenseModal onClose={() => showAddExpenseModal(false)} group={group} />}
      {inviteMembersModal && <InviteMembersModal groupId={group.id} groupName={group.name} onClose={() => showInviteMembersModal(false)} />}

      <Container>
        <Stack mt={3}>
          <Grid container spacing={3}>
            <ExpenseList
              group={group}
              listTitle="Expenses"
              list={unsettled}
              currency={group.currency}
              emptyMsg="Congrats! You are all settled."
            />
            <SettleExpenseList
              list={settled}
              currency={group.currency}
            />
          </Grid>
        </Stack>
      </Container >
      <Fab
        onClick={() => showAddExpenseModal(true)}
        color="primary"
        aria-label="Add expense"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        disabled={group.members.length <= 1}
      >
        <AddIcon />
      </Fab>
    </>
  )
}

export default GroupScreen
