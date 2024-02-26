import { Button, Grid, Stack, Typography } from "@mui/material"
import useApp, { CurrencyType, ExpenseType, GroupObject } from "./hooks/useApp"
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import ExpenseCard from "./ExpenseCard";
import EditExpenseModal from "./EditExpenseModal";
import { useState } from "react";


type ExpenseListProps = {
  listTitle: string,
  list: ExpenseType[],
  currency: CurrencyType,
  emptyMsg: string,
  group: GroupObject
}

const ExpenseList = ({ listTitle, list, currency, emptyMsg, group }: ExpenseListProps) => {

  const { deleteExpense } = useApp()

  const [showModal, setShowModal] = useState<undefined | ExpenseType>()

  const { settleUp } = useApp()

  const textColor = "white"

  function handleShowModal() {
    if (!showModal) {
      return
    }

    deleteExpense(showModal, group.id)
    setShowModal(undefined)
  }

  return (
    <>
      {showModal ?
        <EditExpenseModal
          onClose={() => setShowModal(undefined)}
          expense={showModal}
          group={group}
          onDelete={() => handleShowModal()}
        /> :
        <></>
      }
      <Grid item xs={12} sm={6}>
        <Stack bgcolor="background.paper" borderRadius={2}>
          <Stack p={2} direction='row' justifyContent='space-between' alignItems='center' bgcolor='background.paper' borderRadius={2}>
            <Typography color={textColor} variant="h5">{listTitle}</Typography>
            {<Button variant="contained" startIcon={<MoneyOffIcon />} onClick={() => settleUp(group, list)} disabled={list.length <= 0}>Settle up</Button>}
          </Stack>
          {list.length > 0 ? list.map((trn, index) =>
            <ExpenseCard key={index} currency={currency} expense={trn} onClick={() => setShowModal(trn)} />
          ) : <Stack p={3} alignItems='center'>
            <Typography textAlign='center' variant='h6' color="#808080">{emptyMsg}</Typography>
          </Stack>}
        </Stack>
      </Grid>
    </>
  )
}

export default ExpenseList