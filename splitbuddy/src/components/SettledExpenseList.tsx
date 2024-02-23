import { Button, Divider, Grid, IconButton, Stack, Typography, useMediaQuery } from "@mui/material"
import { CurrencyType, ExpenseType } from "./hooks/useApp"
import { monthMap } from "./screens/GroupScreen"
import { Timestamp } from "firebase/firestore"
import theme from "../theme/theme"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Component, useState } from "react"
import { auth } from "../firebase"

type SettleExpenseListProps = {
  list: ExpenseType[],
  currency: CurrencyType,
}

const SettleExpenseList = ({ list, currency }: SettleExpenseListProps) => {
  const isXs = useMediaQuery(theme.breakpoints.only("xs"))
  const [showMore, setShowMore] = useState<boolean>(!isXs)
  const textColor = "#808080"

  function showItems(list: ExpenseType[], show: boolean) {
    if (!show) return <></>

    const result = list.map((trn, index) => (
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
            <Typography variant="body2" color={textColor}>{trn.debtor == auth.currentUser?.uid ? "You borrowed" : "You lent"}</Typography>
            <Stack direction='row' spacing={0.5} alignItems='baseline'>
              <Typography variant="h5" color={textColor}>{trn.amount} </Typography>
              <Typography variant="body2" color={textColor}> {currency}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </div>
    ))

    return result
  }

  return (
    <Grid item xs={12} sm={6} mb={10}>
      <Stack bgcolor="background.paper" borderRadius={2}>
        <Stack p={2} direction='row' justifyContent='space-between' alignItems='center' bgcolor='background.paper' borderRadius={2}>
          <Typography variant="h5">Settled Expenses</Typography>
          {list.length > 0 ? <IconButton size="small" onClick={() => setShowMore(old => !old)} color="primary">{showMore ? <ExpandMoreIcon /> : < KeyboardArrowRightIcon />}</IconButton> : <></>}
        </Stack>
        {list.length > 0
          ? showItems(list, showMore)
          : <Stack p={3} alignItems='center'>
            <Typography textAlign='center' variant='h6' color="GrayText">No expense history found.</Typography>
          </Stack>}
      </Stack>
    </Grid>
  )
}

export default SettleExpenseList