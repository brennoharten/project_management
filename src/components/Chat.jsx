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

export default function Chat({
	selectedChat,
	chats,
	setChatIsOpen,
	setSelectedChat,
	users,
}) {
	const { user } = useAuthContext();
	const { updateDocument: uptadeChat, addSubDocument: creatMessage, addDocument: createChat } = useFirestore("chats");
	const [messageContent, setMessageContent] = useState("");

	const chat = chats.find((chat) => {
		return chat?.id === selectedChat?.id;
	});

	const { documents: messages } = useSubcollection(
		"chats",
		chat?.id,
		"messages",
		null,
		["createdAt", "asc"]
	);

	const sendMessage = async () => {
		if (messageContent === "") return;
		let chatId
		if(!chat?.id) {
			const result = await createChat({
				participants: [...selectedChat.participants]
			})

			chatId = result.payload
		}
		await creatMessage(chat?.id || chatId, "messages", {
			author: user.uid,
			createdAt: new Date(),
			content: messageContent,
		});

		await uptadeChat(chat?.id || chatId, {
			lastMessage: {
				content: messageContent,
				createdAt: timestamp
			}
		})

		setMessageContent("");
	};

	const closeChat = () => {
		setChatIsOpen(false);
		setSelectedChat(null);
	};

	const openChat = (chat, userName) => {
		console.log(chat)
		setChatIsOpen(true);
		setSelectedChat({
			id: chat?.id,
			recipient: userName,
		});
		//TODO: essa função irá abrir o chat com o usuario com o id userID
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

		// Calcula a diferença entre o início do dia atual e o início do dia da mensagem em dias
		const diffInDays = Math.floor(
			(now.setHours(0, 0, 0, 0) - dateObj.setHours(0, 0, 0, 0)) /
				dayInMilliseconds
		);

		// Se for o mesmo dia, retorna a hora
		if (diffInDays === 0) {
			return dateObj.toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			});
		}

		// Se for ontem ou até 6 dias atrás, retorna "Ontem" ou o dia da semana
		if (diffInDays >= 1 && diffInDays < 7) {
			if (diffInDays === 1) {
				return "Ontem";
			} else {
				return daysOfWeek[dateObj.getDay()];
			}
		}

		// Se for 7 dias atrás ou mais, retorna a data no formato DD/MM/AA
		return dateObj.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "2-digit",
		});
	};

	return (
		<div className="fixed bottom-32 right-[248px] h-[500px] w-96 border border-foreground/10 bg-input/50 rounded-lg p-5 drop-shadow-2xl">
			<div className="flex flex-col h-full">
				<div className="flex items-center gap-3">
					{selectedChat && (
						<>
							<Button
								variant="icon"
								size="icon"
								onClick={() => setSelectedChat(null)}
							>
								<ChevronLeftIcon className="h-6 w-6" />
							</Button>
							<Avatar>
								<AvatarImage src="" />
								<AvatarFallback className="bg-primary/50">
									{getInitials(selectedChat.recipient)}
								</AvatarFallback>
							</Avatar>
						</>
					)}
					<p className={`${selectedChat ? "font-medium" : "font-medium text-lg"}`}>
						{selectedChat?.recipient || "Conversas"}
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-2 right-2"
					onClick={closeChat}
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
									(u) => chat.participants.includes(u.id) && u.id !== user.uid
								);
								return (
									<>
										<div
											role="button"
											key={chat.id}
											onClick={() => openChat(chat, chatUser.name)}
										>
											<div className="flex gap-2.5 relative">
												<Avatar>
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
										<Separator className="bg-foreground/10 my-4" />
									</>
								);
						  }) || (
								<p className="text-foreground/50 text-sm">
									Não há conversas para exibir
								</p>
						  )}
				</ScrollArea>
				<div className="flex gap-2.5">
					<Input
						type="text"
						value={messageContent}
						onChange={(e) => setMessageContent(e.target.value)}
					/>
					<Button onClick={sendMessage}>Enviar</Button>
				</div>
			</div>
		</div>
	);
}
