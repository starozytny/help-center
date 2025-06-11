import React, { useRef } from "react";
import PropTypes from 'prop-types';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sanitaze from "@commonFunctions/sanitaze";

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { ButtonIcon, ButtonIconA } from "@tailwindComponents/Elements/Button";

const URL_UPDATE_PAGE = "user_help_changelogs_update";
const URL_PREVIEW_FILE = "user_help_changelogs_preview_html";

export function ChangelogsItem ({ elem, highlight, onModal, productSlug }) {
	const refItem = useRef(null);

	let nHighlight = useHighlight(highlight, elem.id, refItem);

	let urlUpdate = Routing.generate(URL_UPDATE_PAGE, { p_slug: productSlug, id: elem.id });

	return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
		<div className="item-content">
			<div className="item-infos">
				<div className="col-1">
					<div>
						<div className="font-bold">{elem.isDraft ? "Brouillon" : elem.numero}</div>
						<div className="text-gray-600 text-sm">{Sanitaze.toDateFormat(elem.dateAt, 'LL')}</div>
					</div>
				</div>
				<div className="col-2">
					<div className="flex gap-2">
						<Badge type="blue">{elem.numVersion}</Badge>
						{elem.isPatch
							? <Badge type="gray">P.{elem.numPatch}</Badge>
							: null
						}
						<div className="font-medium">{elem.name}</div>
					</div>
				</div>
				<div className="col-3">
					<ButtonIconA type="default" icon="vision" target="_blank"
								 onClick={Routing.generate(URL_PREVIEW_FILE, {p_slug: productSlug, id: elem.id})}>
						Aperçu
					</ButtonIconA>
				</div>
				<div className="col-4 actions">
					<ButtonIconA type="default" icon="pencil" onClick={urlUpdate}>Modifier</ButtonIconA>
					<ButtonIcon type="default" icon="trash" onClick={() => onModal("delete", elem)}>Supprimer</ButtonIcon>
				</div>
			</div>
		</div>
	</div>
}

ChangelogsItem.propTypes = {
	elem: PropTypes.object.isRequired,
	onModal: PropTypes.func.isRequired,
}
