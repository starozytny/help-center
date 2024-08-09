import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Button } from "@tailwindComponents/Elements/Button";
import { TinyMCE } from "@tailwindComponents/Elements/TinyMCE";
import { Input, InputView } from "@tailwindComponents/Elements/Fields";

const URL_INDEX_ELEMENTS = "user_help_product_read";
const URL_CREATE_ELEMENT = "intern_api_help_faq_questions_create";
const URL_UPDATE_GROUP = "intern_api_help_faq_questions_update";

export function QuestionFormulaire ({ context, element, category, productSlug }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_GROUP, { id: element.id });
	}

	return <Form
        context={context}
        url={url}
        category={category}
        productSlug={productSlug}
        name={element ? Formulaire.setValue(element.name) : ""}
        content={element ? Formulaire.setValue(element.content) : ""}
    />
}

QuestionFormulaire.propTypes = {
	productSlug: PropTypes.string.isRequired,
	context: PropTypes.string.isRequired,
	category: PropTypes.object.isRequired,
	element: PropTypes.object,
}

class Form extends Component {
	constructor (props) {
		super(props);

		let content = props.content ? props.content : ""

		this.state = {
			category: props.category.id,
			productSlug: props.productSlug,
			name: props.name,
			content: { value: content, html: content },
			errors: [],
		}
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
	}

	handleChangeTinyMCE = (name, html) => {
		this.setState({ [name]: { value: this.state[name].value, html: html } })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { context, url, productSlug } = this.props;
		const { name, content, category } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'name', value: name },
			{ type: "text", id: 'category', value: category },
			{ type: "text", id: 'content', value: content.html },
		];

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			Formulaire.loader(true);
			let self = this;

			axios({ method: context === "update" ? "PUT" : "POST", url: url, data: this.state })
				.then(function (response) {
					location.href = Routing.generate(URL_INDEX_ELEMENTS, { slug: productSlug, cat: category });
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { context, category } = this.props;
		const { errors, name, content } = this.state;

		let params = { errors: errors, onChange: this.handleChange }

        return <form onSubmit={this.handleSubmit}>
            <div className="flex flex-col gap-4 xl:gap-6">
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Question</div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
                        <div>
                            <InputView valeur={category.name} errors={errors}>Catégorie *</InputView>
                        </div>
                        <div>
                            <Input identifiant="name" valeur={name} {...params}>Intitulé *</Input>
                        </div>
                        <div>
                            <TinyMCE type={6} identifiant='content' valeur={content.value}
                                     errors={errors} onUpdateData={this.handleChangeTinyMCE}>
                                Description *
                            </TinyMCE>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <Button type="blue" isSubmit={true}>
                    {context === "create" ? "Enregistrer" : "Enregistrer les modifications"}
                </Button>
            </div>
        </form>
	}
}

Form.propTypes = {
	productSlug: PropTypes.string.isRequired,
	context: PropTypes.string.isRequired,
	url: PropTypes.node.isRequired,
	name: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	category: PropTypes.object.isRequired,
}
