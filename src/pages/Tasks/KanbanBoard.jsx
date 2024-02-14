import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import { useFirestore } from "../../hooks/useFirestore";
import { useUserContext } from "../../hooks/useUserContext";
import { useDocument } from "../../hooks/useDocument";
import { useSubcollection } from "../../hooks/useSubcollection";

const initialData = {
	tasks: {},
	columns: {
		"column-1": {
			id: "column-1",
			title: "Backlog",
			taskIds: [],
		},
		"column-2": { id: "column-2", title: "A fazer", taskIds: [] },
		"column-3": { id: "column-3", title: "Em progresso", taskIds: [] },
		"column-4": { id: "column-4", title: "Em revisão", taskIds: [] },
	},
	columnOrder: ["column-1", "column-2", "column-3", "column-4"],
};

export default function KanbanBoard({
	showNewTaskDialog,
	setShowNewTaskDialog,
	search,
	selectedTag,
	selectedMember,
	selectedPriority,
}) {
	const { updateDocument: updateTeam, updateSubDocument: updateTask } =
		useFirestore("teams");
	const { userDoc } = useUserContext();

	const { document: teamDoc } = useDocument("teams", userDoc.teamId);

	const { documents: tasks } = useSubcollection(
		"teams",
		userDoc.teamId,
		"tasks"
	);

	const [state, setState] = useState(initialData);

	const getNewStatus = (title) => {
		switch (title) {
			case "Backlog":
				return "backlog";
			case "A fazer":
				return "todo";
			case "Em progresso":
				return "in_progress";
			case "Em revisão":
				return "in_review";
			default:
				return "backlog";
		}
	};

	useEffect(() => {
    if (tasks && teamDoc) {
			// Transforma o array em um objeto de tarefas
			const tasksObject = tasks?.reduce((acc, task) => {
				acc[task.id] = task;
				return acc;
			}, {});

			const columnsTaskIds = {
				Backlog: [...teamDoc["column-1"]],
				"A fazer": [...teamDoc["column-2"]],
				"Em progresso": [...teamDoc["column-3"]],
				"Em revisão": [...teamDoc["column-4"]],
			};

			const newState = {
				tasks: tasksObject,
				columns: {
					"column-1": {
						...initialData.columns["column-1"],
						taskIds: columnsTaskIds["Backlog"],
					},
					"column-2": {
						...initialData.columns["column-2"],
						taskIds: columnsTaskIds["A fazer"],
					},
					"column-3": {
						...initialData.columns["column-3"],
						taskIds: columnsTaskIds["Em progresso"],
					},
					"column-4": {
						...initialData.columns["column-4"],
						taskIds: columnsTaskIds["Em revisão"],
					},
				},
				columnOrder: initialData.columnOrder,
			};
			setState(newState);
		}
		console.log(tasks);
	}, [tasks, teamDoc]);

	const onDragEnd = async (result) => {
		const { destination, source, draggableId } = result;

		if (!destination) return;

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const start = state.columns[source.droppableId];
		const finish = state.columns[destination.droppableId];

		if (destination.droppableId === source.droppableId) {
			const column = state.columns[source.droppableId];
			const newTaskIds = Array.from(column.taskIds);
			newTaskIds.splice(source.index, 1);
			newTaskIds.splice(destination.index, 0, draggableId);

			await updateTeam(userDoc.teamId, {
				[source.droppableId]: newTaskIds,
			});

			const newColumn = {
				...column,
				taskIds: newTaskIds,
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
			const newStartTaskIds = Array.from(start.taskIds);
			newStartTaskIds.splice(source.index, 1);

			const movedTask = state.tasks[draggableId];

			const updatedTask = {
				...movedTask,
				status: getNewStatus(finish.title),
			};

			const newTasks = {
				...state.tasks,
				[updatedTask.id]: updatedTask,
			};

			const newStart = {
				...start,
				taskIds: newStartTaskIds,
			};

			const newFinishTaskIds = Array.from(finish.taskIds);
			newFinishTaskIds.splice(destination.index, 0, draggableId);

			const newFinish = {
				...finish,
				taskIds: newFinishTaskIds,
			};

			await updateTeam(userDoc.teamId, {
				[source.droppableId]: newStartTaskIds,
				[destination.droppableId]: newFinishTaskIds,
			});

			const newState = {
				...state,
				tasks: newTasks,
				columns: {
					...state.columns,
					[newStart.id]: newStart,
					[newFinish.id]: newFinish,
				},
			};

			await updateTask(userDoc.teamId, "tasks", updatedTask.id, {
				status: getNewStatus(finish.title),
			});

			setState(newState);
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="mt-10 flex flex-col sm:flex-row gap-5">
				{state.columnOrder.map((columnId) => {
					const column = state.columns[columnId];
					const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
					const filteredTasks = tasks.filter((task) => {
						let shouldReturnTrue = true;

						if (selectedTag) {
							shouldReturnTrue = task.tags.includes(selectedTag);
						}

						if (selectedMember) {
							shouldReturnTrue = task.assignedMembers.includes(selectedMember);
						}

						if (selectedPriority) {
							shouldReturnTrue = task.priority === selectedPriority;
						}

						return (
							shouldReturnTrue &&
							(task?.title.toLowerCase().includes(search.toLowerCase()) ||
								task?.description.toLowerCase().includes(search.toLowerCase()))
						);
					});

					return (
						<Column
							showNewTaskDialog={showNewTaskDialog}
							setShowNewTaskDialog={setShowNewTaskDialog}
							key={columnId}
							column={column}
							tasks={filteredTasks}
						/>
					);
				})}
			</div>
		</DragDropContext>
	);
}
