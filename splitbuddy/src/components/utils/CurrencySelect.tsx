import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"

const currencies = [
  "USD",
  "AUD",
  "EUR",
  "YEN",
  "WON"
]

const CurrencySelect = () => {

  return (
    <FormControl>
      <InputLabel>Currency</InputLabel>
      <Select label='Currency' labelId="demo-simple-select-label" id="demo-simple-select">
        {currencies.map((curr) => <MenuItem value={curr} key={curr}>{curr}</MenuItem>)}
      </Select>
    </FormControl>
  )
}

export default CurrencySelect