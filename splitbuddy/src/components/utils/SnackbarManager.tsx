import { Alert, Snackbar } from "@mui/material"
import useStore from "../../store"


const SnackbarManager = () => {

  const { setToaster, toasterMsg, toasterSeverity } = useStore()

  if (!toasterMsg) return <></>

  return (
    <Snackbar
      message={toasterMsg}
      open={!!toasterMsg}
      autoHideDuration={5000}
      onClose={() => setToaster("", "")}
    >
      {!!toasterSeverity ? <Alert onClose={() => setToaster("", "")} severity={toasterSeverity} sx={{ width: '100%', textTransform: "capitalize" }} >
        {toasterMsg}
      </Alert> : <></>}
    </Snackbar>
  )
}

export default SnackbarManager