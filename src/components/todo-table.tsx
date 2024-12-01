// components/TodoTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { safeFormatDate } from "@/utils/dateUtils";
import { Todo } from "@/services/todoService";
import { Badge } from "./ui/badge";

interface TodoTableProps {
  todos: Todo[];
  openUpdateDialog: (id: string, title: string) => void;
  openDeleteDialog: (id: string) => void;
  toggleTodoCompletion: (id: string, title: string, completed: boolean) => void; // Handler to toggle completion status
}

// Wrap TableRow as a motion component
const MotionTableRow = motion(TableRow);

const TodoTable: React.FC<TodoTableProps> = ({
  todos,
  openUpdateDialog,
  openDeleteDialog,
  toggleTodoCompletion,
}) => {
  return (
    <Table>
      <TableCaption>A list of your recent todos.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[100px]">Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <AnimatePresence>
          {todos?.length ? (
            todos.map((todo) => (
              <MotionTableRow
                key={todo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onDoubleClick={() =>
                  toggleTodoCompletion(todo.id, todo.title, !todo.completed)
                }
                onContextMenu={(e) => {
                  // Long-click / right-click handler
                  e.preventDefault();
                  toggleTodoCompletion(todo.id, todo.title, !todo.completed);
                }}
              >
                <TableCell
                  className={`cursor-pointer font-medium ${
                    todo.completed ? "text-gray-500 line-through" : ""
                  }`} // Apply line-through style when completed
                  onClick={() =>
                    toggleTodoCompletion(todo.id, todo.title, !todo.completed)
                  } // Toggle completion
                >
                  {todo.title}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={todo.completed ? "default" : "outline"}
                    // className={`${
                    //   todo.completed
                    //     ? "bg-gradient-to-r from-indigo-400 to-blue-400 text-white" // Thay đổi gradient cho trạng thái "Completed"
                    //     : "bg-gradient-to-r from-purple-500 to-pink-500 text-white" // Thay đổi gradient cho trạng thái "Pending"
                    // }`}
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </Badge>
                </TableCell>

                <TableCell>{safeFormatDate(todo.createdAt)}</TableCell>
                <TableCell>{safeFormatDate(todo.updatedAt)}</TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => openUpdateDialog(todo.id, todo.title)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(todo.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </MotionTableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                All done! Relax and enjoy your day!
              </TableCell>
            </TableRow>
          )}
        </AnimatePresence>
      </TableBody>
    </Table>
  );
};

export default TodoTable;
