import React from "react";

import { cn } from "@shadcnComponents/lib/utils"
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function Proprietaire () {
	return <>
		<div className="absolute top-[64px] left-[740px]">
			<Name />
		</div>
	</>
}

function Name () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[78px] h-[21px]")}>Propriétaire</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96">
			<div className="font-medium">
				<Badge type="blue">Étape 8 : Confidentiel</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Données du propriétaire</span></p>
				<ul>
					<li>Civilité Nom Prénom</li>
					<li>Adresse email</li>
					<li>Téléphone</li>
				</ul>
				<br />
				Si le combo <i>Civilité Nom Prénom</i>, n'existe pas, nous l'ajoutons automatiquement.
				<br/>
				S'il existe, nous mettons à jour les données du propriétaire concerné
			</div>
		</HoverCardContent>
	</HoverCard>
}
