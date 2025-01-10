import React, { useState } from "react";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Toastr from "@tailwindFunctions/toastr";

import { Button } from "@tailwindComponents/Elements/Button";
import { InputView, SelectCombobox } from "@tailwindComponents/Elements/Fields";

const URL_SHARE_LINK = "auto_connect";

export function ShareContent ({ page, type, slug, cat, id, itemsShare }) {
	const [shareUser, setShareUser] = useState("");
	const [shareLink, setShareLink] = useState("");

	const handleSelect = (name, value) => {
		let item = itemsShare.find(v => v.value === value);

		setShareUser(value);
		if(type === "faq"){
			setShareLink(location.origin + Routing.generate(URL_SHARE_LINK, {token: item.token, page: page, type: type, cat: cat, id: id}));
		}else{
			setShareLink(location.origin + Routing.generate(URL_SHARE_LINK, {token: item.token, page: page, type: type, slug: slug}));
		}
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(shareLink).then(r => Toastr.toast('info', 'Lien copié dans le presse papier.'));
	}

	return <>
		<div className="font-medium">Partager le lien</div>
		<div className="text-gray-600 text-sm">Sélectionnez un utilisateur pour lui permettre de voir la page avec son compte.</div>
		<div className="mt-2">
			<SelectCombobox identifiant="shareUser" valeur={shareUser} items={itemsShare}
							errors={[]} onSelect={handleSelect} toSort={true} placeholder="Sélectionner un utilisateur.." />
		</div>
		<div className="mt-4 font-medium">Lien de partage</div>
		<div className="mt-2 flex gap-2">
			<div className="w-[calc(100%-112px-0.5rem)]">
				<InputView identifiant="shareLink" valeur={shareLink} errors={[]} onChange={null} />
			</div>
			<div className="w-[112px]">
				<Button type="blue" onClick={handleCopy}>Copier le lien</Button>
			</div>
		</div>
	</>
}
