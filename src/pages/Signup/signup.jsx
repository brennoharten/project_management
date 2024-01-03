import { Button } from "../../shadcn/components/ui/button";
import { Input } from "../../shadcn/components/ui/input";
import Logo from "../../components/Logo";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Signup() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {signup, error, isPending } = useSignup()

    const handleSubmit = (e) =>{
        e.preventDefault()
        signup(email, password, fullName)
    }

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
				<h1 className="text-3xl font-medium">Cadastre-se agora</h1>
				<p className="mt-4 text-muted-foreground font normal text-lg">
					Crie sua conta agora mesmo
				</p>
				<form className="mt-10" onSubmit={handleSubmit}>
					<p className="text-muted-foreground  mb-2.5">Nome Completo</p>
					<Input
						type="text"
						autoComplete="name"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
					/>
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
						autoComplete="newPassword"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button disable={isPending} size="xl" className="w-full mt-10 p-5 text-lg">
						{isPending && (
                            <ReloadIcon className="w-5 h-5 mr-2 animate-spin"/>
                        )}
                        {isPending ? "Criando cadastro..." : "Criar meu cadastro"}
					</Button>
				</form>
				<div className="mt-12 text-lg flex justify-center gap-4 font-medium">
					<p>Já tem uma conta?</p>
					<Link to={"/login"} className="text-primary">
						Entre agora.
					</Link>
				</div>
			</div>
		</div>
	);
}
