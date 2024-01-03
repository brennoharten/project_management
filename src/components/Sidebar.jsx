import { Button } from "../shadcn/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
	ChatBubbleIcon,
	DashboardIcon,
	ExitIcon,
	FileTextIcon,
	LightningBoltIcon,
	PersonIcon,
	CalendarIcon,
	InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useLogout } from "../hooks/useLogout";
import Logo from "../components/Logo";
import { Separator } from "../shadcn/components/ui/separator";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "../shadcn/components/ui/avatar";
import { useAuthContext } from "..//hooks/useAuthContext";
import LabelSvg from "./Label";

const userOptions = [
	{
		route: "/activity",
		name: "Atividade",
		icon: <LightningBoltIcon />,
	},
	{
		route: "/profile",
		name: "Meu perfil",
		icon: <PersonIcon />,
	},
];
const projectOptions = [
	{
		route: "/",
		name: "Dashboard",
		icon: <DashboardIcon />,
	},
	{
		route: "/tasks",
		name: "Tarefas",
		icon: <FileTextIcon />,
	},
	{
		route: "/chats",
		name: "Conversas",
		icon: <ChatBubbleIcon />,
	},
	{
		route: "/calendar",
		name: "Calendário",
		icon: <CalendarIcon />,
	},
];
const labelOptions = [
	{
		route: "/",
		name: "Alta Prioridade",
		icon: <LabelSvg color="#f00" />,
	},
	{
		route: "/",
		name: "Média Prioridade",
		icon: <LabelSvg color="orange" />,
	},
	{
		route: "/",
		name: "Baixa prioridade",
		icon: <LabelSvg color="#f7d372" />,
	},
	{
		route: "/",
		name: "Em StandBy",
		icon: <LabelSvg color="#5abb54" />,
	},
];

export default function Sidebar() {
	const navigate = useNavigate();
	const { logout, isPanding, error } = useLogout();
	const { user } = useAuthContext();

	return (
		<div className="h-screen w-[250px] bg-accent">
			<div className="p-5">
				<Logo size="sm" />
			</div>
			<div className="flex p-5 gap-3">
				<Avatar>
					<AvatarImage src="https://github.com/shadcn.png" />
					<AvatarFallback className="bg-primary/50">CN</AvatarFallback>
				</Avatar>
				<div>
					<p className="font-medium">{user.displayName}</p>
					<p className="text-muted-foreground/75 text-sm">Premium account</p>
				</div>
			</div>

			{userOptions.map((option) => (
				<div
					key={option.route}
					role="button"
					className="px-5 py-2.5 flex items-center gap-2"
					onClick={() => navigate(option.route)}
				>
					{option.icon}
					<p className="text-sm font-medium">{option.name}</p>
				</div>
			))}
			<Separator className="my-4" />

			<h2 className="font-semibold text-xl px-5 mb-5">Projetos</h2>

			{projectOptions.map((option) => (
				<div
					key={option.route}
					role="button"
					className="px-5 py-2.5 flex items-center gap-2"
					onClick={() => navigate(option.route)}
				>
					{option.icon}
					<p className="text-sm font-medium">{option.name}</p>
				</div>
			))}
			<Separator className="my-4" />
			{labelOptions.map((option) => (
				<div
					key={option.route}
					role="button"
					className="px-5 py-2.5 flex items-center gap-2"
					onClick={() => navigate(option.route)}
				>
					{option.icon}
					<p className="text-sm font-medium">{option.name}</p>
				</div>
			))}
			<Separator className="my-4" />
			<div className="p-5">
				<Button
					size="noPadding"
					variant="ghost"
					onClick={logout}
					className="opacity-50"
				>
					<InfoCircledIcon className="w-4 h-4 mr-2" />
					Central de Ajuda
				</Button>
				<Button size="noPadding" variant="ghost" onClick={logout} className="opacity-50">
					<ExitIcon className="w-4 h-4 mr-2" />
					Fazer Logout
				</Button>
			</div>
		</div>
	);
}
