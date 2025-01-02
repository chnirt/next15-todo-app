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
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the type for an item
interface Item {
  id: string;
  name: string;
}

// Props for DraggableItem component
interface DraggableItemProps {
  id: string;
  name: string;
  isDragging?: boolean;
  isOverlay?: boolean;
}

const DragDropList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "Node 1" },
    { id: "2", name: "Node 2" },
    { id: "3", name: "Node 3" },
    { id: "4", name: "Node 4" },
  ]);

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
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id); // Store the ID of the dragged item
  };

  // Handle when drag ends
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    setActiveId(null); // Reset active state

    if (!active || !over) return; // No valid drag or drop

    const activeId = active.id;
    const overId = over.id.split("-")[0];

    if (activeId === overId) return; // Same item, no change

    const oldIndex = items.findIndex((item) => item.id === activeId);
    const overIndex = items.findIndex((item) => item.id === overId);

    if (oldIndex === -1 || overIndex === -1) return; // Invalid indices

    const isTopDrop = over.id.endsWith("-top");
    const isBottomDrop = over.id.endsWith("-bottom");

    let newIndex = overIndex; // Calculate new position
    if (isTopDrop) {
      newIndex = oldIndex < overIndex ? overIndex - 1 : overIndex;
    } else if (isBottomDrop) {
      newIndex = oldIndex < overIndex ? overIndex : overIndex + 1;
    }

    // Update the order of items
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(oldIndex, 1);
    updatedItems.splice(newIndex, 0, movedItem);

    setItems(updatedItems); // Update state
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
            name={item.name}
            isDragging={item.id === activeId} // Highlight active item
          />
        ))}
      </div>

      {/* Overlay for the dragged item */}
      <DragOverlay>
        {activeId && (
          <DraggableItem
            id={activeId}
            name={items.find((item) => item.id === activeId)?.name || ""}
            isOverlay={true} // Specific flag for overlay
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

// DraggableItem: Component for each draggable item
const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  name,
  // isDragging,
  isOverlay,
}) => {
  const dragItem = useDraggable({ id });
  const topDropTarget = useDroppable({ id: id + "-top" });
  const bottomDropTarget = useDroppable({ id: id + "-bottom" });

  const dragItemStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(dragItem.transform),
  };

  // Normal render with drop zones
  return (
    <div ref={dragItem.setNodeRef} style={dragItemStyle}>
      <Card className="relative">
        {!isOverlay ? (
          <div
            ref={topDropTarget.setNodeRef}
            className={cn(
              "absolute top-0 h-1 w-full rounded-md",
              topDropTarget.isOver && "ring-1 ring-inset ring-primary",
            )}
          />
        ) : null}
        {!isOverlay ? (
          <div
            ref={bottomDropTarget.setNodeRef}
            className={cn(
              "absolute bottom-0 h-1 w-full rounded-md",
              bottomDropTarget.isOver && "ring-1 ring-inset ring-primary",
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
              <CardTitle className="text-lg">{name}</CardTitle>
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
      </Card>
    </div>
  );
};

export default DragDropList;
