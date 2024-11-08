import { memo, useState } from "react";

// components/TodoItem.tsx
interface TodoItemProps {
  todo: { id: string; title: string };
  isDeleting: boolean;
  isUpdating: boolean;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isDeleting,
  isUpdating,
  onEdit,
  onDelete,
}) => {
  const [editingTodo, setEditingTodo] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleUpdateBlur = (id: string, title: string) => {
    if (title.trim()) {
      onEdit(id, title);
      setEditingTodo(null); // Reset editing state
    }
  };

  return (
    <li key={todo.id}>
      {editingTodo?.id === todo.id ? (
        <input
          type="text"
          defaultValue={todo.title}
          onBlur={(e) => handleUpdateBlur(todo.id, e.target.value)}
          autoFocus
        />
      ) : (
        <span>{todo.title}</span>
      )}
      <button onClick={() => onDelete(todo.id)} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      <button
        onClick={() => setEditingTodo({ id: todo.id, title: todo.title })}
        disabled={isUpdating}
      >
        {isUpdating && editingTodo?.id === todo.id ? "Updating..." : "Edit"}
      </button>
    </li>
  );
};

export default memo(TodoItem);
