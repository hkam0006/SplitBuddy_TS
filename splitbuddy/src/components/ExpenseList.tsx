import { Button, Divider, Grid, IconButton, Stack, Typography } from "@mui/material"
import { CurrencyType, ExpenseType } from "./hooks/useApp"
import { Timestamp } from "firebase/firestore"
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { monthMap } from "./screens/GroupScreen";


type ExpenseListProps = {
  listTitle: string,
  list: ExpenseType[],
  currency: CurrencyType,
  grayText?: boolean,
  hasActionButton?: boolean,
  emptyMsg: string,
  handleAction?: Function
}

const ExpenseList = ({ listTitle, list, currency, grayText, emptyMsg, hasActionButton, handleAction }: ExpenseListProps) => {

  const textColor = grayText ? "GrayText" : "white"

  return (
    <Grid item xs={12} sm={6}>
      <Stack bgcolor="background.paper" borderRadius={2}>
        <Stack p={2} direction='row' justifyContent='space-between' alignItems='center' bgcolor='background.paper' borderRadius={2}>
          <Typography color={textColor} variant="h5">{listTitle}</Typography>
          {hasActionButton && handleAction ? <Button variant="contained" startIcon={<MoneyOffIcon />} onClick={() => handleAction()} disabled={list.length <= 0}>Settle up</Button> : <></>}
        </Stack>
        {list.length > 0 ? list.map((trn, index) =>
          <div key={index} >
            <Divider variant="middle" />
            <Stack p={2} justifyContent='space-between' direction='row' alignItems='center'>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Stack alignItems='center'>
                  <Typography variant="body2" color={textColor}>{monthMap[Timestamp.now().toDate().getMonth()]}</Typography>
                  <Typography variant="body1" color={textColor}>{Timestamp.now().toDate().getDate()}</Typography>
                </Stack>
                <Typography color={textColor} textOverflow="ellipsis" overflow='hidden'> {trn.label}</Typography>
              </Stack>
              <Stack alignItems='end'>
                <Typography variant="body2" color={textColor}>You are owed</Typography>
                <Stack direction='row' spacing={0.5} alignItems='baseline'>
                  <Typography variant="h5" color={textColor}>{trn.amount} </Typography>
                  <Typography variant="body2" color={textColor}> {currency}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </div>
        ) : <Stack p={3} alignItems='center'>
          <Typography textAlign='center' variant='h6' color="GrayText">{emptyMsg}</Typography>
        </Stack>}
      </Stack>
    </Grid>
  )
}

export default ExpenseList