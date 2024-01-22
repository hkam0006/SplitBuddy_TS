import { CircularProgress, Stack } from "@mui/material"

const AppLoader: React.FC = () => {

  return (
    <Stack mt={45} alignItems="center">
      <CircularProgress />
    </Stack>
  )
}

export default AppLoader;