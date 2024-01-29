import { Grid, Typography, Stack, IconButton, Divider, Box } from "@mui/material"
import TopBar from "../TopBar"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useState } from "react";
import GroupCard from "../GroupCard";
import CreateGroupModal from "../CreateGroupModal";
import NoGroups from "../NoGroups";
import { GroupObject } from "../hooks/useApp";
import useStore from "../../store";

const Dashboard: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { groups } = useStore()
  const [filteredGroups, setFilteredGroups] = useState<GroupObject[]>(groups)

  return (
    <>
      <TopBar
        filteredBoards={filteredGroups}
        unfilteredBoards={groups}
        setFilteredBoards={setFilteredGroups}
        showAddGroupModal={() => setShowModal(true)}
      />
      {showModal && <CreateGroupModal onClose={() => setShowModal(false)} />}
      {groups.length > 0 ? <>
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
      </> : <NoGroups />}
    </>
  )
}
export default Dashboard