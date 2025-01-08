import React from "react";

import { General } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/General";

export function CommGerance() {
	return <div className="absolute top-0 left-0 w-full h-full bg-gray-950/30">
		<General />
	</div>
}

export function getInputStyle () {
	return "bg-white rounded hover:text-black hover:font-medium group-hover:text-black group-hover:font-medium";
}

export function getPlaceholderStyle () {
	return "text-xs text-gray-600 pl-1.5 pt-1";
}
