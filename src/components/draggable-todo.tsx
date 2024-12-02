import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  CSSProperties,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// Item component
interface ItemProps {
  todo: Todo;
  style?: CSSProperties | undefined;
  openUpdateDialog: (id: string, title: string) => void;
  openDeleteDialog: (id: string) => void;
  toggleTodoCompletion: (id: string, title: string, completed: boolean) => void;
}

const Item = forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      todo,
      style,
      openUpdateDialog,
      openDeleteDialog,
      toggleTodoCompletion,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} style={style}>
        <Card>
          <CardHeader className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={(checked) =>
                    toggleTodoCompletion(todo.id, todo.title, Boolean(checked))
                  }
                />
                <CardTitle className="text-lg">{todo.title}</CardTitle>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openUpdateDialog(todo.id, todo.title)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDeleteDialog(todo.id)}
                >
                  <Trash2 />
                </Button>
                <Button variant="ghost" size="icon" {...props}>
                  <GripVertical />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  },
);

Item.displayName = "Item";

// SortableItem component
interface SortableItemProps {
  id: UniqueIdentifier;
  todo: Todo;
  openUpdateDialog: (id: string, title: string) => void;
  openDeleteDialog: (id: string) => void;
  toggleTodoCompletion: (id: string, title: string, completed: boolean) => void;
}

function SortableItem({
  id,
  todo,
  openUpdateDialog,
  openDeleteDialog,
  toggleTodoCompletion,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Dim the item while dragging
  };

  return (
    <Item
      ref={setNodeRef}
      style={style}
      todo={todo}
      openUpdateDialog={openUpdateDialog}
      openDeleteDialog={openDeleteDialog}
      toggleTodoCompletion={toggleTodoCompletion}
      {...attributes}
      {...listeners}
    />
  );
}

interface DraggableTodoProps {
  todos: Todo[];
  openUpdateDialog: (id: string, title: string) => void;
  openDeleteDialog: (id: string) => void;
  toggleTodoCompletion: (id: string, title: string, completed: boolean) => void;
}

export interface DraggableTodoRef {
  add: (id: string) => void;
  delete: (id: string) => void;
}

// ForwardRef for DraggableTodo
const DraggableTodo = forwardRef<DraggableTodoRef, DraggableTodoProps>(
  (
    { todos, openUpdateDialog, openDeleteDialog, toggleTodoCompletion },
    ref,
  ) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [items, setItems] = useState<string[]>(todos.map((todo) => todo.id));

    const sensors = useSensors(
      useSensor(MouseSensor),
      useSensor(TouchSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    );

    const handleDragStart = (event: { active: { id: UniqueIdentifier } }) => {
      setActiveId(String(event.active.id));
    };

    const handleDragEnd = (event: {
      active: { id: UniqueIdentifier };
      over: { id: UniqueIdentifier } | null;
    }) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setItems((items) => {
          const oldIndex = items.indexOf(String(active.id));
          const newIndex = items.indexOf(String(over.id));
          const newItems = arrayMove(items, oldIndex, newIndex);

          // Save new order to localStorage
          localStorage.setItem("todosOrder", JSON.stringify(newItems));

          return newItems;
        });
      }

      setActiveId(null);
    };

    useEffect(() => {
      // Retrieve order from localStorage
      const savedOrder = JSON.parse(localStorage.getItem("todosOrder") || "[]");
      if (Array.isArray(savedOrder) && savedOrder.length > 0) {
        setItems(savedOrder);
      }
    }, []); // Listen for changes in `todos`

    useImperativeHandle(ref, () => ({
      add: (id) =>
        setItems((prevItems) => {
          // Add the new item at the end of the list
          const updatedItems = [...prevItems, id];

          // Save the updated order to localStorage
          localStorage.setItem("todosOrder", JSON.stringify(updatedItems));

          return updatedItems;
        }),
      delete: (id) =>
        setItems((prevItems) => {
          const newItems = prevItems.filter((item) => item !== id);

          // Save new order to localStorage
          localStorage.setItem("todosOrder", JSON.stringify(newItems));

          return newItems;
        }),
    }));

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((id) =>
              todos.some((todo) => todo.id === id) ? (
                <SortableItem
                  key={id}
                  id={id}
                  todo={todos.find((todo) => todo.id === id)!}
                  openUpdateDialog={openUpdateDialog}
                  openDeleteDialog={openDeleteDialog}
                  toggleTodoCompletion={toggleTodoCompletion}
                />
              ) : null,
            )}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && todos.some((todo) => todo.id === activeId) ? (
            <Item
              todo={todos.find((todo) => todo.id === activeId)!}
              openUpdateDialog={openUpdateDialog}
              openDeleteDialog={openDeleteDialog}
              toggleTodoCompletion={toggleTodoCompletion}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  },
);

DraggableTodo.displayName = "DraggableTodo";

export default DraggableTodo;
