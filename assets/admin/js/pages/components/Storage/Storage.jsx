import React, { Component, useState } from 'react';
import PropTypes from "prop-types";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Sanitaze from "@commonFunctions/sanitaze";

import { Alert } from "@tailwindComponents/Elements/Alert";
import { ButtonIcon } from "@tailwindComponents/Elements/Button";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";

const URL_CLICK_DIRECTORY = "intern_api_storage_directory";
const URL_DOWNLOAD_FILE = "intern_api_storage_download";

export class Storage extends Component {
	constructor (props) {
		super(props);

		this.state = {
			backs: [],
			directories: [],
			files: [],
			loadData: true,
			directory: ".."
		}
	}

	componentDidMount = () => {
		this.handleClick("", false, true);
	}

	handleClick = (path, isBack, force = false) => {
		const { loadData, backs } = this.state;

		if ((!loadData || force) && path !== undefined) {
			this.setState({ loadData: true })

			let nBacks = backs;
			if (isBack) {
				nBacks.pop();
			}

			let self = this;
			axios({ method: "POST", url: Routing.generate(URL_CLICK_DIRECTORY), data: { 'path': path } })
				.then(function (response) {
					let data = response.data;
					self.setState({
						directory: path === "" ? ".." : path.replace('/', ''),
						directories: JSON.parse(data.directories),
						files: JSON.parse(data.files),
						backs: isBack ? nBacks : [...backs, ...[path]],
						loadData: false
					})
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
				})
			;
		}
	}

	render () {
		const { loadData, backs, directories, files, directory } = this.state;

		let back = backs[backs.length - 2];

		return <div className="flex flex-col gap-4">
			<div>
				<div className="font-semibold text-lg">Dossiers</div>
				<div>
					<div className="flex gap-2 flex-wrap">
						{back !== undefined && <Directory elem={{ 'path': back, name: back === "" ? ".." : back }}
														  onClick={this.handleClick} isBack={true} />}
						{loadData
							? <LoaderElements />
							: (directories.map((dir, index) => {
								return <Directory elem={dir} onClick={this.handleClick} isBack={false} key={index} />
							}))
						}
					</div>
				</div>
			</div>

			<div>
				<div className="font-semibold text-lg">Fichiers de {directory}</div>
				<div>
					{loadData
						? <LoaderElements />
						: <div className="list-table bg-white rounded-md shadow">
							<div className="items items-files">
								<div className="item item-header uppercase text-sm text-gray-600">
									<div className="item-content">
										<div className="item-infos">
											<div className="col-1">Fichier</div>
											<div className="col-2">Taille</div>
											<div className="col-3">Infos</div>
											<div className="col-4 actions" />
										</div>
									</div>
								</div>

								{files.length > 0
									? files.map((elem, index) => {
										return <File elem={elem} directory={directory} deep={backs.length - 2} key={index} />;
									})
									: <Alert type="gray">Aucune donnée enregistrée.</Alert>
								}
							</div>
						</div>
					}
				</div>
			</div>
		</div>
	}
}

function Directory ({ elem, onClick, isBack }) {
	return <div className="cursor-pointer bg-gray-50 rounded-md min-w-36 min-h-28 p-4 flex flex-col justify-between gap-2 hover:bg-white"
				onClick={() => onClick(elem.path, isBack)}>
		<div>
			<span className="icon-folder" />
		</div>
		<div>
			<div className="font-semibold">{elem.name}</div>
		</div>
	</div>
}

Directory.propTypes = {
	elem: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired,
	isBack: PropTypes.bool.isRequired
}

function File ({ elem, directory, deep }) {
	let [loadData, setLoadData] = useState(false)
	let [icon, setIcon] = useState(elem.icon)

	let handleDownload = (e) => {
		e.preventDefault();
		let self = this;

		if (!loadData) {
			setLoadData(true);
			setIcon("chart-3");

			let tab = directory.split("/");
			let dir = tab[tab.length - 1];
			axios({ method: "GET", url: Routing.generate(URL_DOWNLOAD_FILE, { deep: deep, dir: dir === ".." ? "racine" : dir, filename: elem.name }), data: {} })
				.then(function (response) {
					const link = document.createElement('a');
					link.href = response.data.url;
					link.setAttribute('download', elem.name);
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

					setLoadData(false);
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
				})
				.then(function () {
					setIcon(elem.icon);
				})
			;
		}
	}

	return <div className="item border-t hover:bg-slate-50">
		<div className="item-content">
			<div className="item-infos">
				<div className="col-1">
					<div className="font-medium group" onClick={handleDownload}>
						<span className={`icon-${icon}`} />
						<span className="cursor-pointer inline-block pl-2 group-hover:underline">{elem.name}</span>
					</div>
				</div>
				<div className="col-2">
					<div className="text-gray-600 text-sm">{Sanitaze.toFormatBytesToSize(elem.size)}</div>
				</div>
				<div className="col-3">
					<div className="text-gray-600 text-sm">{Sanitaze.toDateFormat(new Date(elem.dateAt.date), 'L LT', "", false)}</div>
				</div>
				<div className="col-4 actions">
					<ButtonIcon type="default" icon={loadData ? icon : "download"} onClick={handleDownload}>Télécharger</ButtonIcon>
				</div>
			</div>
		</div>
	</div>
}

File.propTypes = {
	elem: PropTypes.object.isRequired,
	directory: PropTypes.string.isRequired,
	deep: PropTypes.number.isRequired
}
