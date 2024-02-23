import { Button, Container, Stack, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import FirstPageIcon from '@mui/icons-material/FirstPage';

const ErrorGroup = () => {
  const navigate = useNavigate()
  return (
    <Stack textAlign='center' mt={10} alignItems='center' spacing={2}>
      <Typography variant="h5" fontWeight={700}>404 Error</Typography>
      <Typography variant="h6">We could not find the board your looking for. Try again later</Typography>
      <Button startIcon={<FirstPageIcon />} onClick={() => navigate("/dashboard")} variant="contained">Go back</Button>
    </Stack>
  )
}

export default ErrorGroup