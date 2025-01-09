import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function ListPhotos () {
	return <>
		<div className="absolute top-[86px] left-[143px]">
			<ItemPhotos />
		</div>
	</>
}

function ItemPhotos () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[520px] h-[263px] border-2 border-white bg-white/40")}>
				<span className="inline-block mt-1 p-2 bg-white rounded w-[calc(520px-1rem)]">
					L'ordre des photos doit suivre le schéma suivant : 0001, 0002, 0003, etc..
					<br/><br/>
					Taille de photos en recommandée : 1920 x 1080 max
					<br/>
					Gardez la même taille pour toutes les photos afin d'avoir un rendu homogène et professionnel sur toutes vos annonces.
					<br/><br/>
					Les visites virtuels portent un intitulé propre dans la colonne ordre.
				</span>
			</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96 sm:w-[414px] lg:w-[520px]">
			<div className="font-medium flex gap-2">
				<Badge type="blue">Étape 11 : Photos</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p>Les photos sont supprimées puis ajoutées lors de chaque transferts.</p>
			</div>
		</HoverCardContent>
	</HoverCard>
}
