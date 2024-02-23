import { Grid, IconButton, Stack, Typography } from "@mui/material"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { NavigateFunction, useNavigate } from "react-router-dom";
import { MouseEventHandler } from "react";
import { CurrencyType, ExpenseType } from "./hooks/useApp";
import { auth } from "../firebase";


type GroupCardProps = {
  id: string,
  name: string,
  transactions: ExpenseType[],
  currency: CurrencyType
}

const GroupCard = ({ id, name, transactions, currency }: GroupCardProps) => {

  const navigate = useNavigate()

  function captionText(): string {
    let amount = 0

    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].debtor === auth.currentUser?.uid) {
        amount -= transactions[i].amount
      } else if (transactions[i].debtee === auth.currentUser?.uid) {
        amount += transactions[i].amount
      }
    }

    if (amount === 0) {
      return "You are all settled"
    } else {
      const verbText = amount < 0 ? "borrowed" : "lent"
      return `You ${verbText} ${amount} ${currency}`
    }
  }

  return (
    <Grid item xs={12} sm={3}>
      <Stack p={3} bgcolor="background.paper" spacing={0} borderLeft="5px solid" borderColor="#ffea61">
        <Stack direction='row' justifyContent='space-between' alignItems='center' >
          <Typography variant="h6" fontWeight={400} >
            {name}
          </Typography>
          <IconButton onClick={() => navigate(`/dashboard/${id}`)} ><OpenInNewIcon /></IconButton>
        </Stack>
        <Typography variant="caption">{captionText()}</Typography>
      </Stack>
    </Grid>
  )
}

export default GroupCard