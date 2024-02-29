import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { SocietiesItem } from "@adminPages/Societies/SocietiesItem";

export function SocietiesList ({ data, highlight, settings, onModal }) {
	return <div className="list">
		<div className="list-table">
			<div className="items items-societies">
				<div className="item item-header">
					<div className="item-content">
						<div className="item-infos">
							<div className="col-1">Société</div>
							<div className="col-2">Manager</div>
							<div className="col-3">Activation</div>
							<div className="col-4 actions" />
						</div>
					</div>
				</div>

				{data.length > 0
					? data.map((elem) => {
						return <SocietiesItem key={elem.id} elem={elem} highlight={highlight} settings={settings} onModal={onModal} />;
					})
					: <Alert type="gray">Aucune donnée enregistrée.</Alert>
				}
			</div>
		</div>
	</div>
}

SocietiesList.propTypes = {
	data: PropTypes.array.isRequired,
	settings: PropTypes.object.isRequired,
	onModal: PropTypes.func.isRequired,
	highlight: PropTypes.number,
}
