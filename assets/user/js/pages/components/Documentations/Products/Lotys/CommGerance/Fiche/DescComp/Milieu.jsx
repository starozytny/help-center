import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function Milieu () {
	return <>
		<div className="absolute top-[286px] left-[589px]">
			<NbChambre />
		</div>
		<div className="absolute top-[283px] left-[709px]">
			<Latitude />
		</div>
		<div className="absolute top-[316px] left-[380px]">
			<Salon />
		</div>
		<div className="absolute top-[318px] left-[589px]">
			<SurfaceSalon />
		</div>
		<div className="absolute top-[322px] left-[709px]">
			<Longitude />
		</div>
		<div className="absolute top-[350px] left-[291px]">
			<CuisineType />
		</div>
		<div className="absolute top-[350px] left-[589px]">
			<CuisineEquipee />
		</div>
		<div className="absolute top-[414px] left-[136px]">
			<SalleDeBain />
		</div>
		<div className="absolute top-[414px] left-[456px]">
			<SalleEau />
		</div>
		<div className="absolute top-[414px] left-[617px]">
			<NbWC />
		</div>
		<div className="absolute top-[414px] left-[702px]">
			<TypeWC />
		</div>
	</>
}

function NbChambre () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[51px] h-[24px]")}>Nb. Ch.</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Nombre de - Chambres</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}
function Latitude () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[89px] h-[24px]")}>Latitude</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 6 : Localisation</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Géolocalisation - Latitude</span></p>
				Par défaut, la géolocalisation n'est pas masquée.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Salon () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[74px] h-[26px] border-2 border-white bg-white/40")}></div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Nombre de - Salon</span></p>
				Si la valeur est cochée, Lotys saisi 1.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function SurfaceSalon () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[51px] h-[24px]")}>Sur. Sal.</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Surface - Salon</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Longitude () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[89px] h-[24px]")}>Longitude</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 6 : Localisation</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Géolocalisation - Longitude</span></p>
				Par défaut, la géolocalisation n'est pas masquée.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function CuisineType () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[129px] h-[24px]")}>Cuisine (1)</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96">
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Caractéristique - Type de cuisine</span></p>
				<p>En combinaison avec le champ <i>Équipée</i>.</p>
				<ul>
					<li><span className="font-medium">Normal + Équipée : </span> Équipée</li>
					<li><span className="font-medium">Américaine + Équipée : </span> Américaine équipée</li>
					<li><span className="font-medium">Américaine + Non équipée : </span> Américaine</li>
					<li><span className="font-medium">Kitchenette + Équipée : </span> Équipée</li>
					<li><span className="font-medium">Kitchenette + Non équipée : </span> Coin cuisine</li>
				</ul>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function CuisineEquipee () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[141px] h-[24px]")}>Cuisine (2)</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96">
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Caractéristique - Type de cuisine</span></p>
				<p>En combinaison avec le champ <i>Type</i>.</p>
				<ul>
					<li><span className="font-medium">Normal + Équipée : </span> Équipée</li>
					<li><span className="font-medium">Américaine + Équipée : </span> Américaine équipée</li>
					<li><span className="font-medium">Américaine + Non équipée : </span> Américaine</li>
					<li><span className="font-medium">Kitchenette + Équipée : </span> Équipée</li>
					<li><span className="font-medium">Kitchenette + Non équipée : </span> Coin cuisine</li>
				</ul>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function SalleDeBain () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[81px] h-[24px]")}>Salle de bain</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Nombre de - Salle de bain</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function SalleEau () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[69px] h-[24px]")}>Salle d'eau</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Nombre de - Salle d'eau</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function NbWC () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[50px] h-[24px]")}>Nb. WC</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Nombre de - WC</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function TypeWC () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[120px] h-[24px]")}>Type WC</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Caractéristique - WC séparé</span></p>
				<ul>
					<li><span className="font-medium">Intérieur : </span> Non</li>
					<li><span className="font-medium">Extérieur : </span> Oui</li>
					<li><span className="font-medium">Séparé : </span> Oui</li>
				</ul>
			</div>
		</HoverCardContent>
	</HoverCard>
}
