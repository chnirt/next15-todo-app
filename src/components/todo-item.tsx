import { Todo } from "@/services/todoService";
import { Dispatch, memo, SetStateAction } from "react";

// components/TodoItem.tsx
interface TodoItemProps {
  todo: Todo;
  isDeleting: boolean;
  isUpdating: boolean;
  onEdit: (id: string) => void;
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
  return (
    <li key={todo.id} className="flex flex-row">
      <span>{todo.title}</span>
      <button onClick={() => onDelete(todo.id)} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>

      <button
        onClick={() => {
          setEditingTodo({
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
          });
          onEdit(todo.id);
        }}
        disabled={isUpdating}
      >
        {isUpdating && editingTodo?.id === todo.id ? "Updating..." : "Edit"}
      </button>
    </li>
  );
};

export default memo(TodoItem);
