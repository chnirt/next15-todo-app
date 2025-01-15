import React, { useState } from "react";
import {
  DndContext,
  rectIntersection,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { arrayMove } from "@dnd-kit/sortable";

// Define the type for an item
interface Item {
  id: string;
  title: string;
  children?: Item[];
}

// Props for DraggableItem component
interface DraggableItemProps {
  id: string;
  title: string;
  isDragging?: boolean;
  isOverlay?: boolean;
  children?: Item[];
  level: number;
}

const DragDropTodo = ({
  data,
  level = 0,
}: {
  data: Item[];
  level?: number;
}) => {
  console.log("🚀 ~ data:", data);
  const [items, setItems] = useState<Item[]>(
    data ?? [
      { id: "1", title: "Node 1" },
      { id: "2", title: "Node 2" },
      { id: "3", title: "Node 3" },
      { id: "4", title: "Node 4" },
    ],
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  // NOTE: related with deleteElement function
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  // Initialize drag-and-drop sensors
  const sensors = useSensors(mouseSensor, touchSensor);

  // Handle when drag starts
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id)); // Store the ID of the dragged item
  };

  // Handle when drag ends
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null); // Reset active state

    if (!active || !over) return; // No valid drag or drop

    const activeId = active.id;
    console.log("🚀 ~ handleDragEnd ~ activeId:", activeId);
    const overId = String(over.id).split("-")[0];
    console.log("🚀 ~ handleDragEnd ~ overId:", overId);

    if (activeId === overId) return; // Same item, no change

    const oldIndex = items.findIndex((item) => item.id === activeId);
    const overIndex = items.findIndex((item) => item.id === overId);

    if (oldIndex === -1 || overIndex === -1) return; // Invalid indices

    const isTopDrop = String(over.id).endsWith("-top");
    const isBottomDrop = String(over.id).endsWith("-bottom");

    let newIndex;

    if (isTopDrop) {
      // If dropped above, insert just before overIndex
      newIndex = overIndex;
    } else if (isBottomDrop) {
      // If dropped below, insert just after overIndex
      newIndex = overIndex + 1;
    } else {
      // Default to overIndex if top/bottom is unclear
      newIndex = overIndex;
    }

    // Adjust for moving from a later index to an earlier one
    if (oldIndex < newIndex) {
      // Dragging downwards -> Decrease newIndex to account for the removed oldIndex
      newIndex -= 1;
    }

    // Move the item within the list
    const newItems = arrayMove(items, oldIndex, newIndex);
    console.log("🚀 ~ handleDragEnd ~ newItems:", newItems);

    // Update the state
    setItems(newItems);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-2">
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            id={item.id}
            title={item.title}
            isDragging={item.id === activeId} // Highlight active item
            level={level}
          >
            {item.children}
          </DraggableItem>
        ))}
      </div>

      {/* Overlay for the dragged item */}
      <DragOverlay>
        {activeId && (
          <DraggableItem
            id={activeId}
            title={items.find((item) => item.id === activeId)?.title || ""}
            isOverlay={true} // Specific flag for overlay
            level={0}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

// DraggableItem: Component for each draggable item
const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  title,
  // isDragging,
  isOverlay,
  children,
  level,
}) => {
  const dragItem = useDraggable({ id });
  const topDropTarget = useDroppable({ id: id + "-top" });
  const bottomDropTarget = useDroppable({ id: id + "-bottom" });

  const dragItemStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(dragItem.transform),
    marginLeft: `${level * 20}px`,
  };

  // Normal render with drop zones
  return (
    <div className="space-y-2">
      <div ref={dragItem.setNodeRef} style={dragItemStyle}>
        <Card className="relative">
          {!isOverlay ? (
            <div
              ref={topDropTarget.setNodeRef}
              className={cn(
                "absolute top-0 h-1 w-full rounded-md",
                // "h-1 w-full rounded-md",
                topDropTarget.isOver && "ring-1 ring-inset ring-primary",
              )}
            />
          ) : null}
          <CardHeader className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  {...dragItem.attributes}
                  {...dragItem.listeners}
                >
                  <GripVertical />
                </Button>
                <Checkbox
                // checked={todo.completed}
                // onCheckedChange={(checked) =>
                //   toggleTodoCompletion(todo.id, todo.title, Boolean(checked))
                // }
                />
                <CardTitle className="text-lg">{title}</CardTitle>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  // onClick={() => openUpdateDialog(todo.id, todo.title)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  // onClick={() => openDeleteDialog(todo.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          </CardHeader>
          {!isOverlay ? (
            <div
              ref={bottomDropTarget.setNodeRef}
              className={cn(
                "absolute bottom-0 h-1 w-full rounded-md",
                // "h-1 w-full rounded-md",
                bottomDropTarget.isOver && "ring-1 ring-inset ring-primary",
              )}
            />
          ) : null}
        </Card>
      </div>

      {children && <DragDropTodo data={children} level={level + 1} />}
    </div>
  );
};

export default DragDropTodo;
