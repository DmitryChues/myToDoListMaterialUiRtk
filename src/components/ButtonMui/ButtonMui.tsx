import Button, { ButtonProps } from '@mui/material/Button'
import React, { memo } from 'react'

type ButtonMuiType = {} & ButtonProps

export const ButtonMui = memo(({ children, ...restProps }: ButtonMuiType) => {
	return (
		<Button {...restProps}>{children}</Button>
	)
})