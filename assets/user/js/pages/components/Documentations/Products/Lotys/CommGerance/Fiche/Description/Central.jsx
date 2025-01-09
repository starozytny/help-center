import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function Central () {
	return <>
		<div className="absolute top-[223px] left-[208px]">
			<Usage />
		</div>
		<div className="absolute top-[359px] left-[208px]">
			<Description />
		</div>
	</>
}

function Usage () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[548px] h-[107px] border-2 border-white bg-white/40")}></div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96 sm:w-[414px] lg:w-[520px]">
			<div className="font-medium flex gap-2">
				<Badge type="blue">Étape 1 : Informations globales</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p>Selon si la valeur cochée :</p>
				<ul>
					<li><span className="font-medium">Habitation : </span> Type de bien - Appartement</li>
					<li><span className="font-medium">Garage/Parking : </span> Type de bien - Parking/Box</li>
					<li><span className="font-medium">Divers : </span> Type de bien - Autres</li>
					<li><span className="font-medium">Cave : </span> Type de bien - Autres</li>
					<li><span className="font-medium">Professionnel : </span> Type de bien - Bureau</li>
					<li><span className="font-medium">Meublé : </span> Type de bien - Appartement et Étape 2 : Caractéristique - meublé</li>
					<li><span className="font-medium">Espace pub. : </span> Type de bien - Autres</li>
					<li><span className="font-medium">Terrain : </span> Type de bien - Terrain</li>
					<li><span className="font-medium">Commerce : </span> Type de bien - Boutique</li>
					<li><span className="font-medium">Viager : </span> Type de bien - Autres</li>
					<li><span className="font-medium">Villa : </span> Type de bien - Maison</li>
					<li><span className="font-medium">Local/Bureaux : </span> Type de bien - Local</li>
				</ul>
			</div>
		</HoverCardContent>
	</HoverCard>
}


function Description () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[645px] h-[288px]")}>
				Description détaillé du lot
				<br/>
				<br/>
				Merci d'éviter les points-virgules (;)
				<br/><br/>
				<span className="text-red-500 font-medium">Attention !</span> Champ à sélectionner lors du transfert entre
				le logiciel de gérance et Lotys, si c'est celui que vous utilisez pour vos annonces.
			</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96 sm:w-[414px] lg:w-[520px]">
			<div className="font-medium flex gap-2">
				<Badge type="blue">Étape 1 : Informations globales</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p>
					Merci d'éviter les points-virgules (;)
					<br/>
					<span className="text-red-500 font-medium">Attention !</span> Champ à sélectionner lors du transfert entre
					le logiciel de gérance et Lotys, si c'est celui que vous utilisez pour vos annonces.
				</p>
			</div>
		</HoverCardContent>
	</HoverCard>
}
