// components/TodoTable.tsx
import React from "react";
import { Todo } from "@/hooks/useTodos";
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

interface TodoTableProps {
  todos: Todo[];
  openUpdateDialog: (id: string, title: string) => void;
  openDeleteDialog: (id: string) => void;
}

const TodoTable: React.FC<TodoTableProps> = ({
  todos,
  openUpdateDialog,
  openDeleteDialog,
}) => {
  return (
    <Table>
      <TableCaption>A list of your recent todos.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos?.length ? (
          todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell className="font-medium">{todo.title}</TableCell>
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
                    <DropdownMenuItem onClick={() => openDeleteDialog(todo.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="h-24 text-center">
              All done! Relax and enjoy your day!
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TodoTable;
