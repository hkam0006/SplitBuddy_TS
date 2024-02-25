import { useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import theme from "./theme/theme";
import { auth } from './firebase'

import AuthScreen from "./components/screens/AuthScreen";
import { Unsubscribe, onAuthStateChanged } from 'firebase/auth'
import useStore from "./store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/utils/PrivateRoute";
import PublicRoute from "./components/utils/PublicRoute";
import Dashboard from "./components/screens/Dashboard";
import AppLoader from "./components/utils/AppLoader";
import GroupScreen from "./components/screens/GroupScreen";
import InvitesScreen from "./components/screens/InvitesScreen";
import useApp from "./components/hooks/useApp";
import SnackbarManager from "./components/utils/SnackbarManager";



function App() {
  const { loader, setLoginState, isLogin } = useStore()
  const { fetchInvites } = useApp()

  useEffect(() => {
    const unsubAuth: Unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoginState(!!user)
    })

    return () => unsubAuth()
  }, [])

  if (loader) return <AppLoader />

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <SnackbarManager />
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoute Component={AuthScreen} />} path='/' />
            <Route element={<PrivateRoute Component={Dashboard} />} path='/dashboard' />
            <Route element={<PrivateRoute Component={GroupScreen} />} path='/dashboard/:uid' />
            <Route element={<PrivateRoute Component={InvitesScreen} />} path='/invites' />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
