import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function Haut () {
	return <>
		<div className="absolute top-[89px] left-[533px]">
			<Surface />
		</div>
		<div className="absolute top-[130px] left-[86px]">
			<Quartier />
		</div>
		<div className="absolute top-[166px] left-[86px]">
			<Etat />
		</div>
		<div className="absolute top-[166px] left-[369px]">
			<Expo />
		</div>
		<div className="absolute top-[166px] left-[639px]">
			<Vue />
		</div>
		<div className="absolute top-[200px] left-[369px]">
			<EauChaude />
		</div>
		<div className="absolute top-[200px] left-[751px]">
			<NbVoiture />
		</div>
		<div className="absolute top-[232px] left-[86px]">
			<Jardin />
		</div>
		<div className="absolute top-[237px] left-[431px]">
			<SurfaceJardin />
		</div>
		<div className="absolute top-[237px] left-[751px]">
			<SurfaceTerrasse />
		</div>
	</>
}

function Surface () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[71px] h-[24px]")}>Habitable</div>
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

function Quartier () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[269px] h-[24px]")}>Quartier</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 6 : Localisation</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Localisation - Quartier</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Etat () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[177px] h-[24px]")}>État</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96">
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<ul>
					<li><span className="font-medium">Neuf / Refait à neuf / Rénové : </span> Récent (OUI)</li>
					<li><span className="font-medium">A rénover : </span> Travaux à prévoir (OUI)</li>
				</ul>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Expo () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[148px] h-[24px]")}>Exposition</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Caractéristique - Exposition</span></p>
				Seul les orientations sont prises en comptes (Nord, Sud, Est, Ouest).
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Vue () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[174px] h-[24px]")}>Belle vue</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="font-medium">
				<Badge type="blue">Étape 3 : Avantages</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Belle vue (OUI) si la valeur comporte un des mots suivants :</span></p>
				<ul>
					<li>Dégagée</li>
					<li>Vue</li>
					<li>Sur mer</li>
					<li>Colline</li>
				</ul>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function EauChaude () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[148px] h-[24px]")}>Type d'eau chaude</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Caractéristique - Type d'eau chaude (1/2)</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function NbVoiture () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[63px] h-[24px]")}>Parkings</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Nombre de - Parkings</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Jardin () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[74px] h-[26px] border-2 border-white bg-white/40")}></div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 3 : Avantages</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Avantages - Jardin</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function SurfaceJardin () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[85px] h-[24px]")}>Surface jardin</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Surface - Jardin</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function SurfaceTerrasse () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[63px] h-[24px]")}>Surf. ter.</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Surface - Terrasse</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}
