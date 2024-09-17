import DeleteIcon from '@mui/icons-material/Delete'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import { RequestStatus } from 'app/appSlice'
import { useAppDispatch } from 'app/store'
import { EditableSpan, TaskEntity, TaskStatuses } from 'common'
import { ChangeEvent, memo, useCallback } from 'react'
import { deleteTasksTC, updateTaskTC } from '../../../tasksSlice'
import s from './Task.module.css'

type Props = {
  task: TaskEntity
  todolistId: string
  entityStatus: RequestStatus
  entityTaskStatus: RequestStatus
}
export const Task = memo((props: Props) => {
  const dispatch = useAppDispatch()
  const { task, todolistId, entityStatus, entityTaskStatus } = props
  const deleteTask = () => {
    dispatch(deleteTasksTC({ todolistId, taskId: task.id }))
  }
  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked
      ? TaskStatuses.Completed
      : TaskStatuses.New
    dispatch(updateTaskTC({ todolistId, taskId: task.id, model: { status } }))
  }
  const changeTaskTitle = useCallback(
    (title: string) => {
      dispatch(updateTaskTC({ todolistId, taskId: task.id, model: { title } }))
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
