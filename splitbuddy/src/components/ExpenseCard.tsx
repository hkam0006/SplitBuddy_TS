import { Divider, Stack, Typography } from "@mui/material"
import { monthMap } from "./screens/GroupScreen"
import { CurrencyType, ExpenseType } from "./hooks/useApp"
import { auth } from "../firebase"

type ExpenseCardType = {
  expense: ExpenseType,
  currency: CurrencyType,
  onClick: React.MouseEventHandler<HTMLDivElement>,
}

const ExpenseCard = ({ expense, currency, onClick }: ExpenseCardType) => {

  const textColor = "white"
  const greenText = "#43a047"
  const redText = "#f44336"

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    onClick(event)
  }

  return (
    <div onClick={(event) => handleClick(event)} >
      <Divider variant="middle" />
      <Stack p={2} justifyContent='space-between' direction='row' alignItems='center' sx={{ cursor: "pointer" }}>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Stack alignItems='center'>
            <Typography variant="body2" color={textColor}>{monthMap[expense.date.toDate().getMonth()]}</Typography>
            <Typography variant="body1" color={textColor}>{expense.date.toDate().getDate()}</Typography>
          </Stack>
          <Typography color={textColor} textOverflow="ellipsis" overflow='hidden'>
            {expense.label}
          </Typography>
        </Stack>
        <Stack alignItems='end'>
          <Typography variant="body2" color={expense.debtor == auth.currentUser?.uid ? redText : greenText}>
            {expense.debtor == auth.currentUser?.uid ? "You borrowed" : "You lent"}
          </Typography>
          <Stack direction='row' spacing={0.5} alignItems='baseline'>
            <Typography variant="h5" color={expense.debtor == auth.currentUser?.uid ? redText : greenText}>
              {expense.amount}
            </Typography>
            <Typography variant="body2" color={expense.debtor == auth.currentUser?.uid ? redText : greenText}>
              {currency}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </div>
  )
}

export default ExpenseCard