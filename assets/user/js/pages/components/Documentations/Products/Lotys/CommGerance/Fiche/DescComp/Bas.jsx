import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function Bas () {
	return <>
		<div className="absolute top-[492px] left-[702px]">
			<DateDPE />
		</div>
		<div className="absolute top-[528px] left-[648px]">
			<LetterDPE />
		</div>
		<div className="absolute top-[528px] left-[765px]">
			<ValDPE />
		</div>
		<div className="absolute top-[559px] left-[648px]">
			<LetterGES />
		</div>
		<div className="absolute top-[559px] left-[765px]">
			<ValGES />
		</div>
	</>
}

function DateDPE () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[120px] h-[24px]")}>Date DPE</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="font-medium">
				<Badge type="blue">Étape 5 : Diagnostic</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Diagnostic - Date de réalisation du DPE</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function LetterDPE () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[57px] h-[24px]")}>Let. DPE</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="font-medium">
				<Badge type="blue">Étape 5 : Diagnostic</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Diagnostic - Lettre DPE</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function ValDPE () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[57px] h-[24px]")}>Val. DPE</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="font-medium">
				<Badge type="blue">Étape 5 : Diagnostic</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Diagnostic - Conso. énergétique DPE en KWh/m² an</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function LetterGES () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[57px] h-[24px]")}>Let. GES</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="font-medium">
				<Badge type="blue">Étape 5 : Diagnostic</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Diagnostic - Lettre GES</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function ValGES () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[57px] h-[24px]")}>Val. GES</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="font-medium">
				<Badge type="blue">Étape 5 : Diagnostic</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Diagnostic - Bilan émission GES en Kg/co² an</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}
