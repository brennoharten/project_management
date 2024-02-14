import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../shadcn/components/ui/dialog";

import { Input } from "../../shadcn/components/ui/input";
import { Label } from "../../shadcn/components/ui/label";
import { Button } from "../../shadcn/components/ui/button";
import { useState } from "react";
import { Textarea } from "../../shadcn/components/ui/textarea";
import { DatePickerWithPresets } from "../../components/DatePickerWithPresets";
import Select from "react-select";
import { useDocument } from "../../hooks/useDocument";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useFirestore } from "../../hooks/useFirestore";
import { arrayUnion } from "firebase/firestore";
import { useToast } from "../../shadcn/components/ui/use-toast";
import { useUserContext } from "../../hooks/useUserContext";
import { useUsersContext } from "../../hooks/useUsersContext";

const priorityOptions = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "standby", label: "Em standby" },
];

export default function NewTaskDialog({ children, open, setOpen }) {
  const { userDoc } = useUserContext();
  const { users } = useUsersContext();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [description, setDescription] = useState("");
  const { document: teamDoc } = useDocument("teams", userDoc.teamId);
  const [assignedMembers, setAssignedMembers] = useState([]);

  const userOptions = users?.map((user) => ({
    value: user.id,
    label: user.name,
  }));
  
  const { toast } = useToast();
  const tagOptions = teamDoc?.tags?.map((tag) => ({ value: tag, label: tag }));
  const [selectedTags, setSelectedTags] = useState([]);
  const [priority, setPriority] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const selectedColumn = localStorage.getItem("selectedColumn") || "backlog";
  const { updateDocument: updateTeam } = useFirestore("teams");
  const { addSubDocument: addTask } = useFirestore("teams");

  
  const addNewTag = async (e) => {
    e.preventDefault();
    if (!newTag) return;
    await updateTeam("1e2jbG3utoQR8KpNbddG", {
      tags: arrayUnion(newTag),
    });
    setNewTag("");
    setShowNewTagForm(false);
    toast({
      title: "Nova tag",
      description: `A tag "${newTag}" foi adicionada com sucesso.`,
    });
  };

  const getColumn = (status) => {
    switch (status) {
      case "backlog":
        return "column-1";
      case "todo":
        return "column-2";
      case "in_progress":
        return "column-3";
      case "in_review":
        return "column-4";
      default:
        return "column-1";
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (
      !title ||
      !description ||
      !dueDate ||
      !priority ||
      assignedMembers.length < 1 ||
      selectedTags.length < 1
    )
      return;

    const { payload: taskId } = await addTask(userDoc.teamId, "tasks", {
      title,
      description,
      tags: selectedTags.map((tag) => tag.value),
      dueDate,
      assignedMembers: assignedMembers.map((member) => member.value),
      status: selectedColumn,
      deleted: false,
      priority,
    });

    const column = getColumn(selectedColumn);

    await updateTeam(userDoc.teamId, {
      [column]: arrayUnion(taskId),
    });

    toast({
      title: "Nova tarefa",
      description: `A tarefa "${title}" foi adicionada com sucesso.`,
    });
    setTitle("");
    setDescription("");
    setSelectedTags([]);
    setDueDate(null);
    setAssignedMembers([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova tarefa</DialogTitle>
          <DialogDescription>
            Preencha as informações da nova tarefa.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Título</Label>
            <Input
              id="name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Descrição</Label>
            <Textarea
              id="name"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-32 resize-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Label htmlFor="name">Tags</Label>
              <PlusCircledIcon
                className="h-4 w-4 shrink-0"
                role="button"
                onClick={() => setShowNewTagForm(true)}
              />
              {showNewTagForm && (
                <form onSubmit={addNewTag}>
                  <Input
                    value={newTag}
                    className="h-6"
                    placeholder="nova tag..."
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                </form>
              )}
            </div>
            <Select
              isMulti
              options={tagOptions}
              onChange={(options) => setSelectedTags(options)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Data para conclusão</Label>
            <DatePickerWithPresets date={dueDate} setDate={setDueDate} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Prioridade</Label>
            <Select
              options={priorityOptions}
              onChange={(option) => setPriority(option.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Atribuir a</Label>
            <Select
              isMulti
              options={userOptions}
              onChange={(options) => setAssignedMembers(options)}
            />
          </div>
        </div> 
        <DialogFooter>
          <Button type="submit" onClick={createTask}>
            Adicionar tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
