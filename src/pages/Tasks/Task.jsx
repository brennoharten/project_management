import { useUsersContext } from "../../hooks/useUsersContext";
import { Avatar } from "../../shadcn/components/ui/avatar";
import { Badge } from "../../shadcn/components/ui/badge";
import getInitials from "../../utils/getInitials";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Draggable } from "react-beautiful-dnd";
import LabelSvg from "../../components/Label";
import calculateDaysUntilDue from "../../utils/daysUntilDue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/components/ui/dropdown-menu";
import { useFirestore } from "../../hooks/useFirestore";
import { useUserContext } from "../../hooks/useUserContext";
import { useDocument } from "../../hooks/useDocument";
import { arrayRemove } from "firebase/firestore";

export default function Task({ task, index, columnId }) {
  const { users } = useUsersContext();
  const { userDoc } = useUserContext();
  const { deleteSubDocument: deleteTask } = useFirestore("teams");
  const { updateDocument: updateTeam } = useFirestore("teams");

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "#f7d372";
      case "medium":
        return "orange";
      case "high":
        return "#ff0000";
      case "standby":
        return "#5abb54";
      default:
        return "gray";
    }
  };

  const removeTask = async (taskId) => {
    await deleteTask(userDoc.teamId, "tasks", taskId);
    await updateTeam(userDoc.teamId, {
      [columnId]: arrayRemove(taskId),
    });
  };

  if (!task) return null;

  const assignedMembers = users.filter((u) =>
    task.assignedMembers.includes(u.id)
  );

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={`fake-container p-5 border border-border mb-2 rounded-lg bg-background shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{task.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <DotsHorizontalIcon className="w-6 h-6" role="button" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => removeTask(task.id)}>
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <Badge
                  className="bg-muted-foreground font-light rounded-md"
                  key={tag}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex">
                {assignedMembers.map((member) => (
                  <div
                    className="-ml-2 bg-foreground text-secondary rounded-full w-8 h-8 flex justify-center items-center"
                    key={member.id}
                  >
                    {member.photoURL ? (
                      <img
                        className="rounded-full"
                        src={member.photoURL}
                        alt={member.name}
                      />
                    ) : (
                      <span className="text-sm">
                        {getInitials(member.name)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <LabelSvg color={getPriorityColor(task.priority)} />
                <p className="text-muted-foreground text-sm">
                  {calculateDaysUntilDue(task.dueDate?.seconds) > 0 ? (
                    <span>
                      Faltam {calculateDaysUntilDue(task.dueDate?.seconds)} dias
                    </span>
                  ) : calculateDaysUntilDue(task.dueDate?.seconds) === 0 ? (
                    <span>Entrega hoje</span>
                  ) : (
                    <span>
                      {calculateDaysUntilDue(task.dueDate?.seconds) * -1} dias
                      atrasada
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
}
