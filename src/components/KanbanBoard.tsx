import { useState, useRef, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { motion } from "framer-motion";

export interface KanbanColumn<T> {
  id: string;
  title: string;
  color?: string;
  items: T[];
}

interface KanbanBoardProps<T> {
  columns: KanbanColumn<T>[];
  onDragEnd: (itemId: string, sourceColumn: string, destColumn: string, destIndex: number) => void;
  renderCard: (item: T, isDragging: boolean) => React.ReactNode;
  getItemId: (item: T) => string;
  columnClassName?: string;
}

export function KanbanBoard<T>({
  columns,
  onDragEnd,
  renderCard,
  getItemId,
  columnClassName,
}: KanbanBoardProps<T>) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    onDragEnd(draggableId, source.droppableId, destination.droppableId, destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
        {columns.map((column) => (
          <div key={column.id} className={`flex-shrink-0 w-[300px] ${columnClassName || ""}`}>
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                {column.color && (
                  <div className={`w-2 h-2 rounded-full ${column.color}`} />
                )}
                <span className="text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  {column.title}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">
                {column.items.length}
              </span>
            </div>

            {/* Droppable area */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[120px] rounded-sm p-1 transition-colors duration-200 ${
                    snapshot.isDraggingOver
                      ? "bg-primary/5 ring-1 ring-primary/20"
                      : "bg-secondary/30"
                  }`}
                >
                  {column.items.map((item, index) => {
                    const itemId = getItemId(item);
                    return (
                      <Draggable key={itemId} draggableId={itemId} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 transition-shadow duration-200 ${
                              snapshot.isDragging
                                ? "shadow-lg ring-1 ring-primary/30 z-50"
                                : ""
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                              ...(snapshot.isDragging ? { transform: provided.draggableProps.style?.transform } : {}),
                            }}
                          >
                            {renderCard(item, snapshot.isDragging)}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
