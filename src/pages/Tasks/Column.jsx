import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";

export default function Column({ column, tasks }) {
  return (
    <div className="w-1/4 flex flex-col fake-container bg-secondary/50 border border-border rounded-xl">
      <h3 className="p-5">{column.title}</h3>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="tasklist p-5 flex-grow"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
