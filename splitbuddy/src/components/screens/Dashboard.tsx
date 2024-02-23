import { Grid, Typography, Stack, Container, Fab } from "@mui/material"
import TopBar from "../TopBar"
import { useEffect, useState } from "react";
import GroupCard from "../GroupCard";
import CreateGroupModal from "../CreateGroupModal";
import NoGroups from "../NoGroups";
import useApp, { GroupObject, InviteProps } from "../hooks/useApp";
import useStore from "../../store";
import AppLoader from "../utils/AppLoader";
import AddIcon from '@mui/icons-material/Add';
import { Unsubscribe } from "firebase/firestore";

const Dashboard: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { groups, areGroupsFetched } = useStore()
  const { fetchGroups } = useApp()
  const [filteredGroups, setFilteredGroups] = useState<GroupObject[]>(groups)

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let unsub: Unsubscribe | undefined

    fetchGroups(setLoading, setFilteredGroups).then((res) => {
      unsub = res
    })

    return () => {
      if (unsub) {
        unsub()
      }
    }

  }, [])

  if (loading) return <AppLoader />

  return (
    <>
      <TopBar
        filteredBoards={filteredGroups}
        unfilteredBoards={groups}
        setFilteredBoards={setFilteredGroups}
        showAddGroupModal={() => setShowModal(true)}
      />
      {showModal && <CreateGroupModal onClose={() => setShowModal(false)} />}
      <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={() => setShowModal(true)}>
        <AddIcon />
      </Fab>
      {groups.length > 0 ? <>
        <Stack my={3} mx={3} alignItems='center'>
          {filteredGroups.length > 0 ?
            <Grid container spacing={{ sm: 4, xs: 2 }} sx={{ mb: 10 }}>
              {filteredGroups.map((grp) =>
                <GroupCard name={grp.name} id={grp.id} key={grp.id} transactions={grp.transactions} currency={grp.currency} />
              )}
            </Grid> : <Container sx={{ mt: 20 }}>
              <Stack textAlign='center' alignItems='center' >
                <Typography variant="h6">No boards that match your query...</Typography>
                <Typography variant="caption">Try a different query!</Typography>
              </Stack>
            </Container>
          }
        </Stack >
      </> : <NoGroups />
      }
    </>
  )
}
export default Dashboard