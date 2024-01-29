import { Dialog, Stack, Typography, IconButton, TextField } from "@mui/material"
import ModalHeader from "./ModalHeader"
import CurrencySelect from "./utils/CurrencySelect"

type CreateGroupModal = {
  onClose: React.MouseEventHandler<HTMLButtonElement>
}

const CreateGroupModal = ({ onClose }: CreateGroupModal) => {
  return (
    <Dialog open fullWidth maxWidth='xs' onClose={onClose}>
      <Stack p={3} spacing={2}>
        <ModalHeader onClose={onClose} />
        <TextField label='Group Name' />
        <CurrencySelect />
      </Stack>
    </Dialog>
  )
}

export default CreateGroupModal