import React, { useRef } from "react";
import PropTypes from 'prop-types';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sanitaze from "@commonFunctions/sanitaze";

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { Button, ButtonIcon, ButtonIconA } from "@tailwindComponents/Elements/Button";

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
						<div className="font-bold">{elem.numero} - {elem.numVersion}</div>
						<div className="text-gray-600 text-sm">{Sanitaze.toDateFormat(elem.dateAt)}</div>
					</div>
				</div>
				<div className="col-2">
					<span className="font-medium">{elem.name}</span>
				</div>
				<div className="col-3">
					<div className="flex gap-1">
						<div>
							<Button type="default" onClick={() => onModal('generate', elem)}>Générer le fichier</Button>
						</div>
						{elem.filename
							? <div>
								<ButtonIconA type="default" icon="vision" target="_blank"
											 onClick={Routing.generate(URL_PREVIEW_FILE, {p_slug: productSlug, id: elem.id})}>
									Aperçu
								</ButtonIconA>
							</div>
							: null
						}
					</div>
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
