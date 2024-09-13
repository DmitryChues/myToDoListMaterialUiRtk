import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import { FC, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { FilterValuesType } from "../../../app/App";
import { RequestStatus } from "../../../app/appReducer";
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm";
import { addTaskTC } from "../tasksReducer";
import { changeTodoListTC, deleteTodoListTC } from "../todolistsReducer";
import { FilterTasksButtons } from "./FilterTasksButtons/FilterTasksButtons";
import { HeaderTodolist } from "./HeaderTodolist/HeaderTodolist";
import { TasksList } from "./TasksList/TasksList";
import s from "./TodoList.module.css";

type ToDoListPropsType = {
  title: string;
  todolistId: string;
  filter: FilterValuesType;
  entityStatus: RequestStatus;
};

export const TodoList: FC<ToDoListPropsType> = ({
  title,
  todolistId,
  filter,
  entityStatus,
}) => {
  const dispatch = useDispatch();
  const [isHide, setIsHide] = useState(false);

  const hideShowTodoListHandler = useCallback(() => {
    setIsHide(!isHide);
  }, [isHide]);

  const deleteTodoList = useCallback(() => {
    dispatch(deleteTodoListTC(todolistId));
  }, [todolistId, dispatch]);

  const changeTodoListTitle = useCallback(
    (title: string) => {
      dispatch(changeTodoListTC(title, todolistId));
    },
    [todolistId, dispatch]
  );

  const addTask = useCallback(
    (title: string) => {
      dispatch(addTaskTC(todolistId, title));
    },
    [todolistId, dispatch]
  );

  return (
    <Paper elevation={3} sx={{ padding: "20px", background: "#ffffff5e" }}>
      <HeaderTodolist
        entityStatus={entityStatus}
        title={title}
        hideShowTodoList={hideShowTodoListHandler}
        isHide={isHide}
        deleteTodoList={deleteTodoList}
        changeTodoListTitle={changeTodoListTitle}
      />
      <Collapse in={!isHide}>
        <div className={s.todoList}>
          <AddItemForm addItem={addTask} entityStatus={entityStatus} />
          <TasksList
            filter={filter}
            todolistId={todolistId}
            entityStatus={entityStatus}
          />
          <FilterTasksButtons todolistId={todolistId} filter={filter} />
        </div>
      </Collapse>
      {/* <Collapse in={isHide} >{countActiveTasks > 0 ? `${countActiveTasks} active tasks` : 'No tasks'}</Collapse> */}
    </Paper>
  );
};
