import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Membersbar from "./components/Membersbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/home";
import Profile from "./pages/Profile/Profile";
import Projects from "./pages/Projects/projects";
import { ThemeProvider } from "./Providers/theme-provider";
import Login from "./pages/Login/login";
import Tasks from "./pages/Tasks/Tasks";
import Signup from "./pages/Signup/signup";
import { useAuthContext } from "./hooks/useAuthContext.js";
import Loading from "./components/Loading";
import Chat from "./components/Chat";
import ChatButton from "./components/ChatButton";
import { useCollection } from "./hooks/useCollection";
import { Toaster } from "./shadcn/components/ui/toaster";
import { UserDocProvider } from "./contexts/UserDocContext";
import { UsersProvider } from "./contexts/UsersContext";
import { useDocument } from "./hooks/useDocument";
import useMediaQuery from "./hooks/useMediaQuery";

const UserDocWrapper = ({ user, children }) => {
	const { documents: chats } = useCollection("chats", [
		"participants",
		"array-contains",
		user.uid,
	]);
	const { document: userDoc } = useDocument("users", user?.uid);
	if (!userDoc) return <Loading />;
	return children(userDoc, chats);
};

function App() {
	const { user, authIsReady } = useAuthContext();
	const [chatIsOpen, setChatIsOpen] = useState(false);
	const [selectedChat, setSelectedChat] = useState(null);
	const [rerender, setRerender] = useState(false);

	const { documents: users } = useCollection("users");
	const { documents: chats } = useCollection("chats");

	if (!authIsReady) {
		return <Loading />;
	}

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="flex">
				<Toaster />
				<BrowserRouter>
					{user ? (
						<UserDocProvider user={user}>
							<UserDocWrapper user={user}>
								{(userDoc, chats) => (
									<UsersProvider userDoc={userDoc}>
										<>
											<Sidebar rerender={rerender} />
											<div className="flex-grow">
												<Routes>
													<Route exact path="/" element={<Home />} />
													<Route
														path="/Profile"
														element={
															<Profile
																rerender={rerender}
																setRerender={setRerender}
															/>
														}
													/>
													<Route path="/tasks" element={<Tasks />} />
													<Route path="/Home" element={<Home />} />
												</Routes>
											</div>
											<Membersbar
												users={users}
												chats={chats}
												setChatIsOpen={setChatIsOpen}
												setSelectedChat={setSelectedChat}
											/>
											{chatIsOpen && (
												<Chat
													setSelectedChat={setSelectedChat}
													setChatIsOpen={setChatIsOpen}
													chats={chats}
													selectedChat={selectedChat}
													users={users}
												/>
											)}
											<ChatButton
												setChatIsOpen={setChatIsOpen}
												setSelectedChat={setSelectedChat}
											/>
										</>
									</UsersProvider>
								)}
							</UserDocWrapper>
						</UserDocProvider>
					) : (
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="/*" element={<Signup />} />
						</Routes>
					)}
				</BrowserRouter>
			</div>
		</ThemeProvider>
	);
}

export default App;
