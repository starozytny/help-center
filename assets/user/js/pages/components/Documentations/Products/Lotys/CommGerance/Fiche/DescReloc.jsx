import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function DescReloc () {
	return <>
		<div className="absolute top-[72px] left-[25px]">
			<Item />
		</div>
	</>
}

function Item () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[820px] h-[514px] border-2 border-white bg-white/40")}>
				<span className="inline-block mt-1 p-2 bg-white rounded w-[calc(520px-1rem)]">
					Description WEB
					<br/>
					<br/>
					Merci d'éviter les points-virgules (;)
					<br/><br/>
					<span className="text-red-500 font-medium">Attention !</span> Champ à sélectionner lors du transfert entre
					le logiciel de gérance et Lotys, si c'est celui que vous utilisez pour vos annonces.
				</span>
			</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96 sm:w-[414px] lg:w-[520px]">
			<div className="font-medium flex gap-2">
				<Badge type="blue">Étape 9 : Description</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p>
					Merci d'éviter les points-virgules (;)
					<br />
					<span className="text-red-500 font-medium">Attention !</span> Champ à sélectionner lors du transfert entre
					le logiciel de gérance et Lotys, si c'est celui que vous utilisez pour vos annonces.
				</p>
			</div>
		</HoverCardContent>
	</HoverCard>
}
