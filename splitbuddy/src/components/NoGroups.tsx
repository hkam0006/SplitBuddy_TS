import { Stack, Typography } from "@mui/material"

const NoGroups = () => {

  return (
    <Stack mt={10} textAlign='center'>
      <Typography variant="h4">No groups created</Typography>
      <Typography>
        Create your first expense group today!
      </Typography>
    </Stack>
  )
}

export default NoGroups