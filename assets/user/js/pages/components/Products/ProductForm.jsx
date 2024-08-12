import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, InputFile, Radiobox } from "@tailwindComponents/Elements/Fields";
import { TinyMCE } from "@tailwindComponents/Elements/TinyMCE";
import { Button } from "@tailwindComponents/Elements/Button";

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

const URL_INDEX_ELEMENTS = "user_help_product_read";
const URL_CREATE_ELEMENT = "intern_api_help_products_create";
const URL_UPDATE_ELEMENT = "intern_api_help_products_update";

export function ProductFormulaire ({ context, element }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });
	}

	return <Form
        context={context}
        url={url}
        type={element ? Formulaire.setValue(element.type) : 0}
        name={element ? Formulaire.setValue(element.name) : ""}
        website={element ? Formulaire.setValue(element.url) : ""}
        description={element ? Formulaire.setValue(element.description) : ""}
        logoFile={element ? Formulaire.setValue(element.logoFile) : ""}
        starter={element ? Formulaire.setValue(element.starter) : ""}
    />
}

ProductFormulaire.propTypes = {
	context: PropTypes.string.isRequired,
	element: PropTypes.object,
}

class Form extends Component {
	constructor (props) {
		super(props);

		let description = props.description ? props.description : "";

		this.state = {
			type: props.type,
			name: props.name,
			website: props.website,
			starter: props.starter,
			description: { value: description, html: description },
			errors: [],
		}

		this.file = React.createRef();
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
	}

	handleChangeTinyMCE = (name, html) => {
		this.setState({ [name]: { value: this.state[name].value, html: html } })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { url } = this.props;
		const { name, type, website, description } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'name', value: name },
			{ type: "text", id: 'type', value: type },
			{ type: "text", id: 'description', value: description.html },
		];

		if (parseInt(type) === 0) {
			paramsToValidate = [...paramsToValidate, ...[{ type: "text", id: 'website', value: website }]];
		}

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			Formulaire.loader(true);
			let self = this;

			let formData = new FormData();
			formData.append("data", JSON.stringify(this.state));

			let file = this.file.current;
			if (file.state.files.length > 0) {
				formData.append("logo", file.state.files[0]);
			}

			axios({ method: "POST", url: url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
				.then(function (response) {
					location.href = Routing.generate(URL_INDEX_ELEMENTS, { 'slug': response.data.slug });
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
        const { context, logoFile } = this.props;
        const { errors, name, type, website, starter, description } = this.state;

        let params = { errors: errors, onChange: this.handleChange };

        let typesItems = [
            { value: 0, label: 'Webservice', identifiant: 'type-0' },
            { value: 1, label: 'Windev', identifiant: 'type-1' },
        ]

        return <form onSubmit={this.handleSubmit}>
            <div className="flex flex-col gap-4 xl:gap-6">
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Informations générales</div>
                        <div className="text-gray-600 text-sm">
                            La description doit être très courte pour décrire rapidement à quoi sert cette documentation
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
                        <div>
                            <Radiobox items={typesItems} identifiant="type" valeur={type} {...params}>
                                Type de produit
                            </Radiobox>
                        </div>
                        <div>
                            <Input identifiant="name" valeur={name} {...params}>Intitulé *</Input>
                        </div>
                        {parseInt(type) === 0
                            ? <div>
                                <Input identifiant="website" valeur={website} placeholder="website.fr" {...params}>
                                    Site internet *
                                </Input>
                            </div>
                            : null
                        }
                        <div>
                            <TinyMCE type={5} identifiant='description' valeur={description.value}
                                     errors={errors} onUpdateData={this.handleChangeTinyMCE}>
                                Courte description *
                            </TinyMCE>
                        </div>
                        <div>
                            <Input identifiant="starter" valeur={starter} {...params} placeholder="https://pitch.com">Guide de démarrage</Input>
                        </div>
                        <div>
                            <InputFile ref={this.file} type="simple" identifiant="logo" valeur={logoFile}
                                       placeholder="Glissez et déposer le logo" {...params}>
                                Logo
                            </InputFile>
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
    context: PropTypes.string.isRequired,
    url: PropTypes.node.isRequired,
    type: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    logoFile: PropTypes.string.isRequired,
}
