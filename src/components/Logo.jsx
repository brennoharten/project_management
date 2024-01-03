import React from "react";
import LogoSvg from "../assets/logo.svg";

export default function Logo({size}) {
	const heigth = size === "sm" ? "h-6" : "h-8"
	const fontsize = size === "sm" ? "text-xl" : "text-2xl"
    
    return (
		<div className="flex items-center gap-3">
			<img src={LogoSvg} alt="logo" className={heigth}/>
			<h2 className={`${fontsize} font-semibold tracking-widest mb-0.5`}>
				get<span className="text-primary">it</span>done.
			</h2>
		</div>
	);
}
