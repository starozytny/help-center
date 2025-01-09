import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function Locataire () {
	return <>
		<div className="absolute top-[119px] left-[158px]">
			<ItemLocataire />
		</div>
		<div className="absolute top-[176px] left-[158px]">
			<TypeBail />
		</div>
	</>
}

function ItemLocataire () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[384px] h-[24px]")}>Données du dernier locataire</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="text-sm">
				<p><span className="font-medium">Données du dernier locataire</span></p>
				<ul>
					<li>Nom</li>
					<li>Prénom</li>
					<li>Adresse email</li>
					<li>Téléphone</li>
				</ul>
				<br />
				Ces données sont visibles sur Lotys, dans la <i>liste des biens en location</i> en cliquant sur un bien.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function TypeBail () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[675px] h-[24px]")}>Cas particulier des maisons meublées</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="text-sm">
				Si vous souhaitez obtenir une <i>Maison meublée</i>, veuillez vous référer au
				guide <a href="https://aide.logilink.fr/espace-membre/produits/produit/Lotys/tutoriels/tutoriel/Gerance-Maison-meublee"
						 title="Gerance : Maison meublée" className="text-blue-500 hover:text-blue-700 hover:underline">Gérance : Maison meublée</a>.
			</div>
		</HoverCardContent>
	</HoverCard>
}
