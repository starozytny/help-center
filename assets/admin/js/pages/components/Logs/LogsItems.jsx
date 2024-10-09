import React from "react";
import PropTypes from 'prop-types';

import Sanitaze from "@commonFunctions/sanitaze";

export function LogsItems ({ elem, users }) {
	let username = elem.who;
	users.forEach(user => {
		if(user.token === elem.who){
			username = user.username;
		}
	})

	return <div className="item border-t hover:bg-slate-50">
		<div className="item-content">
			<div className="item-infos">
				<div className="col-1">
					<div className="font-medium break-all">
						<span>{username}</span>
					</div>
				</div>
				<div className="col-2">
					<div className="text-gray-600 text-sm">{elem.urlUsed}</div>
				</div>
				<div className="col-3">
					<div className="text-gray-600 text-sm">{Sanitaze.toFormatCalendar(elem.createdAt)}</div>
				</div>
			</div>
		</div>
	</div>
}

LogsItems.propTypes = {
	elem: PropTypes.object.isRequired
}
