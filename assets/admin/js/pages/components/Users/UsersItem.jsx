import React, { useRef } from "react";
import PropTypes from 'prop-types';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import moment from "moment";
import 'moment/locale/fr';

import Toastr from "@tailwindFunctions/toastr";

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { ButtonIcon, ButtonIconA, ButtonIconDropdown } from "@tailwindComponents/Elements/Button";
import { Badge } from "@tailwindComponents/Elements/Badge";

const URL_UPDATE_PAGE = "admin_users_update";
const URL_READ_PAGE = "admin_users_read";
const URL_PASSWORD_PAGE = "admin_users_password";

export function UsersItem ({ elem, highlight, onModal }) {
	const refItem = useRef(null);

	let nHighlight = useHighlight(highlight, elem.id, refItem);

	const handleCopyToken = () => {
		navigator.clipboard.writeText(elem.token);
		Toastr.toast('info', 'Token de ' + elem.username + ' copié dans le presse papier.')
	}

	let urlUpdate = Routing.generate(URL_UPDATE_PAGE, { 'id': elem.id });
	let urlRead = Routing.generate(URL_READ_PAGE, { 'id': elem.id });
	let urlPass = Routing.generate(URL_PASSWORD_PAGE, { 'id': elem.id });

	let lastLoginAt = elem.lastLoginAt ? moment(elem.lastLoginAt) : null;

	let styleItemDropdown = "w-full inline-block px-2 py-1.5 cursor-pointer hover:bg-gray-100";

	let menu = [
		{
			data: <a className={styleItemDropdown} onClick={() => onModal("reinit", elem)}>
				<span className="icon-refresh" />
				<span className="pl-1">Générer un nouveau mot de passe</span>
			</a>
		},
		{
			data: <a className={styleItemDropdown} href={urlPass}>
				<span className="icon-lock-1" />
				<span className="pl-1">Modifier son mot de passe</span>
			</a>
		},
		{
			data: <a className={styleItemDropdown} onClick={() => onModal("mail", elem)}>
				<span className="icon-email-edit" />
				<span className="pl-1">Envoyer un mail</span>
			</a>
		},
		{
			data: <a className={styleItemDropdown} onClick={() => onModal("blocked", elem)}>
				<span className={"icon-" + (elem.blocked ? "unlock" : "disabled")} />
				<span className="pl-1">{elem.blocked ? "Débloquer" : "Bloquer"}</span>
			</a>
		}
	]

	return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
		<div className="item-content">
			<div className="item-infos">
				<div className="col-1 flex flex-row gap-4">
					<a href={urlRead} className="w-16 h-16 rounded-md overflow-hidden">
						{elem.avatarFile
							? <img src={elem.avatarFile} alt="avatar" className="w-full h-full object-cover" />
							: <div className="h-full w-full rounded-md bg-gray-300 flex items-center justify-center font-semibold">
								{elem.lastname.slice(0, 1) + elem.firstname.slice(0, 1)}
							</div>
						}
					</a>
					<div className="leading-4">
						<div className={"font-medium mb-1" + (elem.blocked ? " blocked" : "")}>
							<span>{elem.lastname} {elem.firstname}</span>
							{elem.blocked ? <span className="icon-disabled" title="Bloqué" /> : null}
						</div>
						<div className="text-gray-600 text-sm">{elem.society.code} - {elem.society.name}</div>
						<div className="text-gray-600 text-sm cursor-pointer" onClick={handleCopyToken}>
							<span>Copier le Token</span> <span className="icon-copy text-blue-500" />
						</div>
						<div className="text-gray-600 text-sm mt-1">{lastLoginAt ? "connecté " + lastLoginAt.fromNow() : ""}</div>
					</div>
				</div>
				<div className="col-2 leading-5">
					<div className={elem.blocked ? "blocked" : ""}>{elem.username}</div>
					<div className="text-gray-600 text-sm">{elem.email}</div>
				</div>
				<div className="col-3">
					<Badge type={elem.blocked ? "red" : getBadgeType(elem.highRoleCode)}>
						{elem.highRole} {elem.blocked ? <span className="icon-disabled pl-1" title="Bloqué" /> : ""}
					</Badge>
				</div>
				<div className="col-4 actions">
					<ButtonIconA type="default" icon="pencil" onClick={urlUpdate}>Modifier</ButtonIconA>
					<ButtonIcon type="default" icon="trash" onClick={() => onModal("delete", elem)}>Supprimer</ButtonIcon>
					<ButtonIconDropdown icon="more" items={menu} />
				</div>
			</div>
		</div>
	</div>
}

UsersItem.propTypes = {
	elem: PropTypes.object.isRequired,
	onModal: PropTypes.func.isRequired,
	highlight: PropTypes.number,
}

function getBadgeType (type) {
	const badges = ["gray", "indigo", "blue", "yellow"];
	return badges[type];
}
