import React, { useState } from "react";

import { cn } from "@shadcnComponents/lib/utils"

import { General } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/General";

const images = require.context('../../../../../../../images/help/documentations/products/lotys/comm_gerance', false, /\.png$/);

export function CommGerance() {
	const [tab, setTab] = useState(0);
	const [imgSrc, setImgSrc] = useState("general");

	const handleChangeTab = (item) => {
		setTab(item.value);
		setImgSrc(item.imgSrc);
	}

	let styleTab = "cursor-pointer px-2 py-1.5";
	let styleTabInactive = "hover:bg-blue-100 transition-colors";
	let styleTabActive = "bg-blue-500 text-slate-50 font-medium";

	let tabs = [
		{ value: 0, label: "Général", imgSrc: 'general' },
		{ value: 1, label: "Description", imgSrc: 'description' },
		{ value: 2, label: "Photos", imgSrc: 'general' },
		{ value: 3, label: "Conditions", imgSrc: 'general' },
	];

	return <>
		<div className="flex gap-4">
			<div className="w-[870px] h-[668px]">
				<img src={images(`./${imgSrc}.png`)} alt="image general" className="w-full h-full shadow p-1 rounded-md bg-gray-300" />
			</div>

			<div className="w-[calc(100%-870px-1rem)]">
				<div className="absolute top-0 left-0 w-[870px] h-[668px] rounded-md  bg-gray-950/30">
					<General />
				</div>
				<div className="bg-white border shadow rounded-md w-full">
					<div className="py-2 border-b font-medium text-lg text-center bg-gray-50 rounded-t-md">Navigation</div>
					<div>
						{tabs.map((item, index) => {
							return <div key={index}>
								<div className={cn(
									styleTab,
									tab === item.value ? styleTabActive : styleTabInactive,
									index === (tabs.length - 1) ? "rounded-b-md" : ""
								)}
									 onClick={() => handleChangeTab(item)}>
									{item.label}
								</div>
							</div>
						})}
					</div>
				</div>
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
