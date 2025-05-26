import React, { Component } from "react";

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { ChangelogsList } from "@userPages/Changelogs/ChangelogsList";

import { Search } from "@tailwindComponents/Elements/Search";
import { ModalDelete } from "@tailwindComponents/Shortcut/Modal";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_GET_DATA = "intern_api_help_changelogs_list";
const URL_DELETE_ELEMENT = "intern_api_help_changelogs_delete";

const SESSION_PERPAGE = "help.user.perpage.changelogs";

export class Changelogs extends Component {
	constructor (props) {
		super(props);

		this.state = {
			perPage: List.getSessionPerpage(SESSION_PERPAGE, 20),
			currentPage: 0,
			sorter: Sort.compareCreatedAtInverse,
			loadingData: true,
			element: null,
		}

		this.pagination = React.createRef();
		this.delete = React.createRef();
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
		List.search(this, 'changelog', search, dataImmuable, perPage, sorter, true)
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
		this.delete.current.handleClick();
		this.setState({ element: elem })
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
				</>
			}
		</>
	}
}
