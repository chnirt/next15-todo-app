// components/TodoList.tsx
import { Todo } from "@/hooks/useTodos";
import TodoItem from "./TodoItem";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

interface TodoListProps {
  todos: Todo[];
  isDeleting: Set<string>;
  isUpdating: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  isDeleting,
  isUpdating,
  onDelete,
  onEdit,
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
            />
          </div>
        );
      }}
    </List>
  );
};

export default TodoList;
