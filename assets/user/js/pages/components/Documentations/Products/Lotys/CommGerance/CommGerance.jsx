import React, { useState } from "react";

import { cn } from "@shadcnComponents/lib/utils"

import { General } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/General";

export function CommGerance() {
	const [tab, setTab] = useState(0);

	let styleTab = "cursor-pointer px-2 py-1.5";
	let styleTabInactive = "hover:bg-blue-100 transition-colors";
	let styleTabActive = "bg-blue-500 text-slate-50 font-medium";

	let tabs = [
		{ value: 0, label: "Général" },
		{ value: 1, label: "Description" },
		{ value: 2, label: "Photos" },
		{ value: 3, label: "Conditions" },
	];

	return <>
		<div className="absolute top-0 left-0 w-[870px] h-[668px] rounded-md  bg-gray-950/30">
			<General />
		</div>
		<div className="bg-white border shadow rounded-md w-full">
			<div className="py-2 border-b font-semibold text-center">Navigation</div>
			<div>
				{tabs.map((item, index) => {
					return <div key={index}>
						<div className={cn(
							styleTab,
							tab === item.value ? styleTabActive : styleTabInactive,
							index === (tabs.length - 1) ? "rounded-b-md" : ""
						)}
							 onClick={() => setTab(item.value)}>
							{item.label}
						</div>
					</div>
				})}
			</div>
		</div>
	</>
}

export function getInputStyle () {
	return "bg-white rounded hover:text-black hover:font-medium group-hover:text-black group-hover:font-medium";
}

export function getPlaceholderStyle () {
	return "text-xs text-gray-600 pl-1.5 pt-1";
}
