import { useState } from "react";
import { sanitizeInput } from "../utils/sanitize"; // Assuming sanitizeInput is in the utils folder

interface TodoFormProps {
  onAddTodo: (title: string) => Promise<void>;
  isAdding: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo, isAdding }) => {
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const handleCreateTodo = async () => {
    if (newTodoTitle.trim()) {
      // Sanitize input before passing to onAddTodo
      const sanitizedTitle = sanitizeInput(newTodoTitle);
      await onAddTodo(sanitizedTitle);
      setNewTodoTitle(""); // Reset input after adding
    }
  };

  return (
    <div>
      <input
        type="text"
        aria-label="New todo input"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        placeholder="Enter new todo..."
      />
      <button onClick={handleCreateTodo} disabled={isAdding}>
        {isAdding ? "Adding..." : "Add"}
      </button>
    </div>
  );
};

export default TodoForm;
