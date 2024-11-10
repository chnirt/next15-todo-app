// components/TodoList.tsx
import { Todo } from "@/hooks/useTodos";
import TodoItem from "./TodoItem";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { Dispatch, SetStateAction } from "react";

interface TodoListProps {
  todos: Todo[];
  isDeleting: Set<string>;
  isUpdating: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, title: string) => Promise<void>;
  editingTodo: Todo | null;
  setEditingTodo: Dispatch<SetStateAction<Todo | null>>;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  isDeleting,
  isUpdating,
  onDelete,
  onEdit,
  editingTodo,
  setEditingTodo,
}) => {
  return (
    <List
      height={400} // height of the viewport
      itemCount={todos.length} // total number of items
      itemSize={35} // height of each item (in pixels)
      width={300} // width of the list container
    >
      {({ index, style }: ListChildComponentProps) => {
        const todo = todos[index];
        return (
          <div style={style} key={todo.id}>
            <TodoItem
              todo={todo}
              isDeleting={isDeleting.has(todo.id)}
              isUpdating={isUpdating}
              onDelete={onDelete}
              onEdit={onEdit}
              editingTodo={editingTodo}
              setEditingTodo={setEditingTodo}
            />
          </div>
        );
      }}
    </List>
  );
};

export default TodoList;
