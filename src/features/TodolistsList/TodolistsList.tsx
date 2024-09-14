import Grid from '@mui/material/Grid'
import { useAppDispatch, useAppSelector } from 'app/store'
import { AddItemForm } from 'components/AddItemForm/AddItemForm'
import { useCallback, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { TodoList } from './TodoList/TodoList'
import { addTodoListTC, getTodosTC } from './todolistsReducer'

export const TodolistsList = () => {
  const todolists = useAppSelector((state) => state.todolists)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()
  const addTodoList = useCallback(
    (title: string) => {
      dispatch(addTodoListTC(title))
    },
    [dispatch]
  )
  useEffect(() => {
    if (!isLoggedIn) return
    dispatch(getTodosTC())
  }, [dispatch, isLoggedIn])

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }
  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        xs={12}
      >
        <div className='todolist'>
          <AddItemForm addItem={addTodoList} />
        </div>
      </Grid>
      {todolists?.map((el) => (
        <Grid
          key={el.id}
          item
          xs={4}
        >
          <TodoList
            entityStatus={el.entityStatus}
            todolistId={el.id}
            title={el.title}
            filter={el.filter}
          />
        </Grid>
      ))}
    </Grid>
  )
}
