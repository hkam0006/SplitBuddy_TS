import { Box, Button, Chip, Dialog, IconButton, InputAdornment, ListItem, Paper, Stack, TextField } from "@mui/material"
import ModalHeader from "./ModalHeader"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useApp from "./hooks/useApp";
import { useState } from "react";
import { auth } from "../firebase";

type InviteMembersModalProps = {
  onClose: React.MouseEventHandler<HTMLButtonElement>,
  groupName: string,
  groupId: string
}

const InviteMembersModal = ({ onClose, groupName, groupId }: InviteMembersModalProps) => {

  const { findUser, sendInvites } = useApp()

  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<boolean>(false)
  const [inviteList, setInviteList] = useState<string[]>([])

  function handleSubmitButton(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    sendInvites(inviteList, groupName, groupId)
    onClose(event)
  }

  const handleDelete = (chipToDelete: string) => () => {
    setInviteList((inviteList) => inviteList.filter((invite) => invite !== chipToDelete));
  };

  function verifyEmail(email: string) {
    if (inviteList.includes(email) || auth.currentUser?.email === email) return setEmail("")
    findUser(email).then((exsists) => {
      if (exsists) {
        setInviteList((old) => [email, ...old])
        setEmail("")
      }
      setError(!exsists)
    })
  }

  return (
    <Dialog open fullWidth maxWidth='xs' onClose={onClose}>
      <Stack p={3} spacing={2}>
        <ModalHeader title="Invite Members" onClose={onClose} />
        <Stack direction='row' spacing={1} alignItems='center' justifyContent='center'>
          <TextField
            sx={{ flexGrow: 1 }}
            error={error}
            id="email-input"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            helperText={error ? "Account does not exist." : undefined}
          />
          <IconButton onClick={() => verifyEmail(email)} size="large" color="primary"><AddCircleIcon /></IconButton >
        </Stack>
        {inviteList.length > 0 ? <Paper
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            m: 0,
          }}
          component="ul"
        >
          {inviteList.map((data) => {
            return (
              <ListItem key={data}>
                <Chip
                  label={data}
                  onDelete={handleDelete(data)}
                />
              </ListItem>
            );
          })}
        </Paper> : <></>}
        <Button onClick={(e) => handleSubmitButton(e)} disabled={inviteList.length == 0} variant="contained">Send Invites</Button>
      </Stack>
    </Dialog>
  )
}

export default InviteMembersModal