import { useAutoAnimate } from '@formkit/auto-animate/react'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import { FilterValues } from 'app/App'
import { RequestStatus } from 'app/appSlice'
import { AppRootState, useAppDispatch } from 'app/store'
import { FC, memo } from 'react'
import { useSelector } from 'react-redux'
import { deleteTasksTC, selectFilteredTask, TaskDomain } from '../../tasksSlice'
import { Task } from './Task/Task'
import s from './TaskList.module.css'

type Props = {
  todolistId: string
  filter: FilterValues
  entityStatus: RequestStatus
}

export const TasksList: FC<Props> = memo(
  ({ todolistId, filter, entityStatus }) => {
    const tasks = useSelector<AppRootState, TaskDomain[]>((state) =>
      selectFilteredTask(state, filter, todolistId)
    )
    const dispatch = useAppDispatch()

    const [listRef] = useAutoAnimate<HTMLUListElement>()

    const deleteAllTasks = () => {
      tasks.forEach((el) => {
        dispatch(deleteTasksTC({ todolistId, taskId: el.id }))
      })
    }
    const tasksItems: JSX.Element = tasks?.length ? (
      <ul
        ref={listRef}
        className={s.tasksWrapper}
      >
        {tasks?.map((task) => {
          return (
            <li key={task.id}>
              <Task
                entityTaskStatus={task.entityStatus}
                entityStatus={entityStatus}
                todolistId={todolistId}
                task={task}
              />
            </li>
          )
        })}
      </ul>
    ) : (
      <span>No tasks</span>
    )
    return (
      <div className={s.taskList}>
        {tasksItems}
        {tasks?.length !== 0 && (
          <Button
            variant='contained'
            size='small'
            sx={{ alignSelf: 'flex-end' }}
            color={'secondary'}
            endIcon={<DeleteIcon />}
            onClick={deleteAllTasks}
          >
            Delete all
          </Button>
        )}
      </div>
    )
  }
)
