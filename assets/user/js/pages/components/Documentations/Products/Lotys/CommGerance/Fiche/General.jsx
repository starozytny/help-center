import React from "react";

import { Immeuble } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/General/Immeuble";
import { Proprietaire } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/General/Proprietaire";
import { BasGauche } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/General/BasGauche";

export function General () {
	return <>
		<Immeuble />
		<Proprietaire />
		<BasGauche />
	</>
}
