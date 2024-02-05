import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"

const currencies = [
  "USD",
  "AUD",
  "EUR",
  "YEN",
  "WON",
  "HKD"
]

const CurrencySelect = () => {

  return (
    <FormControl>
      <InputLabel>Currency</InputLabel>
      <Select label='Currency' labelId="curr-select-label" id="curr-select" >
        {currencies.map((curr) => <MenuItem value={curr} key={curr}>{curr}</MenuItem>)}
      </Select>
    </FormControl>
  )
}

export default CurrencySelect