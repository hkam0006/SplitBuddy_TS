import { Box, Button, Dialog, FormControl, InputAdornment, InputLabel, Select, Stack, TextField } from "@mui/material"
import ModalHeader from "./ModalHeader"
import { useState } from "react"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import useApp, { GroupObject } from "./hooks/useApp";

type AddExpenseModalProps = {
  onClose: React.MouseEventHandler<HTMLButtonElement>,
  group: GroupObject
}

const AddExpenseModal = ({ onClose, group }: AddExpenseModalProps) => {

  const { splitExpense } = useApp()

  const [labelName, setLabelName] = useState<string>("")
  const [expenseAmount, setExpenseAmount] = useState<number>(0)

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    splitExpense(group, expenseAmount, labelName)
    onClose(event)
  }

  return (
    <Dialog open fullWidth maxWidth='xs' onClose={onClose}>
      <Stack p={3} spacing={2}>
        <ModalHeader onClose={onClose} title="Add Expense" />
        <TextField label='Label' onChange={(e) => setLabelName(e.target.value)} />
        <TextField
          id="input-with-icon-textfield"
          label="Amount you paid"
          type="number"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(Number(e.target.value))}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoneyIcon />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
        <Button
          variant='contained'
          disabled={expenseAmount <= 0}
          onClick={(e) => handleSubmit(e)}
        >
          Split Equally
        </Button>
      </Stack>
    </Dialog>
  )
}

export default AddExpenseModal