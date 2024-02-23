import { Button, Divider, Grid, IconButton, Stack, Typography } from "@mui/material"
import useApp, { CurrencyType, ExpenseType, GroupObject } from "./hooks/useApp"
import { Timestamp } from "firebase/firestore"
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { monthMap } from "./screens/GroupScreen";
import { auth } from "../firebase";


type ExpenseListProps = {
  listTitle: string,
  list: ExpenseType[],
  currency: CurrencyType,
  emptyMsg: string,
  group: GroupObject
}

const ExpenseList = ({ listTitle, list, currency, emptyMsg, group }: ExpenseListProps) => {

  const { settleUp } = useApp()

  const textColor = "white"
  const greenText = "#43a047"
  const redText = "#f44336"

  return (
    <Grid item xs={12} sm={6}>
      <Stack bgcolor="background.paper" borderRadius={2}>
        <Stack p={2} direction='row' justifyContent='space-between' alignItems='center' bgcolor='background.paper' borderRadius={2}>
          <Typography color={textColor} variant="h5">{listTitle}</Typography>
          {<Button variant="contained" startIcon={<MoneyOffIcon />} onClick={() => settleUp(group)} disabled={list.length <= 0}>Settle up</Button>}
        </Stack>
        {list.length > 0 ? list.map((trn, index) =>
          <div key={index} >
            <Divider variant="middle" />
            <Stack p={2} justifyContent='space-between' direction='row' alignItems='center'>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Stack alignItems='center'>
                  <Typography variant="body2" color={textColor}>{monthMap[trn.date.toDate().getMonth()]}</Typography>
                  <Typography variant="body1" color={textColor}>{trn.date.toDate().getDate()}</Typography>
                </Stack>
                <Typography color={textColor} textOverflow="ellipsis" overflow='hidden'> {trn.label}</Typography>
              </Stack>
              <Stack alignItems='end'>
                <Typography variant="body2" color={trn.debtor == auth.currentUser?.uid ? redText : greenText}>{trn.debtor == auth.currentUser?.uid ? "You borrowed" : "You lent"}</Typography>
                <Stack direction='row' spacing={0.5} alignItems='baseline'>
                  <Typography variant="h5" color={trn.debtor == auth.currentUser?.uid ? redText : greenText}>{trn.amount} </Typography>
                  <Typography variant="body2" color={trn.debtor == auth.currentUser?.uid ? redText : greenText}> {currency}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </div>
        ) : <Stack p={3} alignItems='center'>
          <Typography textAlign='center' variant='h6' color="#808080">{emptyMsg}</Typography>
        </Stack>}
      </Stack>
    </Grid>
  )
}

export default ExpenseList