import ButtonGroup from '@mui/material/ButtonGroup'
import { FilterValues } from 'app/App'
import { useAppDispatch } from 'app/store'
import { ButtonMui } from 'common'
import { FC, memo, useCallback } from 'react'
import { updateTodolist } from '../../todolistsSlice'

type Props = {
  filter: FilterValues
  todolistId: string
}

export const FilterTasksButtons: FC<Props> = memo(({ filter, todolistId }) => {
  const dispatch = useAppDispatch()
  const tasksFilterHandler = useCallback(
    (filter: FilterValues) => {
      dispatch(updateTodolist({ todolistId, model: { filter } }))
    },
    [todolistId, dispatch]
  )
  return (
    <ButtonGroup
      size='medium'
      aria-label='Small button group'
    >
      <ButtonMui
        variant={filter === 'all' ? 'contained' : 'outlined'}
        onClick={() => tasksFilterHandler('all')}
      >
        All
      </ButtonMui>
      <ButtonMui
        variant={filter === 'active' ? 'contained' : 'outlined'}
        onClick={() => tasksFilterHandler('active')}
      >
        Active
      </ButtonMui>
      <ButtonMui
        variant={filter === 'completed' ? 'contained' : 'outlined'}
        color={'success'}
        onClick={() => tasksFilterHandler('completed')}
      >
        Completed
      </ButtonMui>
    </ButtonGroup>
  )
})
