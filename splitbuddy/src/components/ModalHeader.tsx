import { IconButton, Stack, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'

type ModalHeader = {
  onClose: React.MouseEventHandler<HTMLButtonElement>
}

const ModalHeader = ({ onClose }: ModalHeader) => {

  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <Typography variant='h5'>Add Expense Group</Typography>
      <IconButton onClick={onClose} size='small' ><CloseIcon /></IconButton>
    </Stack>
  )
}

export default ModalHeader