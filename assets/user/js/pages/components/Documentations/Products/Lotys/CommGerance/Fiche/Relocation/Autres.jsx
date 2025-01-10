import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function Autres () {
	return <>
		<div className="absolute top-[312px] left-[425px]">
			<DateDispo />
		</div>
		<div className="absolute top-[312px] left-[654px]">
			<Courtier />
		</div>
		<div className="absolute top-[341px] left-[158px]">
			<LibelleVacance />
		</div>
	</>
}

function DateDispo () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[107px] h-[24px]")}>Date disponible</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 2 : Détails du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Date disponible</span></p>
				<p>Ajouté seulement si la date est supérieur à la date du jour du transfert.</p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Courtier () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[43px] h-[24px]")}>Nego.</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="font-medium">
				<Badge type="blue">Étape 1 : Informations globales</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Négociateur</span></p>
				<p>Ce champ est pris en compte que si vous avez demandé l'activation de cette option auprès de Logilink.</p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function LibelleVacance () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[326px] h-[24px] font-semibold text-red-400 hover:text-red-500")}>
				<span class="icon-warning !font-semibold"></span> Statut : Important
			</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96 sm:w-[414px] lg:w-[568px]">
			<div className="font-medium">
				<Badge type="red">Statut du bien</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p>
					En étant <i>Libre</i> ou <i>Néant</i>, le bien sera considéré comme <i>actif</i> si tous les champs obligatoires
				    demandés par Lotys sont remplis.
					<br/>
					<br/>
					En étant <i>Loué</i> ou <i>Loué prop.</i>, le bien sera considéré comme <i>inactif</i> et Lotys saura que le bien a été loué.
					<br/>
					<br/>
					Pour les autres états, le bien sera considéré comme <i>inactif</i>.
				</p>
			</div>
		</HoverCardContent>
	</HoverCard>
}
