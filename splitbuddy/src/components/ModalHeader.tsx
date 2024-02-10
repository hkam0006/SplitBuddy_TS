import { IconButton, Stack, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'

type ModalHeader = {
  onClose: React.MouseEventHandler<HTMLButtonElement>,
  title: string,
}

const ModalHeader = ({ onClose, title }: ModalHeader) => {

  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <Typography variant='h5'>{title}</Typography>
      <IconButton onClick={onClose} size='small' ><CloseIcon /></IconButton>
    </Stack>
  )
}

export default ModalHeader