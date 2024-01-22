import { Stack, Typography } from "@mui/material"
import { Variant } from "@mui/material/styles/createTypography"

type AppLogoProps = {
  variant: Variant
}

const AppLogo = ({ variant }: AppLogoProps) => {
  return (
    <>
      <Stack direction='row'>
        <Typography
          color="#ffea61"
          fontWeight={700}
          variant={variant}
          sx={{ textDecoration: "line-through" }}
        >
          $plit
        </Typography>
        <Typography variant={variant} fontWeight={700}>
          Buddy
        </Typography>
      </Stack >
    </>
  )
}

export default AppLogo