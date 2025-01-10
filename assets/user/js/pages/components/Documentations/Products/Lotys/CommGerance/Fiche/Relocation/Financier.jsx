import React from "react";

import { cn } from "@shadcnComponents/lib/utils";
import { getInputStyle, getPlaceholderStyle } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";

export function Financier () {
	return <>
		<div className="absolute top-[234px] left-[158px]">
			<Periodicite />
		</div>
		<div className="absolute top-[234px] left-[598px]">
			<TypeCharges />
		</div>
		<div className="absolute top-[279px] left-[214px]">
			<Loyer />
		</div>
		<div className="absolute top-[279px] left-[443px]">
			<Charges />
		</div>
		<div className="absolute top-[279px] left-[654px]">
			<Impots />
		</div>
		<div className="absolute top-[312px] left-[158px]">
			<Caution />
		</div>
		<div className="absolute top-[541px] left-[344px]">
			<EtatDesLieux />
		</div>
		<div className="absolute top-[622px] left-[344px]">
			<Honoraire />
		</div>
	</>
}

function Periodicite () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[141px] h-[24px]")}>Périodicité</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-80">
			<div className="text-sm">
				Divise le <i>loyer demandé</i> en fonction de la périodicité sélectionnée.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function TypeCharges () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[235px] h-[24px]")}>Type de charges</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96 sm:w-[414px] lg:w-[568px]">
			<div className="font-medium">
				<Badge type="blue">Étape 7 : Financier</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Type de charges</span></p>
				<ul>
					<li><span className="font-medium">Néant : </span> Prévisionnelles mensuelles avec régularisation annuelle</li>
					<li><span className="font-medium">Charges forfaitaires : </span> Forfaitaires mensuelles</li>
					<li><span className="font-medium">Régularisation annuelle : </span> Prévisionnelles mensuelles avec régularisation annuelle</li>
					<li><span className="font-medium">Remboursement sur justificatif : </span> Remboursement annuel par le locataire</li>
				</ul>
			</div>
		</HoverCardContent>
	</HoverCard>
}


function Loyer () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[85px] h-[24px]")}>Loyer HC</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 7 : Financier</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Loyer hors charges</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Charges () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[89px] h-[24px]")}>Charges</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96">
			<div className="font-medium">
				<Badge type="blue">Étape 7 : Financier</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Provision pour charges</span></p>
				Additionné au <i>Loyer HT</i> pour obtenir le <i>Loyer TTC</i>.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Impots () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[118px] h-[24px]")}>Ordure ménagère</div>
		</HoverCardTrigger>
		<HoverCardContent className="w-96">
			<div className="font-medium">
				<Badge type="blue">Étape 7 : Financier</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Provision ordure ménagère</span></p>
				Additionné au <i>Loyer HT</i> pour obtenir le <i>Loyer TTC</i>.
			</div>
		</HoverCardContent>
	</HoverCard>
}

function Caution () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[141px] h-[24px]")}>Dépôt de garantie</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 7 : Financier</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Dépôt de garantie</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}

function EtatDesLieux () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[82px] h-[21px]")}>État des lieux</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 7 : Financier</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">État des lieux TTC</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}


function Honoraire () {
	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<div className={cn(getInputStyle(), getPlaceholderStyle(), "w-[82px] h-[21px]")}>Honoraires</div>
		</HoverCardTrigger>
		<HoverCardContent>
			<div className="font-medium">
				<Badge type="blue">Étape 7 : Financier</Badge>
			</div>
			<div className="mt-2 text-sm">
				<p><span className="font-medium">Honoraires (avec état des lieux) TTC</span></p>
			</div>
		</HoverCardContent>
	</HoverCard>
}
