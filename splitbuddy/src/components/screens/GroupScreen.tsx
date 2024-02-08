import { AppBar, Container, Divider, IconButton, Stack, Toolbar, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useApp, { ExpenseType, GroupObject } from "../hooks/useApp";
import useStore from "../../store";
import AppLoader from "../utils/AppLoader";
import { useEffect, useState } from "react";
import { Timestamp, Unsubscribe } from "firebase/firestore";
import AddIcon from '@mui/icons-material/AddCircle'

const placeholderTransactions: ExpenseType[] = [
  // { amount: 50, date: "Now", debtor: "Sonny", debtee: "Rachel", label: "Hai Di Lao" },
  // { amount: 40, date: "Now", debtor: "Rachel", debtee: "Sonny", label: "Electricity" },
  // { amount: 90, date: "Now", debtor: "Sonny", debtee: "Rachel", label: "Water Bill" },
  // { amount: 100, date: "Now", debtor: "Rachel", debtee: "Sonny", label: "Dragon Hotpot" },
]

const monthMap: { [number: number]: string } = {
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
  const { fetchSingleGroup } = useApp()

  useEffect(() => {
    let unsub: Unsubscribe | undefined
    if (groupId) {
      fetchSingleGroup(groupId, setGroup, setLoading).then((res) => {
        res = unsub
      })
    }
    return () => {
      if (unsub) unsub()
    }
  }, [])

  if (loading || !group) return <AppLoader />

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
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 2, bgcolor: "background.paper", borderRadius: 2 }} maxWidth='md'>
        <Stack>
          <Stack p={2} direction='row' justifyContent='space-between' alignItems='center'>
            <Typography variant="h5">Expenses</Typography>
            <IconButton color="primary"><AddIcon /></IconButton>
          </Stack>
          {placeholderTransactions.length > 0 ? placeholderTransactions.map((trn, index) =>
            <div key={index}>
              <Divider />
              <Stack p={2} justifyContent='space-between' direction='row' alignItems='center'>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Stack alignItems='center'>
                    <Typography variant="body2">{monthMap[Timestamp.now().toDate().getMonth()]}</Typography>
                    <Typography variant="body1">{Timestamp.now().toDate().getDate()}</Typography>
                  </Stack>
                  <Typography>{trn.label}</Typography>
                </Stack>
                <Stack alignItems='end'>
                  <Typography variant="body2">You are owed</Typography>
                  <Stack direction='row' spacing={0.5} alignItems='baseline'>
                    <Typography variant="h5">{trn.amount} </Typography>
                    <Typography variant="body2">{group.currency}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </div>
          ) : <Stack p={3} alignItems='center'>
            <Typography textAlign='center' variant='h6' color="GrayText">Congrats! You are all settled.</Typography>
          </Stack>}
        </Stack>
      </Container>
    </>
  )
}

export default GroupScreen
