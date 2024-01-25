import { Grid, Typography, Stack, IconButton, Divider, Box } from "@mui/material"
import TopBar from "../TopBar"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useState } from "react";
import GroupCard from "../GroupCard";

const placeholderBoards = [
  { name: "Aussie", id: "skdpoaskopdkasd" },
  { name: "Home Kong", id: "asdwscxc" },
]

const Dashboard: React.FC = () => {
  const [filteredGroups, setFilteredGroups] = useState(placeholderBoards)

  return (
    <>
      <TopBar filteredBoards={filteredGroups} unfilteredBoards={placeholderBoards} setFilteredBoards={setFilteredGroups} />
      <Stack my={3} mx={3}>
        <Grid container spacing={{ sm: 4, xs: 2 }}>
          {filteredGroups.map((grp) =>
            <GroupCard name={grp.name} id={grp.id} key={grp.id} />
          )}
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