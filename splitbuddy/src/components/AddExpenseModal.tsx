import { Box, Button, Dialog, FormControl, InputAdornment, InputLabel, Select, Stack, TextField } from "@mui/material"
import ModalHeader from "./ModalHeader"
import { useState } from "react"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

type AddExpenseModalProps = {
  onClose: React.MouseEventHandler<HTMLButtonElement>
}

const AddExpenseModal = ({ onClose }: AddExpenseModalProps) => {
  const [labelName, setLabelName] = useState<string>("")
  return (
    <Dialog open fullWidth maxWidth='xs' onClose={onClose}>
      <Stack p={3} spacing={2}>
        <ModalHeader onClose={onClose} title="Add Expense" />
        <TextField label='Label' onChange={(e) => setLabelName(e.target.value)} />
        <TextField
          id="input-with-icon-textfield"
          label="Amount"
          type="number"
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
        // onClick={(e) => handleSubmit(e)}
        >
          Split Equally
        </Button>
      </Stack>
    </Dialog>
  )
}

export default AddExpenseModal