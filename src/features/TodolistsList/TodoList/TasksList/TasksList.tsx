import { useAutoAnimate } from '@formkit/auto-animate/react'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import { TaskStatuses } from 'api/todolistAPI'
import { FilterValues } from 'app/App'
import { RequestStatus } from 'app/appSlice'
import { useAppDispatch, useAppSelector } from 'app/store'
import { FC, memo, useEffect } from 'react'
import { deleteTasksTC, getTasksTC, TaskDomain } from '../../tasksSlice'
import { Task } from './Task/Task'
import s from './TaskList.module.css'

type Props = {
  todolistId: string
  filter: FilterValues
  entityStatus: RequestStatus
}

export const TasksList: FC<Props> = memo(
  ({ todolistId, filter, entityStatus }) => {
    const tasks = useAppSelector((state) => state.tasks[todolistId])
    const dispatch = useAppDispatch()
    useEffect(() => {
      dispatch(getTasksTC(todolistId))
    }, [dispatch, todolistId])

    const [listRef] = useAutoAnimate<HTMLUListElement>()

    //todo: вынести в селектор
    const getFilteredTasks = (
      allTasks: TaskDomain[],
      filterValue: FilterValues
    ) => {
      switch (filterValue) {
        case 'active':
          return allTasks.filter((t) => t.status === TaskStatuses.New)
        case 'completed':
          return allTasks.filter((t) => t.status === TaskStatuses.Completed)
        default:
          return allTasks
      }
    }
    const tasksForTodoList = getFilteredTasks(tasks, filter)
    const deleteAllTasks = () => {
      tasks.forEach((el) => {
        dispatch(deleteTasksTC(todolistId, el.id))
      })
    }
    const tasksItems: JSX.Element = tasks.length ? (
      <ul
        ref={listRef}
        className={s.tasksWrapper}
      >
        {tasksForTodoList.map((task) => {
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
        {tasks.length !== 0 && (
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
