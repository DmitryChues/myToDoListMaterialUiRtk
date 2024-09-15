import { RequestStatus } from 'app/appSlice'
import { EditableSpan } from 'components/EditableSpan/EditableSpan'
import { FC, memo, useCallback } from 'react'
import s from './Header.module.css'

type HeaderProps = {
  title: string
  isHide: boolean
  entityStatus: RequestStatus
  hideShowTodoList: () => void
  deleteTodoList: () => void
  changeTodoListTitle: (title: string) => void
}

export const HeaderTodolist: FC<HeaderProps> = memo((props: HeaderProps) => {
  const {
    deleteTodoList,
    title,
    hideShowTodoList,
    isHide,
    changeTodoListTitle,
    entityStatus,
  } = props

  const deleteTodoListHandler = () => {
    deleteTodoList()
  }
  const onChangeTodoListTitleHandler = useCallback(
    (title: string) => {
      changeTodoListTitle(title)
    },
    [changeTodoListTitle]
  )
  return (
    <div
      className={
        isHide
          ? `${s.headerTodolistWrapper} ${s.isHide}`
          : s.headerTodolistWrapper
      }
    >
      <EditableSpan
        disabled={entityStatus === 'loading'}
        className={s.todolistTitle}
        onChange={onChangeTodoListTitleHandler}
        title={title}
      />
      <div>
        <button
          disabled={entityStatus === 'loading'}
          onClick={hideShowTodoList}
          className={isHide ? `${s.switch} ${s.hide}` : s.switch}
        ></button>
        <button
          disabled={entityStatus === 'loading'}
          onClick={deleteTodoListHandler}
          className={s.deleteTodolist}
        ></button>
      </div>
    </div>
  )
})
