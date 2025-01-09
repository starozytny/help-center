import React, { useState } from "react";

import { cn } from "@shadcnComponents/lib/utils"

import { General } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/General";
import { Description } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/Description";
import { Photos } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/Photos";
import { Observations } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/Observations";

const images = require.context('../../../../../../../images/help/documentations/products/lotys/comm_gerance', false, /\.png$/);

export function CommGerance() {
	const [tab, setTab] = useState(3);

	let styleTab = "cursor-pointer px-2 py-1.5";
	let styleTabInactive = "hover:bg-blue-100 transition-colors";
	let styleTabActive = "bg-blue-500 text-slate-50 font-medium";

	let tabs = [
		{ value: 0, label: "Général", imgSrc: 'general', content: <General /> },
		{ value: 1, label: "Description", imgSrc: 'description', content: <Description /> },
		{ value: 2, label: "Photos", imgSrc: 'photos', content: <Photos /> },
		{ value: 3, label: "Observations", imgSrc: 'observations', content: <Observations /> },
	];

	return <>
		<div className="flex gap-4">
			<div className="w-[870px] h-[668px]">
				<img src={images(`./${tabs[tab].imgSrc}.png`)} alt="image general" className="w-full h-full shadow p-1 rounded-md bg-gray-300" />
			</div>

			<div className="w-[calc(100%-870px-1rem)]">
				<div className="absolute top-0 left-0 w-[870px] h-[668px] rounded-md bg-gray-950/30">
					{tabs[tab].content}
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
									 onClick={() => setTab(item.value)}>
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
