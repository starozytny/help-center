import React, { useRef } from "react";
import PropTypes from 'prop-types';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sanitaze from "@commonFunctions/sanitaze";

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { ButtonIcon, ButtonIconA } from "@tailwindComponents/Elements/Button";

const URL_UPDATE_PAGE = "user_help_changelogs_update";

export function ChangelogsItem ({ elem, highlight, onModal }) {
	const refItem = useRef(null);

	let nHighlight = useHighlight(highlight, elem.id, refItem);

	let urlUpdate = Routing.generate(URL_UPDATE_PAGE, { id: elem.id });

	return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
		<div className="item-content">
			<div className="item-infos">
				<div className="col-1">
					<div>
						<div className="flex items-center gap-2">
							<span className="font-medium">{elem.name}</span>
						</div>
						<div className="text-gray-600 text-sm">
							{elem.updatedAt
								? "Modifié : " + Sanitaze.toDateFormat(elem.updatedAt)
								: Sanitaze.toDateFormat(elem.createdAt)
							}
						</div>
					</div>
				</div>
				<div className="col-2 text-gray-600">
					{/*<div dangerouslySetInnerHTML={{ __html: elem.content }} />*/}
				</div>
				<div className="col-3">
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
