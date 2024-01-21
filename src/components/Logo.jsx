import React from "react";
import LogoSvg from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

export default function Logo({size}) {
	const heigth = size === "sm" ? "h-6" : "h-8"
	const fontsize = size === "sm" ? "text-xl" : "text-2xl"
    const navigate = useNavigate()
	
	const navigateToHome = () => navigate("/")

    return (
		<div className="flex items-center gap-3" role="button" onClick={navigateToHome}>
			<img src={LogoSvg} alt="logo" className={heigth}/>
			<h2 className={`${fontsize} font-semibold tracking-widest mb-0.5`}>
				get<span className="text-primary">it</span>done.
			</h2>
		</div>
	);
}
