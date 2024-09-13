import DeleteIcon from '@mui/icons-material/Delete'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import { ChangeEvent, memo, useCallback } from 'react'
import { TaskStatuses, TaskType } from '../../../../../api/todolistAPI'
import { RequestStatus } from '../../../../../app/appReducer'
import { useAppDispatch } from '../../../../../app/store'
import { EditableSpan } from '../../../../../components/EditableSpan/EditableSpan'
import { deleteTasksTC, updateTaskTC } from '../../../tasksReducer'
import s from './Task.module.css'

type TaskPropsType = {
  task: TaskType
  todolistId: string
  entityStatus: RequestStatus
  entityTaskStatus: RequestStatus
}
export const Task = memo((props: TaskPropsType) => {
  const dispatch = useAppDispatch()
  const { task, todolistId, entityStatus, entityTaskStatus } = props
  const deleteTask = () => {
    dispatch(deleteTasksTC(todolistId, task.id))
  }
  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked
      ? TaskStatuses.Completed
      : TaskStatuses.New
    dispatch(updateTaskTC(todolistId, task.id, { status }))
  }
  const changeTaskTitle = useCallback(
    (title: string) => {
      dispatch(updateTaskTC(todolistId, task.id, { title }))
    },
    [todolistId, task.id, dispatch]
  )
  return (
    <Paper sx={{ display: 'flex', alignItems: 'flex-start' }}>
      <Checkbox
        disabled={entityStatus === 'loading' || entityTaskStatus === 'loading'}
        color={'success'}
        checked={task.status === TaskStatuses.Completed}
        onChange={changeTaskStatus}
      />
      <div style={{ flex: '1 1 auto', padding: '10px' }}>
        <EditableSpan
          disabled={
            entityStatus === 'loading' || entityTaskStatus === 'loading'
          }
          onChange={changeTaskTitle}
          title={task.title}
          className={task.status === TaskStatuses.Completed ? s.isDone : ''}
        />
      </div>
      <IconButton
        disabled={entityStatus === 'loading' || entityTaskStatus === 'loading'}
        onClick={deleteTask}
        aria-label='delete'
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  )
})
