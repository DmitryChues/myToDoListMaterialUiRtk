import React, { FC, memo, useCallback } from 'react'
import { EditableSpan } from '../../../../components/EditableSpan/EditableSpan'
import s from './Header.module.css'
import { RequestStatus } from '../../../../app/appReducer'

type HeaderPropsType = {
	title: string
	isHide: boolean
	entityStatus: RequestStatus
	hideShowTodoList: () => void
	deleteTodoList: () => void
	changeTodoListTitle: (title: string) => void
}

export const HeaderTodolist: FC<HeaderPropsType> = memo((props: HeaderPropsType) => {
	const {
		deleteTodoList,
		title,
		hideShowTodoList,
		isHide,
		changeTodoListTitle,
		entityStatus
	} = props

	const deleteTodoListHandler = () => {
		deleteTodoList()
	}
	const onChangeTodoListTitleHandler = useCallback((title: string) => {
		changeTodoListTitle(title)
	}, [changeTodoListTitle])
	return (
		<div className={isHide ? `${s.headerTodolistWrapper} ${s.is_hide}` : s.headerTodolistWrapper}>
			<EditableSpan disabled={entityStatus === 'loading'} className={s.todolistTitle} onChange={onChangeTodoListTitleHandler} title={title} />
			<div>
				<button disabled={entityStatus === 'loading'} onClick={hideShowTodoList} className={isHide ? `${s.switch} ${s.hide}` : s.switch}></button>
				<button disabled={entityStatus === 'loading'} onClick={deleteTodoListHandler} className={s.deleteTodolist}></button>
			</div>
		</div>
	)
})