import TextField from '@mui/material/TextField'
import { ChangeEvent, FC, memo, useState } from 'react'

type EditableSpanProps = {
  title: string
  className?: string
  onChange: (title: string) => void
  disabled?: boolean
}

export const EditableSpan: FC<EditableSpanProps> = memo(
  ({ title, className, onChange, disabled }) => {
    const [editMode, setEditMode] = useState(false)
    const [newTitle, setNewTitle] = useState('')

    const activateEditMode = () => {
      setEditMode(true)
      setNewTitle(title)
    }
    const activateViewMode = () => {
      setEditMode(false)
      onChange(newTitle)
    }
    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) =>
      setNewTitle(e.currentTarget.value)

    return editMode ? (
      <TextField
        disabled={disabled}
        variant='standard'
        value={newTitle}
        size='small'
        onChange={onChangeTitleHandler}
        onBlur={activateViewMode}
        autoFocus
      />
    ) : (
      <span
        onDoubleClick={activateEditMode}
        className={className}
      >
        {title}
      </span>
    )
  }
)
