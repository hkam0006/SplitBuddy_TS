import { Button, Dialog, IconButton, Stack, TextField } from "@mui/material"
import ModalHeader from "./ModalHeader"
import useApp, { ExpenseType, GroupObject } from "./hooks/useApp"
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from "react";
import { auth } from "../firebase";

type EditExpenseModalProps = {
  expense: ExpenseType | undefined,
  onClose: React.MouseEventHandler<HTMLButtonElement>,
  onDelete: React.MouseEventHandler<HTMLButtonElement>,
  group: GroupObject
}

const EditExpenseModal = ({ onClose, expense, group, onDelete }: EditExpenseModalProps) => {

  const [expenseLabel, setExpenseLabel] = useState<string>(expense ? expense.label : "")
  const [expenseAmount, setExpenseAmount] = useState<number>(expense ? expense.amount : 0)

  const [editMode, setEditMode] = useState<boolean>(false)

  function handleEditButton(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (editMode) {
      onClose(event)
    } else {
      setEditMode(true)
    }
  }

  if (!expense || !auth.currentUser) {
    return <></>
  }



  return <Dialog open fullWidth maxWidth='xs' onClose={onClose}>
    <Stack p={3} spacing={2}>
      <ModalHeader onClose={onClose} title="Expense Information" />
      <Stack direction='column' spacing={2}>
        <TextField
          label="Expense Label"
          value={expenseLabel}
          disabled={!editMode}
          sx={{ flexGrow: 1 }}
          onChange={(e) => setExpenseLabel(e.target.value)}
        />
        <TextField
          label="Expense Amount"
          type="number"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(Number(e.target.value))}
          disabled={!editMode}
          sx={{ flexGrow: 1 }}
        />
      </Stack>
      {expense.debtee === auth.currentUser.uid && <Stack direction='row' spacing={3}>
        <Button
          onClick={(e) => handleEditButton(e)}
          disabled={expenseLabel.length === 0 || expenseAmount <= 0}
          variant="contained"
          color={editMode ? "success" : undefined}
          sx={{ flexGrow: 1 }}
        >
          {editMode ? "Save" : "Edit"}
        </Button>
        <Button
          disabled={expense.debtor === auth.currentUser?.uid}
          variant="contained"
          color="error"
          sx={{ flexGrow: 1 }}
          onClick={(e) => onDelete(e)}
        >
          Delete
        </Button>
      </Stack>}
    </Stack>
  </Dialog>
}

export default EditExpenseModal