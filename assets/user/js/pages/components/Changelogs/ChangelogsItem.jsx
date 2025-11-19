import React, { useRef } from "react";
import PropTypes from 'prop-types';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sanitaze from "@commonFunctions/sanitaze";

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { ButtonIcon, ButtonIconA, ButtonIconDropdown, DropdownItem, DropdownItemA } from "@tailwindComponents/Elements/Button";

const URL_UPDATE_PAGE = "user_help_changelogs_update";
const URL_PREVIEW_FILE = "user_help_changelogs_preview_html";

export function ChangelogsItem ({ elem, highlight, onModal, productSlug }) {
	const refItem = useRef(null);

	let nHighlight = useHighlight(highlight, elem.id, refItem);

	let urlUpdate = Routing.generate(URL_UPDATE_PAGE, { p_slug: productSlug, id: elem.id });

	let menu = [
		{ data: <DropdownItem icon="copy" onClick={() => onModal("duplicate", elem)}>
				Dupliquer
			</DropdownItem> },
		{ data: <DropdownItemA icon="pencil" onClick={urlUpdate}>
				Modifier
			</DropdownItemA> },
		{ data: <DropdownItem icon="trash" onClick={() => onModal("delete", elem)}>
				Supprimer
			</DropdownItem> },
	]

	return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
		<div className="item-content">
			<div className="item-infos">
				<div className="col-1">
					<div className="font-bold">{elem.numero}</div>
				</div>
				<div className="col-2">
					<Badge type={elem.isDraft ? "gray" : "blue"} classnames="rounded-full">{elem.numVersion}</Badge>
				</div>
				<div className="col-3">
					<div className="font-medium">{elem.name}</div>
				</div>
				<div className="col-4">
					<div className="text-gray-600 text-sm">{Sanitaze.toDateFormat(elem.dateAt, 'll')}</div>
				</div>
				<div className="col-5">
					{elem.isPatch ? <Badge type="yellow">Patch</Badge> : <Badge type="green">Majeure</Badge>}
				</div>
				<div className="col-6 actions">
					<ButtonIconA type="default" icon="vision" target="_blank"
								 onClick={Routing.generate(URL_PREVIEW_FILE, {p_slug: productSlug, id: elem.id})}>
						Aperçu
					</ButtonIconA>
					<ButtonIconDropdown icon="more" items={menu} />
				</div>
			</div>
		</div>
	</div>
}

ChangelogsItem.propTypes = {
	elem: PropTypes.object.isRequired,
	onModal: PropTypes.func.isRequired,
}
