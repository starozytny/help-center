import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function ColGauche () {
	return <>
		<div className="absolute top-[168px] left-[28px]">
			<Avantages />
		</div>
		<div className="absolute top-[341px] left-[28px]">
			<Chauffage />
		</div>
		<div className="absolute top-[484px] left-[28px]">
			<Energie />
		</div>
	</>
}

function Avantages () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[150px] h-[161px] border-2 border-white bg-white/40")}></div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96 sm:w-[414px] lg:w-[520px]">
			<div className="font-medium flex gap-2">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
				<Badge type="blue">Étape 3 : Avantages</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p>Selon si la valeur cochée :</p>
				<ul>
					<li><span className="font-medium">Cave : </span> Avantages - Cave</li>
					<li><span className="font-medium">Parking : </span> Nombre de - Parkings</li>
					<li><span className="font-medium">Ascenseur : </span> n'est pas pris en compte</li>
					<li><span className="font-medium">Balcon : </span> Avantages - Balcon et Nombre de - Balcons prend la valeur 1</li>
					<li><span className="font-medium">Terrasse : </span> Avantages - Terrasse et Nombre de - Terrasses prend la valeur 1</li>
					<li><span className="font-medium">Garage : </span> Nombre de - Boxes prend la valeur 1</li>
				</ul>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Chauffage () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[150px] h-[131px] border-2 border-white bg-white/40")}></div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96">
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Caractéristique - Type de chauffage (1/2)</span></p>
				<i>Individuel ou Central indi.</i> prend la valeur <i>Individuel</i>.
				<br/>
				<i>Collectif</i> prend la valeur <i>Collectif</i>.
				<br/>
				<i>Aucun,</i> ne prend aucun valeur.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Energie () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[150px] h-[167px] border-2 border-white bg-white/40")}></div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96">
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Caractéristique - Type de chauffage (2/2)</span></p>
				<i>Solaire et Autre</i> ne sont pas pris en compte.
			</div>
		</HoverCardContent>
	</HoverCard>
}
