import React from "react";

import { cn } from "@shadcnComponents/lib/utils"
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function BasGauche () {
	return <>
		<div className="absolute top-[312px] left-[332px]">
			<NumeroMandat />
		</div>
		<div className="absolute top-[348px] left-[158px]">
			<DebutMandat />
		</div>
		<div className="absolute top-[348px] left-[307px]">
			<FinMandat />
		</div>
		<div className="absolute top-[455px] left-[158px]">
			<CodeGLI />
		</div>
		<div className="absolute top-[491px] left-[158px]">
			<DateGLI />
		</div>
	</>
}

function NumeroMandat () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[86px] h-[24px]")}>Numéro</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96">
			<div className="font-medium">
				<Badge type="blue">Étape 1 : Informations globales</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Numéro du mandat</span></p>
				Par défaut, le <i>Type du mandat</i> sélectionne <u>Gestion</u>, faisant apparaitre les champs <i>Numéro, début et fin</i> du mandat.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function DebutMandat () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[112px] h-[24px]")}>Début du mandat</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96">
			<div className="font-medium">
				<Badge type="blue">Étape 1 : Informations globales</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Début du mandat</span></p>
				Par défaut, le <i>Type du mandat</i> sélectionne <u>Gestion</u>, faisant apparaitre les champs <i>Numéro, début et fin</i> du mandat.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function FinMandat () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[112px] h-[24px]")}>Fin du mandat</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96">
			<div className="font-medium">
				<Badge type="blue">Étape 1 : Informations globales</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Fin du mandat</span></p>
				Par défaut, le <i>Type du mandat</i> sélectionne <u>Gestion</u>, faisant apparaitre les champs <i>Numéro, début et fin</i> du mandat.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function CodeGLI () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[62px] h-[24px]")}>Code GLI</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96" align="start">
			<div className="font-medium">
				<Badge type="blue">Étape 8 : Confidentiel</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">G.L.I</span></p>
				Si une valeur est présente, Lotys considère que le bien est sous G.L.I.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function DateGLI () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[111px] h-[24px]")}>Date GLI</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96" align="start">
			<div className="font-medium">
				<Badge type="blue">Étape 8 : Confidentiel</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">G.L.I</span></p>
				Si une valeur est présente, Lotys considère que le bien est sous G.L.I.
			</div>
		</HoverCardContent>
	</HoverCard>
}
