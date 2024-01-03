import React, { useState } from "react";
import { Button } from "../../shadcn/components/ui/button";
import { Input } from "../../shadcn/components/ui/input";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { ReloadIcon } from "@radix-ui/react-icons";
import Logo from "../../components/Logo";

export default function Login() {
	const { login, isPanding, error } = useLogin();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (e) => {
		e.preventDefault();
		login(email, password);
	};

	return (
		<div className="flex gap-20 w-full h-screen px-40 py-28">
			<div className="w-1/2 bg-muted rounded-xl p-12">
				<Logo />
				<h2 className="mt-24 font-medium text-4xl leading-[54px]">
					Lorem ipsum dolor sit, amet consectetur adipisicing elit.
				</h2>
				<p className="mt-12 text-muted-foreground">
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta, nisi
					velit. Enim ullam suscipit cum dolore minima, cupiditate ipsam
					accusantium quisquam laudantium labore eligendi culpa fuga error
					voluptas voluptatibus vero.
				</p>
				<div className="bg-foreground text-background p-8 rounded-lg mt-24">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt
					reprehenderit hic repellendus tempore assumenda blanditiis sed qui
					quasi quidem odio doloribus iste fugit eligendi consequatur optio
					officia, odit ratione id!
				</div>
			</div>
			<div className="w-1/2 flex flex-col justify-center px-28">
				<h1 className="text-3xl font-semibold">Entre na sua conta</h1>
				<p className="mt-4 text-muted-foreground font normal text-lg">
					Informe seus dados de acesso
				</p>
				<form className="mt-10" onSubmit={handleLogin}>
					<p className="mt-5 text-muted-foreground  mb-2.5">Email</p>
					<Input
						type="email"
						autoComplete="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<p className="mt-5 text-muted-foreground  mb-2.5">Senha</p>
					<Input
						type="password"
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button
						size="xl"
						className="w-full mt-10 p-5 text-lg"
						disable={isPanding}
					>
						{isPanding && <ReloadIcon className="w-5 h-5 mr-2 animate-spin" />}
						Entre na sua conta
					</Button>
				</form>
				<div className="mt-12 text-lg flex justify-center gap-4 font-medium">
					<p>Não tem uma conta?</p>
					<Link to={"/signup"} className="text-primary">
						Cadastre-se agora.
					</Link>
				</div>
			</div>
		</div>
	);
}
