import { useState } from "react"
import { Container, Stack, TextField, Typography, Button } from "@mui/material"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

import { auth } from "../../firebase"
import AppLoader from "../utils/AppLoader"

type FormProps = {
  email: string,
  password: string
}

const defaultForm: FormProps = {
  email: "",
  password: ""
}

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [formData, setFormData] = useState<FormProps>(defaultForm)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value
    }))
  }

  async function handleFormSubmit() {
    setIsLoading(true)
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password)
      } else {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      }
    } catch (err) {
      console.log(err)
      setIsLoading(false)
    }
  }

  if (isLoading) return <AppLoader />

  return (
    <Container sx={{ mt: 20 }} maxWidth='xs'>
      <Stack textAlign='center' alignItems='center'>
        <Stack direction='row' spacing={0.1} >
          <Typography
            color="#ffea61"
            fontStyle='italic'
            fontWeight={700}
            variant='h4'
            sx={{ textDecoration: "line-through" }}
          >
            $plit
          </Typography>
          <Typography variant="h4">
            Buddy
          </Typography>
        </Stack>
        <Typography color='rgba(255,255,255, 0.6)'>
          Never lose track of expenses.
          <br />
          Start managing your expenses easily with your friends!.
        </Typography>
      </Stack>
      <Stack mt={2} spacing={2} textAlign='center'>
        <TextField
          label="Email"
          type="email"
          name='email'
          value={formData.email}
          onChange={(e) => handleFormChange(e)}
        />
        <TextField
          label="Password"
          type="password"
          name='password'
          value={formData.password}
          onChange={(e) => handleFormChange(e)}
        />
        <Button
          variant='contained'
          disabled={isLoading || !formData.email.trim() || !formData.password.trim()}
          onClick={() => handleFormSubmit()}
        >
          {isLogin ? "Log In" : "Sign Up"}
        </Button>
        <Typography sx={{ cursor: "pointer" }} onClick={() => setIsLogin((prevState) => !prevState)}>
          {isLogin ? "Dont have an account?" : "Already have an account?"}
        </Typography>
      </Stack>
    </Container>
  )
}

export default AuthScreen;