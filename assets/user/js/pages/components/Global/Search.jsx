import React, { Component } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import SearchFunction from "@commonFunctions/search";

import { Input } from "@tailwindComponents/Elements/Fields";
import { Modal } from "@tailwindComponents/Elements/Modal";

const URL_GET_DATA = "intern_api_help_products_data_search";
const URL_PAGE_DOC = "user_help_documentation_read";
const URL_PAGE_GUIDE = "user_help_tutorial_read";
const URL_PAGE_QUESTION = "user_help_question_read";

export class Search extends Component {
	constructor (props) {
		super(props);

		this.state = {
			globalSearch: "",
			errors: [],
			init: false,
			data: [],
			dataImmuable: [],
		}

		this.modal = React.createRef();
	}

	handleChange = (e) => {
		const { dataImmuable } = this.state;

		let value = e.currentTarget.value;

		let newData = SearchFunction.search('global-search', dataImmuable, value);

		this.setState({ [e.currentTarget.name]: value, data: newData.slice(0, 8) })
	}

	handleModal = () => {
		const { id } = this.props;
		const { init } = this.state;

		if(!init){
			let self = this;
			Formulaire.loader(true);
			axios({ method: "POST", url: Routing.generate(URL_GET_DATA, {id: id}), data: this.state })
				.then(function (response) {
					let documentations = JSON.parse(response.data.documentations)
					let guides = JSON.parse(response.data.guides)
					let questions = JSON.parse(response.data.questions)

					let dataImmuable = [...documentations, ...guides, ...questions]

					self.setState({ init: true, dataImmuable: dataImmuable, data: dataImmuable.slice(0, 8) })
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
				})
				.then(function () {
					Formulaire.loader(false);
				})
			;
		}

		this.modal.current.handleClick();
		let inputFocus = document.getElementById('globalSearch');
		if(inputFocus){
			inputFocus.focus();
		}
	}

	handlePage = (elem) => {
		const { pSlug } = this.props;

		if(elem.searchType === "documentation"){
			location.href = Routing.generate(URL_PAGE_DOC, {p_slug: pSlug, slug: elem.slug})
		}else if(elem.searchType === "guide"){
			location.href = Routing.generate(URL_PAGE_GUIDE, {p_slug: pSlug, slug: elem.slug})
		}else{
			console.log(elem);
			location.href = Routing.generate(URL_PAGE_QUESTION, {slug: pSlug, category: elem.category.id, id: elem.id})
		}
	}

	render () {
		const { data, errors, globalSearch } = this.state;

		let params0 = { errors: errors, onChange: this.handleChange };

		return <>
			<div onClick={this.handleModal} className="block cursor-pointer bg-gray-50 hover:ring-gray-400 hover:bg-white rounded-md shadow-sm border-0 py-2 px-3 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500">
				<span className="icon-search"></span>
				<span className="pl-2">Rechercher un guide, documentation, réponse..</span>
			</div>

			{createPortal(<Modal ref={this.modal} identifiant="modal-global-search" maxWidth={768} margin={5}
								 title="Recherche"
								 content={<div>
									 <Input identifiant="globalSearch" valeur={globalSearch} {...params0} placeholder="Rechercher un guide, documentation, réponse.." />
									 <div className="mt-4 flex flex-col gap-2">
										 {data.map((elem, index) => {

											 let icon = "question-1";
											 if(elem.searchType === "documentation"){
												 icon = "book";
											 }else if(elem.searchType === "guide"){
												 icon = "book-1";
											 }

											 return <div className="group cursor-pointer p-4 bg-gray-100 rounded-md flex justify-between gap-2 hover:bg-blue-500 hover:text-white"
														 onClick={() => this.handlePage(elem)} key={index}>
												 <div className="flex items-center gap-2">
													 <div className="w-6 h-6 bg-gray-50 rounded-md border flex items-center justify-center group-hover:bg-blue-500 group-hover:border-white">
														 <span className={`icon-${icon}`}></span>
													 </div>
													 <span>{highlightText(elem.name, globalSearch)}</span>
												 </div>
												 <div>
													 <span className="icon-right-chevron"></span>
												 </div>
											 </div>
										 })}
									 </div>
								 </div>} footer={null} showClose={false} />
				, document.body)
			}
		</>
	}
}

function highlightText (text, highlight) {
	if (!highlight) return text;
	const regex = new RegExp(`(${highlight})`, "gi"); // Expression régulière insensible à la casse
	const parts = text.split(regex);
	return parts.map((part, index) =>
		part.toLowerCase() === highlight.toLowerCase()
			? (<span className="font-bold" key={index}>{part}</span>)
			: (part)
	);
}
