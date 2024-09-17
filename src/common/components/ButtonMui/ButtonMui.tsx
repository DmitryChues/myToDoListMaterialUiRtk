import Button, { ButtonProps } from '@mui/material/Button'
import { memo } from 'react'

type Props = {} & ButtonProps

export const ButtonMui = memo(({ children, ...restProps }: Props) => {
  return <Button {...restProps}>{children}</Button>
})
