import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from "axios";
import toastr from "toastr";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Button } from "@tailwindComponents/Elements/Button";
import { TinyMCE } from "@tailwindComponents/Elements/TinyMCE";
import { Input, Radiobox, Switcher } from "@tailwindComponents/Elements/Fields";

const URL_INDEX_PAGE = "user_help_documentation_read";
const URL_UPDATE_PAGE = "user_help_documentation_update";
const URL_CREATE_ELEMENT = "intern_api_help_documentations_create";
const URL_UPDATE_ELEMENT = "intern_api_help_documentations_update";

export function DocumentationFormulaire ({ context, element, productSlug }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });
	}

	return <Form
        productSlug={productSlug}
        context={context}
        url={url}
        name={element ? Formulaire.setValue(element.name) : ""}
        status={element ? Formulaire.setValue(element.status) : 0}
        description={element ? Formulaire.setValue(element.description) : ""}
        content={element ? Formulaire.setValue(element.content) : ""}
        visibility={element ? Formulaire.setValue(element.visibility) : 0}
        isTwig={element ? Formulaire.setValue(element.isTwig ? 1 : 0) : 0}
		twigName={element ? Formulaire.setValue(element.twigName) : ""}
    />
}

DocumentationFormulaire.propTypes = {
	productSlug: PropTypes.string.isRequired,
	context: PropTypes.string.isRequired,
	element: PropTypes.object,
}

class Form extends Component {
	constructor (props) {
		super(props);

		let description = props.description ? props.description : "";
		let content = props.content ? props.content : "";

		this.state = {
			productSlug: props.productSlug,
			name: props.name,
			status: props.status,
			description: { value: description, html: description },
			content: { value: content, html: content },
			visibility: props.visibility,
			isTwig: [props.isTwig],
			twigName: props.twigName,
			errors: [],
		}
	}

	handleChange = (e) => {
		let name = e.currentTarget.name;
		let value = e.currentTarget.value;

		if (name === "isTwig") {
			value = e.currentTarget.checked ? [parseInt(value)] : [0];
		}

		this.setState({ [name]: value })
	}

	handleChangeTinyMCE = (name, html) => {
		this.setState({ [name]: { value: this.state[name].value, html: html } })
	}

	handleSubmit = (e, stay = false) => {
		e.preventDefault();

		const { context, url, productSlug } = this.props;
		const { name, status, description, content, isTwig, twigName } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'name', value: name },
			{ type: "text", id: 'status', value: status },
			{ type: "text", id: 'description', value: description.html },
			{ type: "text", id: 'content', value: content.html },
		];

		if (isTwig[0] === 1) {
			paramsToValidate = [...paramsToValidate, ...[{ type: "text", id: 'twigName', value: twigName }]];
		}

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			let self = this;
			Formulaire.loader(true);
			axios({ method: context === "update" ? "PUT" : "POST", url: url, data: this.state })
				.then(function (response) {
					if (!stay) {
						location.href = Routing.generate(URL_INDEX_PAGE, { p_slug: productSlug, slug: response.data.slug });
					} else {
						toastr.info('Données enregistrées.');

						if (context === "create") {
							location.href = Routing.generate(URL_UPDATE_PAGE, { p_slug: productSlug, slug: response.data.slug });
						} else {
							Formulaire.loader(false);
						}
					}
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
		const { errors, name, status, description, content, visibility, isTwig, twigName } = this.state;

		let params0 = { errors: errors, onChange: this.handleChange }

		let statusItems = [
			{ value: 0, label: 'Hors ligne', identifiant: 'type-0' },
			{ value: 1, label: 'En ligne', identifiant: 'type-1' },
		]

		let visibilityItems = [
			{ value: 0, label: 'Pour tous', identifiant: 'visi-0' },
			{ value: 1, label: 'Pour administration', identifiant: 'visi-1' },
		]

		let twigItems = [{ value: 1, label: "Oui", identifiant: "oui" }];

		return <form onSubmit={this.handleSubmit}>
            <div className="flex flex-col gap-4 xl:gap-6">
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Informations générales</div>
                        <div className="text-gray-600 text-sm">
                            La description doit être très courte pour décrire rapidement à quoi sert cette documentation.
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Radiobox items={statusItems} identifiant="status" valeur={status} {...params0}>
                                    Statut *
                                </Radiobox>
                            </div>
                            <div class="w-full">
                                <Radiobox items={visibilityItems} identifiant="visibility" valeur={visibility} {...params0}>
                                    Visibilité *
                                </Radiobox>
                            </div>
                        </div>
                        <div>
                            <Input identifiant="name" valeur={name} {...params0}>Intitulé *</Input>
                        </div>
                        <div>
                            <TinyMCE type={3} identifiant='description' valeur={description.value}
                                     errors={errors} onUpdateData={this.handleChangeTinyMCE}>
                                Courte description
                            </TinyMCE>
                        </div>
                    </div>
                </div>
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Contenu</div>
                        <div className="text-gray-600 text-sm">
                            <span className="font-semibold">Contenu physique</span> correspond au fichier twig en physique alors que l'inverse
														  permet d'écrire le contenu directement via le site mais la
														  mise en page n'est pas forcément raccord.
							<br/><br/>
                            <span className="font-semibold">Nom du fichier twig</span> correspond nom du fichier dans /template/user/pages/documentations/products/[nom_produit]
							<br/>
							Nom sans l'extension .html.twig
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						<div>
							<Switcher items={twigItems} identifiant="isTwig" valeur={isTwig} {...params0}>
								Contenu physique
							</Switcher>
						</div>
						<div>
							{isTwig[0] === 1
								? <Input identifiant="twigName" valeur={twigName} {...params0}>Nom du fichier twig (sans extension)</Input>
								: <TinyMCE type={4} identifiant='content' valeur={content.value}
										   errors={errors} onUpdateData={this.handleChangeTinyMCE}>
									Description *
								</TinyMCE>
							}
						</div>
					</div>
				</div>
			</div>
			<div className="mt-4 flex justify-end gap-2">
				<Button isSubmit={true} type="blue"> {context === "create" ? "Enregistrer" : "Enregistrer les modifications"}</Button>
                <Button isSubmit={true} type="default" onClick={(e) => this.handleSubmit(e, true)}>Enregistrer et rester sur la page</Button>
            </div>
        </form>
	}
}

Form.propTypes = {
	productSlug: PropTypes.string.isRequired,
	context: PropTypes.string.isRequired,
	url: PropTypes.node.isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	status: PropTypes.number.isRequired,
}
