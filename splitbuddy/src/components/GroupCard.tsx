import { Grid, IconButton, Stack, Typography } from "@mui/material"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { NavigateFunction, useNavigate } from "react-router-dom";
import { MouseEventHandler } from "react";


type GroupCardProps = {
  id: string,
  name: string,
}

const GroupCard = ({ id, name }: GroupCardProps) => {

  const navigate = useNavigate()

  return (
    <Grid item xs={12} sm={3}>
      <Stack p={3} bgcolor="background.paper" spacing={0} borderLeft="5px solid" borderColor="#ffea61">
        <Stack direction='row' justifyContent='space-between' alignItems='center' >
          <Typography variant="h6" fontWeight={400} >
            {name}
          </Typography>
          <IconButton onClick={() => navigate(`/dashboard/${id}`)} ><OpenInNewIcon /></IconButton>
        </Stack>
        <Typography variant="caption">You are all settled</Typography>
      </Stack>
    </Grid>
  )
}

export default GroupCard