import { useCollection } from "../hooks/useCollection";
import React, { useEffect } from "react";
import Loading from "./Loading";
import { Skeleton } from "../shadcn/components/ui/skeleton";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUsersContext } from "../hooks/useUsersContext";

function MemberSkeleton() {
	return (
		<div className="flex items-center gap-2 py-2.5">
			<Skeleton className="h-4 w-4 rounded-full" />
			<Skeleton className="w-[120px] h-4" />
		</div>
	);
}

export default function Membersbar({ chats, setChatIsOpen, setSelectedChat }) {
	const { user } = useAuthContext();
	const { users } = useUsersContext();

	const openChat = (userId, userName) => {
		const chat = chats.find(
			(chat) =>
				chat.participants.includes(userId) &&
				chat.participants.includes(user.uid)
		);
		setChatIsOpen(true);
		setSelectedChat({
			id: chat?.id,
			recipient: userName,
			participants: [userId, user.uid],
		});
		//TODO: essa função irá abrir o chat com o usuario com o id userID
	};

	const sortedUsers = users?.sort((a, b) =>
		a.online === b.online ? 0 : a.online ? -1 : 1
	);

	useEffect(() => {
		if (users) {
			localStorage.setItem("usersLength", users.length);
		}
	}, [users]);

	const usersLength = localStorage.getItem("usersLength");
	const quantity =
		usersLength && !isNaN(parseInt(usersLength)) ? parseInt(usersLength) : 5;

	return (
		<aside className="h-screen w-[200px] border border-border p-5">
			<h2 className="font-medium text-lg mb-5">Membros</h2>
			{sortedUsers
				? sortedUsers
						.filter((u) => u.id !== user.uid)
						.map((user) => (
							<div
								key={user.id}
								className="flex items-center gap-2 text-sm py-2.5"
								role="button"
								onClick={() => openChat(user.id, user.name)}
							>
								<div
									className={`${
										user.online ? "bg-green-500" : "bg-red-500"
									} w-2 h-2 rounded-full`}
								/>
								<p className="font-medium">{user.name}</p>
							</div>
						))
				: [...Array(quantity)].map((_, index) => (
						<MemberSkeleton key={index} />
				  ))}
		</aside>
	);
}
