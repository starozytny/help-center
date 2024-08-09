import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, InputIcon, Radiobox } from "@tailwindComponents/Elements/Fields";
import { Button } from "@tailwindComponents/Elements/Button";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";

import Inputs from "@commonFunctions/inputs";
import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

const URL_INDEX_ELEMENTS = "user_help_product_read";
const URL_CREATE_ELEMENT = "intern_api_help_faq_categories_create";
const URL_UPDATE_GROUP = "intern_api_help_faq_categories_update";

export function CategoryFormulaire ({ context, element, productSlug }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_GROUP, { id: element.id });
	}

	let form = <Form
		context={context}
		url={url}
		productSlug={productSlug}
		id={element ? element.id : ""}
		name={element ? Formulaire.setValue(element.name) : ""}
		icon={element ? Formulaire.setValue(element.icon) : ""}
		subtitle={element ? Formulaire.setValue(element.subtitle) : ""}
		visibility={element ? Formulaire.setValue(element.visibility) : 0}
	/>

	return <div className="formulaire">{form}</div>;
}

CategoryFormulaire.propTypes = {
	context: PropTypes.string.isRequired,
	productSlug: PropTypes.string.isRequired,
	element: PropTypes.object,
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			productSlug: props.productSlug,
			name: props.name,
			icon: props.icon,
			subtitle: props.subtitle,
			visibility: props.visibility,
			rank: 0,
			errors: [],
			icons: [],
			loadIcons: true,
		}
	}

	componentDidMount = () => {
		Inputs.getIcons(this);
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
	}

    handleClickIcon = (icon) => { this.setState({ icon }) }

	handleSubmit = (e) => {
		e.preventDefault();

		const { context, url, productSlug } = this.props;
		const { name, icon, subtitle } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'name', value: name },
			{ type: "text", id: 'icon', value: icon },
			{ type: "text", id: 'subtitle', value: subtitle },
		];

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			Formulaire.loader(true);
			let self = this;

			axios({ method: context === "update" ? "PUT" : "POST", url: url, data: this.state })
				.then(function (response) {
					location.href = Routing.generate(URL_INDEX_ELEMENTS, { slug: productSlug, cat: response.data.id });
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { context } = this.props;
		const { errors, loadIcons, name, icon, subtitle, visibility, icons } = this.state;

		let visibilityItems = [
			{ value: 0, label: 'Pour tous', identifiant: 'type-0' },
			{ value: 1, label: 'Pour administration', identifiant: 'type-1' },
		]

		let params = { errors: errors, onChange: this.handleChange }
        let params1 = { errors: errors, onChange: this.handleClickIcon }

		let error;
		if (errors && errors.length !== 0) {
			errors.map(err => {
				if (err.name === "icon") {
					error = err.message
				}
			})
		}

        return <form onSubmit={this.handleSubmit}>
            <div className="flex flex-col gap-4 xl:gap-6">
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Visibilité</div>
                        <div className="text-gray-600 text-sm">
                            Définissez le niveau de visibilité de la catégorie
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
                        <Radiobox items={visibilityItems} identifiant="visibility" valeur={visibility} {...params}>
                            Visibilité *
                        </Radiobox>
                    </div>
                </div>
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Catégorie</div>
                        <div className="text-gray-600 text-sm">
                            Définissez le niveau de visibilité de la catégorie
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Input identifiant="name" valeur={name} {...params}>Intitulé *</Input>
                            </div>
                            <div className="w-full">
                                <Input identifiant="subtitle" valeur={subtitle} {...params}>Sous titre *</Input>
                            </div>
                        </div>
                        {loadIcons
                            ? <LoaderElements />
                            : <div>
                                <InputIcon identifiant="icon" valeur={icon} icons={icons} {...params1}>Icône *</InputIcon>
                            </div>
                        }
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
	context: PropTypes.string.isRequired,
	url: PropTypes.node.isRequired,
	productSlug: PropTypes.string.isRequired,
	id: PropTypes.node.isRequired,
	name: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	visibility: PropTypes.number.isRequired,
}
