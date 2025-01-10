import React, { useEffect, useState } from "react";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import axios from "axios";

import Formulaire from "@commonFunctions/formulaire";

import { Button } from "@tailwindComponents/Elements/Button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcnComponents/ui/hover-card";
import { ShareContent } from "@userPages/Share/ShareContent";

const URL_SELECT_ITEMS = "intern_api_selection_share";

export function ShareButton ({ page, type, slug }) {
	const [itemsShare, setItemsShare] = useState([]);
	const [loadData, setLoadData] = useState(true);

	useEffect(() => {
		axios({ method: "GET", url: Routing.generate(URL_SELECT_ITEMS, {productSlug: page}), data: {} })
			.then(function (response) {
				setItemsShare(response.data)
			})
			.catch(function (error) {
				Formulaire.displayErrors(null, error);
			})
			.then(function () {
				setLoadData(false)
			})
		;
	}, []);

	return <HoverCard openDelay={100} closeDelay={0}>
		<HoverCardTrigger>
			<Button type="default" iconLeft="share">
				Partager
			</Button>
		</HoverCardTrigger>
		<HoverCardContent className="w-96" align="end">
			{loadData
				? <span className="icon-chart-3"></span>
				: <ShareContent page={page} type={type} slug={slug} itemsShare={itemsShare} />
			}
		</HoverCardContent>
	</HoverCard>
}
