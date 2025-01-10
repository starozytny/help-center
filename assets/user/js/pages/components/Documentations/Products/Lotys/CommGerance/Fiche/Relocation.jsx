import React from "react";

import { Locataire } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/Relocation/Locataire";
import { Financier } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/Relocation/Financier";
import { Autres } from "@userPages/Documentations/Products/Lotys/CommGerance/Fiche/Relocation/Autres";

export function Relocation () {
	return <>
		<Locataire />
		<Financier />
		<Autres />
	</>
}
