import React, { Component } from "react";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";
import Validateur from "@commonFunctions/validateur";
import Formulaire from "@commonFunctions/formulaire";

import { ChangelogsList } from "@userPages/Changelogs/ChangelogsList";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Input } from "@tailwindComponents/Elements/Fields";
import { Search } from "@tailwindComponents/Elements/Search";
import { Button } from "@tailwindComponents/Elements/Button";
import { ModalDelete } from "@tailwindComponents/Shortcut/Modal";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_INDEX_ELEMENTS = "user_help_changelogs_index";
const URL_GET_DATA = "intern_api_help_changelogs_list";
const URL_DELETE_ELEMENT = "intern_api_help_changelogs_delete";
const URL_DUPLICATE_ELEMENT = "intern_api_help_changelogs_duplicate";

const SESSION_PERPAGE = "help.user.perpage.changelogs";

export class Changelogs extends Component {
	constructor (props) {
		super(props);

		this.state = {
			perPage: List.getSessionPerpage(SESSION_PERPAGE, 20),
			currentPage: 0,
			sorter: Sort.compareNumeroInverseThenDateAtInverse,
			loadingData: true,
			element: null,
			numVersion: "",
			errors: []
		}

		this.pagination = React.createRef();
		this.delete = React.createRef();
		this.duplicate = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { productId, highlight } = this.props;
		const { perPage, sorter } = this.state;
		List.getData(this, Routing.generate(URL_GET_DATA, { productId: productId }), perPage, sorter, highlight);
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
		this.setState({ element: elem, numVersion: Formulaire.setValue(elem.numVersion) });
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
	}

	handleDuplicate = () => {
		const { productSlug } = this.props;
		const { element, numVersion } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'numVersion', value: numVersion },
		];

		let validate = Validateur.validateur(paramsToValidate);

		if(numVersion === element.numVersion){
			validate.code = false;
			validate.errors.push({
				name: "numVersion",
				message: "Veuillez changer de numéro de version."
			})
		}

		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			let self = this;
			Formulaire.loader(true);
			axios({ method: "POST", url: Routing.generate(URL_DUPLICATE_ELEMENT, { id: element.id }), data: {numVersion: numVersion} })
				.then(function (response) {
					location.href = Routing.generate(URL_INDEX_ELEMENTS, { p_slug: productSlug, h: response.data.id });
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { highlight, productSlug } = this.props;
		const { data, currentData, element, loadingData, perPage, currentPage, errors, numVersion } = this.state;

		let params0 = { errors: errors, onChange: this.handleChange };

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


					<Modal ref={this.duplicate} identifiant="duplicate" maxWidth={414}
						   title={element ? "Duplication de :" + element.numVersion : ""}
						   content={element
							   ? <div>
								   <p>
									   Êtes-vous sûr de vouloir supprimer définitivement ce changelog : <b>{element ? element.numVersion : ""}</b> ?
								   </p>
								   <div className="mt-2">
									   <Input identifiant="numVersion" valeur={numVersion} {...params0} placeholder="ex: 3000_0_0_1P001">
										   Numéro de version
									   </Input>
								   </div>
							   </div>
							   : <LoaderElements />
					       }
						   footer={<Button type="blue" onClick={this.handleDuplicate}>Dupliquer</Button>}
					/>
				</>
			}
		</>
	}
}
