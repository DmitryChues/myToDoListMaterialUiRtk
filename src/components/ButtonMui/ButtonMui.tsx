import Button, { ButtonProps } from '@mui/material/Button'
import { memo } from 'react'

type ButtonMuiProps = {} & ButtonProps

export const ButtonMui = memo(({ children, ...restProps }: ButtonMuiProps) => {
  return <Button {...restProps}>{children}</Button>
})
