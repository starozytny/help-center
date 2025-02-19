import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function Immeuble () {
	return <>
		<div className="absolute top-[94px] left-[22px]">
			<Address />
		</div>
		<div className="absolute top-[188px] left-[22px]">
			<Zipcode />
		</div>
		<div className="absolute top-[188px] left-[111px]">
			<City />
		</div>
	</>
}

function Address () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className="w-[396px] h-[87px] rounded group">
				<div className={cn(getInputStyle(), "w-[396px] h-[24px] bg-transparent")}></div>
				<div className={cn(getInputStyle(), getPlaceholderStyle(),"w-[396px] h-[24px] translate-y-[8px]")}>Adresse</div>
				<div className={cn(getInputStyle(), "w-[396px] h-[24px] translate-y-[16px]")}></div>
			</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="font-medium">
				<Badge type="blue">Étape 6 : Localisation</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p>
					<span className="font-medium">Adresse</span>
					<br />
					Par défaut, l'adresse n'est pas masquée.
				</p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Zipcode () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[76px] h-[24px]")}>Code postal</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 6 : Localisation</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Code postal</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function City () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[307px] h-[24px]")}>Ville</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 6 : Localisation</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Ville</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}
