import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

const initialData = {
  tasks: {
    "task-1": { id: "task-1", content: "Dominar o mundo" },
    "task-2": { id: "task-2", content: "Roubar a Taça do Mundial de 51" },
    "task-3": { id: "task-3", content: "Tomar um frapuccino com Elon Musk" },
    "task-4": { id: "task-4", content: "Dançar Ragatanga" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Backlog",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
    "column-2": {
      id: "column-2",
      title: "A fazer",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "Em progresso",
      taskIds: [],
    },
    "column-4": {
      id: "column-4",
      title: "Em revisão",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3", "column-4"],
};

export default function KanbanBoard() {
  const [state, setState] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newTasksIds = Array.from(start.taskIds);
      newTasksIds.splice(source.index, 1);
      newTasksIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTasksIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);
    } else {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);

      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };

      setState(newState);
    }
  };

  return (
    <div className="mt-10">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-5">
          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
