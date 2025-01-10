import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function HautVert () {
	return <>
		<div className="absolute top-[64px] left-[95px]">
			<Surface />
		</div>
		<div className="absolute top-[64px] left-[276px]">
			<NbPiece />
		</div>
		<div className="absolute top-[64px] left-[373px]">
			<Etage />
		</div>
	</>
}

function Surface () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[83px] h-[24px]")}>Habitable</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Surface - Habitable</span></p>
				Pour les <i>Parking/Box, Terrain</i>, Surface - Total.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function NbPiece () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[47px] h-[24px]")}>Pièces</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Nombre de - Pièces</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Etage () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[47px] h-[24px]")}>Étage</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96">
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Caractéristique - À quel étage se trouve le bien ?</span></p>
				Saisir <i>0</i> ou <i>RDC</i> pour <i>Rez de chaussé</i>.
			</div>
		</HoverCardContent>
	</HoverCard>
}
