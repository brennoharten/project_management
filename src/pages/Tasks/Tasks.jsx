import { Button } from "../../shadcn/components/ui/button";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../shadcn/components/ui/dropdown-menu";
import {
	ChevronDownIcon,
	Cross2Icon,
	MagnifyingGlassIcon,
	PlusIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import { FilterIcon } from "lucide-react";
import KanbanBoard from "./KanbanBoard";
import Select from "react-select";
//import { useUserContext } from "../../hooks/useUserContext";
//import { useDocument } from "../../hooks/useDocument";
import { Badge } from "../../shadcn/components/ui/badge";
//import { useUsersContext } from "../../hooks/useUsersContext";

export default function Tasks({ selectedPriority }) {
	const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedTag, setSelectedTag] = useState(null);
	const [selectedMember, setSelectedMember] = useState(null);
	/* const { document: teamDoc } = useDocument("teams", userDoc.teamId);
  const { userDoc } = useUserContext();
  const { users } = useUsersContext(); */

	return (
		<div className="p-5 sm:p-5">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10">
				<h1 className="text-2xl font-semibold">Tarefas do time</h1>
				<div className="flex flex-col sm:flex-row sm:items-center gap-5">
					<div className="flex items-center gap-2.5 border border-border py-2.5 px-5 rounded-lg mt-5 sm:mt-0">
						<MagnifyingGlassIcon className="h-6 w-6 text-muted-foreground" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="focus:outline-none bg-transparent w-full"
							placeholder="Pesquisar"
						/>
						<Cross2Icon
							role="button"
							className="text-muted-foreground"
							onClick={() => setSearch("")}
						/>
					</div>
					<Button
						size="lg"
						className="text-lg"
						onClick={() => setShowNewTaskDialog(true)}
					>
						<PlusIcon className="w-5 h-5 mr-2" />
						Nova tarefa
					</Button>
				</div>
			</div>
			<div className="flex justify-between">
				<div className="flex gap-2.5">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<div
								className="flex items-center gap-2 text-muted-foreground"
								role="button"
							>
								<p>Filtrar por tags</p>
								<ChevronDownIcon className="w-5 h-5" />
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Tags</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{/* {teamDoc?.tags?.map((tag) => (
								<DropdownMenuItem
									className={`${tag === selectedTag ? "bg-primary/50" : ""}`}
									key={tag}
									onClick={() => setSelectedTag(tag)}
								>
									{tag}
								</DropdownMenuItem>
							))} */}
						</DropdownMenuContent>
					</DropdownMenu>
					{selectedTag && (
						<Badge className="cursor-default">
							{selectedTag}{" "}
							<Cross2Icon
								onClick={() => setSelectedTag(null)}
								role="button"
								className="ml-1.5"
							/>
						</Badge>
					)}
				</div>

				<div className="flex gap-2.5">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<div
								className="flex items-center gap-2 text-muted-foreground"
								role="button"
							>
								<p>Filtrar por membro</p>
								<ChevronDownIcon className="w-5 h-5" />
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Membros</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{/* {users?.map((u) => (
								<DropdownMenuItem
									className={`${
										u.id === selectedMember ? "bg-primary/50" : ""
									}`}
									key={u.id}
									onClick={() => setSelectedMember(u.id)}
								>
									{u.name}
								</DropdownMenuItem>
							))} */}
						</DropdownMenuContent>
					</DropdownMenu>
					{selectedMember && (
						<Badge className="cursor-default">
							{/* {users.find((u) => u.id === selectedMember)?.name} */}
							<Cross2Icon
								onClick={() => setSelectedMember(null)}
								role="button"
								className="ml-1.5"
							/>
						</Badge>
					)}
				</div>
			</div>
			<KanbanBoard
        /* search={search}
        selectedTag={selectedTag}
        selectedPriority={selectedPriority}
        selectedMember={selectedMember}
        showNewTaskDialog={showNewTaskDialog}
        setShowNewTaskDialog={setShowNewTaskDialog} */
      />
		</div>
	);
}
