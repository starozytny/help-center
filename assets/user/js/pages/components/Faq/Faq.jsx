import React, { Component } from "react";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { LoaderElements } from "@tailwindComponents/Elements/Loader";

import { FaqList } from "@userPages/Faq/FaqList";

const URL_GET_DATA = "intern_api_help_faq_list";

export class Faq extends Component {
	constructor (props) {
		super(props);

		this.state = {
			loadingData: true,
		}
	}

	componentDidMount = () => {
		const { productId } = this.props;

		let self = this;
		axios({ method: "GET", url: Routing.generate(URL_GET_DATA, { id: productId }), data: {} })
			.then(function (response) {
				let data = response.data;

				let categories = JSON.parse(data.categories);
				let questions = JSON.parse(data.questions);

				self.setState({ categories: categories, questions: questions, loadingData: false })
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
			})
		;
	}

	render () {
		const { role, category, productSlug } = this.props;
		const { loadingData, categories, questions } = this.state;

		return loadingData
			? <LoaderElements />
			: <FaqList role={role} productSlug={productSlug} categories={categories} questions={questions}
					   defaultCategory={category ? parseInt(category) : null} />
	}
}
