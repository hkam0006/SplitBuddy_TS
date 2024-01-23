import { Grid, Typography, Stack, IconButton, Divider, Box, LinearProgress } from "@mui/material"
import TopBar from "../TopBar"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Dashboard: React.FC = () => {
  return (
    <>
      <TopBar />
      <Stack my={3} mx={3}>
        <Grid container spacing={{ sm: 4, xs: 2 }}>

          <Grid item xs={12} sm={3}>
            <Stack p={3} bgcolor="background.paper" spacing={0} borderLeft="5px solid" borderColor="#66bb6a">
              <Stack direction='row' justifyContent='space-between' alignItems='center' >
                <Typography variant="h6" fontWeight={400} >
                  Home Kong
                </Typography>
                <IconButton><OpenInNewIcon /></IconButton>
              </Stack>
              <Typography variant="caption">You are all settled</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Stack p={3} bgcolor="background.paper" spacing={0} borderLeft="5px solid" borderColor="#f44336">
              <Stack direction='row' justifyContent='space-between' alignItems='center' >
                <Typography variant="h6" fontWeight={400} >
                  Aussie
                </Typography>
                <IconButton><OpenInNewIcon /></IconButton>
              </Stack>
              <Typography variant="caption">You are owed $200AUD</Typography>
            </Stack>
          </Grid>

        </Grid>

      </Stack >
      <Box >
        <Divider variant="middle" />
        <Typography mx={3} my={3} variant="h6">You are all settled</Typography>
      </Box>
    </>
  )
}
export default Dashboard