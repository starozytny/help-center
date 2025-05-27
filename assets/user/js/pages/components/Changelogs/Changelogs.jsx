import React, { Component } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";
import Toastr from "@tailwindFunctions/toastr";
import Formulaire from "@commonFunctions/formulaire";

import { ChangelogsList } from "@userPages/Changelogs/ChangelogsList";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Button } from "@tailwindComponents/Elements/Button";
import { Search } from "@tailwindComponents/Elements/Search";
import { ModalDelete } from "@tailwindComponents/Shortcut/Modal";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_GET_DATA = "intern_api_help_changelogs_list";
const URL_DELETE_ELEMENT = "intern_api_help_changelogs_delete";
const URL_GENERATE_FILE = "intern_api_help_changelogs_generate_file";

const SESSION_PERPAGE = "help.user.perpage.changelogs";

export class Changelogs extends Component {
	constructor (props) {
		super(props);

		this.state = {
			perPage: List.getSessionPerpage(SESSION_PERPAGE, 20),
			currentPage: 0,
			sorter: Sort.compareDateAtInverse,
			loadingData: true,
			element: null,
		}

		this.pagination = React.createRef();
		this.delete = React.createRef();
		this.generate = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { perPage, sorter } = this.state;
		List.getData(this, Routing.generate(URL_GET_DATA), perPage, sorter, this.props.highlight);
	}

	handleUpdateData = (currentData) => {
		this.setState({ currentData })
	}

	handleSearch = (search) => {
		const { perPage, sorter, dataImmuable } = this.state;
		List.search(this, 'he_changelog', search, dataImmuable, perPage, sorter)
	}

	handleUpdateList = (element, context) => {
		const { data, dataImmuable, currentData, sorter } = this.state;
		List.updateListPagination(this, element, context, data, dataImmuable, currentData, sorter)
	}

	handlePaginationClick = (e) => {
		this.pagination.current.handleClick(e)
	}

	handleChangeCurrentPage = (currentPage) => {
		this.setState({ currentPage });
	}

	handlePerPage = (perPage) => {
		List.changePerPage(this, this.state.data, perPage, this.state.sorter, SESSION_PERPAGE);
	}

	handleModal = (identifiant, elem) => {
		this[identifiant].current.handleClick();

		if(identifiant === "generate"){
			modalGenerate(this, elem);
		}

		this.setState({ element: elem });
	}

	handleGenerate = () => {
		const { element } = this.state;

		let self = this;
		this.generate.current.handleUpdateFooter(<Button type="blue" iconLeft="chart-3" onClick={null}>{element.filename ? "Regénérer" : "Générer"}</Button>)
		axios({ method: "POST", url: Routing.generate(URL_GENERATE_FILE, {id: element.id}), data: {} })
			.then(function (response) {
				Toastr.toast('info', "Fichier généré.");
				self.generate.current.handleClose();
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
			})
			.then(function () {
				modalGenerate(self, elem);
			})
		;
	}

	render () {
		const { highlight, productSlug } = this.props;
		const { data, currentData, element, loadingData, perPage, currentPage } = this.state;

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2 flex flex-row">
						<Search onSearch={this.handleSearch} placeholder="Rechercher par intitulé.." />
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
										 onClick={this.handlePaginationClick}
										 onPerPage={this.handlePerPage} />

					<ChangelogsList data={currentData}
									productSlug={productSlug}
									highlight={parseInt(highlight)}
									onModal={this.handleModal} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />

					<ModalDelete refModal={this.delete} element={element} routeName={URL_DELETE_ELEMENT}
								 title="Supprimer ce changelog" msgSuccess="Changelog supprimé."
								 onUpdateList={this.handleUpdateList}>
						Êtes-vous sûr de vouloir supprimer définitivement ce changelog ?
					</ModalDelete>

					{createPortal(
						<Modal ref={this.generate} identifiant="generate" maxWidth={414}
							   title={element ? `${element.filename ? "Regénération" : `Génération du fichier de ${element.numero} - ${element.name}`}` : ""}
							   content={<div>Êtes-vous sûr de vouloir {element && element.filename ? "regénérer" : "générer"} le fichier de : {element ? element.name : ""} ?</div>}
							   footer={null} />,
						document.body
					)}
				</>
			}
		</>
	}
}

function modalGenerate (self, elem) {
	if(elem.filename){
		self.generate.current.handleUpdateFooter(<Button type="blue" onClick={self.handleGenerate}>Regénérer</Button>)
	}else{
		self.generate.current.handleUpdateFooter(<Button type="blue" onClick={self.handleGenerate}>Générer</Button>)
	}
}
