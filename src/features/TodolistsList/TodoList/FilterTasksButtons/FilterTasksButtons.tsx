import ButtonGroup from '@mui/material/ButtonGroup'
import { FilterValuesType } from 'app/App'
import { useAppDispatch } from 'app/store'
import { ButtonMui } from 'components/ButtonMui/ButtonMui'
import { FC, memo, useCallback } from 'react'
import { changeTodoListFilterAC } from '../../todolistsSlice'

type FilterTasksButtonsPropsType = {
  filter: FilterValuesType
  todolistId: string
}

export const FilterTasksButtons: FC<FilterTasksButtonsPropsType> = memo(
  ({ filter, todolistId }) => {
    const dispatch = useAppDispatch()
    const tasksFilterHandler = useCallback(
      (filter: FilterValuesType) => {
        dispatch(changeTodoListFilterAC({ todolistId, filter }))
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
  }
)
