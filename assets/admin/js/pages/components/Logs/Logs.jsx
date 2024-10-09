import React, { Component } from "react";

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

import { LogsList } from "@adminPages/Logs/LogsList";

const URL_GET_DATA = "intern_api_logs_history_list";

const SESSION_PERPAGE = "project.perpage.users";

export class Logs extends Component {
	constructor (props) {
		super(props);

		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, 50),
			currentPage: 0,
			sorter: Sort.compareCreatedAtInverse,
			loadingData: true,
			element: null
		}

		this.pagination = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { perPage, sorter } = this.state;

		let url = this.props.urlGetData ? this.props.urlGetData : Routing.generate(URL_GET_DATA);
		List.getData(this, url, perPage, sorter);
	}

	handleUpdateData = (currentData) => {
		this.setState({ currentData })
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

	render () {
		const { users } = this.props;
		const { data, currentData, loadingData, perPage, currentPage } = this.state;

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
										 onClick={this.handlePaginationClick}
										 onPerPage={this.handlePerPage}  />

					<LogsList data={currentData} users={JSON.parse(users)} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />
				</>
			}
		</>
	}
}
