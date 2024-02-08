import { Dialog, Stack, Typography, IconButton, TextField, Button, SelectChangeEvent, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import ModalHeader from "./ModalHeader"
import { useState } from "react"
import useApp, { CurrencyType } from "./hooks/useApp"
import { create } from "domain"
import useStore from "../store"

type CreateGroupModal = {
  onClose: React.MouseEventHandler<HTMLButtonElement>
}

const currencies = [
  "USD",
  "AUD",
  "EUR",
  "YEN",
  "WON",
  "HKD"
]

const CreateGroupModal = ({ onClose }: CreateGroupModal) => {
  const { createGroup } = useApp()
  const { groups } = useStore()
  const [groupName, setGroupName] = useState<string>("")
  const [currency, setCurrency] = useState<CurrencyType>("USD")

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    try {
      await createGroup(groupName, currency)
      onClose(event)
    } catch (err) {
      console.log(err)
    }
  }

  function handleChange(event: SelectChangeEvent) {
    setCurrency(event.target.value as CurrencyType)
  }
  return (
    <Dialog open fullWidth maxWidth='xs' onClose={onClose}>
      <Stack p={3} spacing={2}>
        <ModalHeader onClose={onClose} />
        <TextField label='Group Name' onChange={(e) => setGroupName(e.target.value)} />
        <FormControl>
          <InputLabel>Currency</InputLabel>
          <Select
            label='Currency'
            labelId="curr-select-label"
            id="curr-select"
            value={currency}
            key={currency}
            onChange={handleChange}
          >
            {currencies.map((curr) => <MenuItem value={curr} key={curr}>{curr}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant='contained' onClick={(e) => handleSubmit(e)}>Create Group</Button>
      </Stack>
    </Dialog>
  )
}

export default CreateGroupModal