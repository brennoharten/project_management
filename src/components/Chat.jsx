import React, { useState } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "../shadcn/components/ui/avatar";
import { Separator } from "../shadcn/components/ui/separator";
import { Input } from "../shadcn/components/ui/input";
import { Button } from "../shadcn/components/ui/button";
import { ScrollArea } from "../shadcn/components/ui/scroll-area";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSubcollection } from "../hooks/useSubcollection";
import Message from "../components/Messsage";
import getInitials from "../utils/getInitials";
import { useFirestore } from "../hooks/useFirestore";
import { ChevronLeftIcon, Cross1Icon } from "@radix-ui/react-icons";
import { timestamp } from "../firebase/config";
import { useUsersContext } from "../hooks/useUsersContext";

export default function Chat({
	selectedChat,
	chats,
	setSelectedChat,
	setChatIsOpen,
}) {
	const { user } = useAuthContext();
	const { users } = useUsersContext();
	const {
		updateDocument: updateChat,
		addDocument: createChat,
		addSubDocument: createMessage,
	} = useFirestore("chats");
	const [messageContent, setMessageContent] = useState("");

	const chat = chats.find((chat) => {
		console.log(selectedChat?.id);
		return chat.id === selectedChat?.id;
	});

	const { documents: messages } = useSubcollection(
		"chats",
		chat?.id,
		"messages",
		null,
		["createdAt", "asc"]
	);

	const sendMessage = async (e) => {
		e.preventDefault();
		if (messageContent === "") return;
		let chatId;

		if (!chat?.id) {
			const { payload } = await createChat({
				participants: [...selectedChat.participants],
			});
			chatId = payload;
		}

		await createMessage(chat?.id || chatId, "messages", {
			author: user.uid,
			createdAt: new Date(),
			content: messageContent,
		});

		await updateChat(chat?.id || chatId, {
			lastMessage: {
				content: messageContent,
				createdAt: timestamp,
			},
		});

		setMessageContent("");
	};

	const closeChat = () => {
		setChatIsOpen(false);
		setSelectedChat(null);
	};

	const openChat = (chat, userName) => {
		setChatIsOpen(true);
		setSelectedChat({
			id: chat.id,
			recipient: userName,
		});
	};

	const formatMessageDate = (dateObj) => {
		const now = new Date();
		const dayInMilliseconds = 24 * 60 * 60 * 1000;
		const daysOfWeek = [
			"domingo",
			"segunda-feira",
			"terça-feira",
			"quarta-feira",
			"quinta-feira",
			"sexta-feira",
			"sábado",
		];

		// Calcula a diferença entre a data atual e a data passada em dias
		const diffInDays = Math.floor((now - dateObj) / dayInMilliseconds);

		// Se for o mesmo dia, retorna a hora
		if (diffInDays === 0) {
			return dateObj.toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			});
		}

		// Se for o dia anterior, retorna "Ontem"
		if (diffInDays === 1) {
			return "Ontem";
		}

		// Se for entre 2 e 6 dias atrás, retorna o dia da semana
		if (diffInDays >= 2 && diffInDays < 7) {
			return daysOfWeek[dateObj.getDay()];
		}

		// Se for 7 dias atrás ou mais, retorna a data no formato DD/MM/AA
		return dateObj.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "2-digit",
		});
	};

	return (
		<div className="fixed bottom-24 right-5 sm:right-[248px] h-[500px] w-[350px] sm:w-96 border border-foreground/10 bg-input rounded-lg p-5 drop-shadow-2xl">
			<div className="flex flex-col h-full">
				<div className="flex items-center gap-3">
					{selectedChat && (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setSelectedChat(null)}
						>
							<ChevronLeftIcon className="w-6 h-6" />
						</Button>
					)}
					{selectedChat && (
						<Avatar>
							<AvatarImage src="" />
							<AvatarFallback className="bg-primary/50">
								{getInitials(selectedChat.recipient)}
							</AvatarFallback>
						</Avatar>
					)}
					<p className={`${selectedChat ? "" : "text-lg"}`}>
						{selectedChat?.recipient || "Conversas"}
					</p>
				</div>
				<Button
					variant="ghost"
					className="absolute top-2 right-2"
					onClick={closeChat}
					size="icon"
				>
					<Cross1Icon />
				</Button>
				<Separator className="bg-foreground/10 my-4" />
				<ScrollArea className="flex-grow">
					{selectedChat
						? (messages?.length &&
								messages?.map((message) => (
									<Message key={message.id} message={message} />
								))) || (
								<p className="text-foreground/50 text-sm">
									Não há mensagens para exibir.
								</p>
						  )
						: chats?.map((chat) => {
								const chatUser = users.find(
									(u) => chat.participants.includes(u.id) && u.id !== users.uid
								);
								return (
									<>
										<div
											key={chat.id}
											onClick={() => openChat(chat, chatUser.name)}
											role="button"
											className="relative"
										>
											<div className="flex gap-2.5">
												<Avatar className="h-12 w-12">
													<AvatarImage src="" />
													<AvatarFallback className="bg-primary/50">
														{getInitials(chatUser.name)}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">{chatUser.name}</p>
													<p className="text-muted-foreground text-sm">
														{chat.lastMessage.content}
													</p>
												</div>
												<p className="absolute top-1 right-2 text-muted-foreground text-xs">
													{formatMessageDate(
														chat.lastMessage.createdAt.toDate()
													)}
												</p>
											</div>
										</div>
										<Separator
											key={chat.id}
											className="bg-foreground/10 my-4"
										/>
									</>
								);
						  }) || (
								<p className="text-foreground/50 text-sm">
									Não há conversas para exibir.
								</p>
						  )}
				</ScrollArea>
				<form onSubmit={sendMessage} className="flex gap-2.5">
					<Input
						type="text"
						value={messageContent}
						onChange={(e) => setMessageContent(e.target.value)}
					/>
					<Button type="submit">Enviar</Button>
				</form>
			</div>
		</div>
	);
}
