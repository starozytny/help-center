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
				<Badge type="blue">Étape 9 : Description</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p>Selon si la valeur cochée :</p>
				<ul>
					<li><span className="font-medium">Habitation : </span> Type de bien - Appartement</li>
					<li><span className="font-medium">Garage/Parking : </span> Type de bien - Parking/Box</li>
					<li><span className="font-medium">Divers : </span> Type de bien - Autres</li>
					<li><span className="font-medium">Cave : </span> Type de bien - Autres</li>
					<li><span className="font-medium">Professionnel : </span> Type de bien - Local</li>
					<li><span className="font-medium">Meublé : </span> Type de bien - Appartement et Étape 2 : Caractéristique - meublé</li>
					<li><span className="font-medium">Espace pub. : </span> Type de bien - Autres</li>
					<li><span className="font-medium">Terrain : </span> Type de bien - Terrain</li>
					<li><span className="font-medium">Commerce : </span> Type de bien - Boutique</li>
					<li><span className="font-medium">Viager : </span> Type de bien - Autres</li>
					<li><span className="font-medium">Villa : </span> Type de bien - Maison</li>
					<li><span className="font-medium">Local/Bureaux : </span> Type de bien - Local</li>
				</ul>
				<br/>
				La valeur <span className="font-medium">Titre de l'annonce</span> prend la valeur cochée sauf
				pour <i>Habitation et Meublé</i> qui prennent la valeur <i>Appartement</i>.
				<br/>
				Vous pouvez modifier cette valeur depuis Lotys par un titre personnalisé et il ne sera pas écrasé lors des transferts.
				<br/><br/>
				Si vous souhaitez obtenir une <i>Maison meublée</i>, veuillez vous référer au
				guide <a href="https://aide.logilink.fr/espace-membre/produits/produit/Lotys/tutoriels/tutoriel/Gerance-Maison-meublee"
						 title="Gerance : Maison meublée" className="text-blue-500 hover:text-blue-700 hover:underline">Gérance : Maison meublée</a>.
			</div>
		</HoverCardContent>
	</HoverCard>
}


function Description () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[645px] h-[288px] border-2 border-white bg-white/40")}>
				<span className="inline-block mt-1 p-2 bg-white rounded w-[calc(520px-1rem)]">
					Description WEB
					<br />
					<br />
					Merci d'éviter les points-virgules (;)
					<br /><br />
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
