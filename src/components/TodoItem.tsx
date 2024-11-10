import { Todo } from "@/hooks/useTodos";
import { Dispatch, memo, SetStateAction } from "react";

// components/TodoItem.tsx
interface TodoItemProps {
  todo: Todo;
  isDeleting: boolean;
  isUpdating: boolean;
  onEdit: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => void;
  editingTodo: Todo | null;
  setEditingTodo: Dispatch<SetStateAction<Todo | null>>;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isDeleting,
  isUpdating,
  onEdit,
  onDelete,
  editingTodo,
  setEditingTodo,
}) => {
  const handleUpdateBlur = async (id: string, title: string) => {
    if (title.trim()) {
      await onEdit(id, title);
      setEditingTodo(null); // Reset editing state
    }
  };

  return (
    <li key={todo.id} className="flex flex-row">
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
        onClick={() =>
          setEditingTodo({
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
          })
        }
        disabled={isUpdating}
      >
        {isUpdating && editingTodo?.id === todo.id ? "Updating..." : "Edit"}
      </button>
    </li>
  );
};

export default memo(TodoItem);
