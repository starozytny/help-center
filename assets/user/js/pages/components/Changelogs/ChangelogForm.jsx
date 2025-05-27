import React, { Component } from 'react';

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Input } from "@tailwindComponents/Elements/Fields";
import { Button } from "@tailwindComponents/Elements/Button";
import { TinyMCE } from "@tailwindComponents/Elements/TinyMCE";

const URL_INDEX_ELEMENTS = "user_help_changelogs_index";
const URL_CREATE_ELEMENT = "intern_api_help_changelogs_create";
const URL_UPDATE_GROUP = "intern_api_help_changelogs_update";

export function ChangelogFormulaire ({ context, element, productSlug }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_GROUP, { id: element.id });
	}

	return <Form
        context={context}
        url={url}

        numVersion={element ? Formulaire.setValue(element.numVersion) : ""}
        name={element ? Formulaire.setValue(element.name) : ""}
        dateAt={element ? Formulaire.setValueDate(element.dateAt) : new Date()}
		contentCreated={element ? Formulaire.setValue(element.contentCreated) : ""}
		contentUpdated={element ? Formulaire.setValue(element.contentUpdated) : ""}
		contentFix={element ? Formulaire.setValue(element.contentFix) : ""}

		productSlug={productSlug}
    />;
}

class Form extends Component {
	constructor (props) {
		super(props);

		let contentCreated = props.contentCreated ? props.contentCreated : "";
		let contentUpdated = props.contentUpdated ? props.contentUpdated : "";
		let contentFix = props.contentFix ? props.contentFix : "";

		this.state = {
			numVersion: props.numVersion,
			name: props.name,
			dateAt: props.dateAt,
			contentCreated: { value: contentCreated, html: contentCreated },
			contentUpdated: { value: contentUpdated, html: contentUpdated },
			contentFix: { value: contentFix, html: contentFix },
			errors: []
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
		const { numVersion, name, dateAt } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'numVersion', value: numVersion },
			{ type: "text", id: 'name', value: name },
			{ type: "text", id: 'dateAt', value: dateAt },
		];

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			let self = this;
			Formulaire.loader(true);
			axios({ method: context === "update" ? "PUT" : "POST", url: url, data: this.state })
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
        const { context } = this.props;
		const { errors, numVersion, name, dateAt, contentCreated, contentUpdated, contentFix } = this.state;

        let params0 = { errors: errors, onChange: this.handleChange };
        let params1 = { errors: errors, onUpdateData: this.handleChangeTinyMCE };

        return <form onSubmit={this.handleSubmit}>
            <div className="flex flex-col gap-4 xl:gap-6">
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Identification</div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						<div>
							<Input identifiant="name" valeur={name} {...params0}>Intitulé</Input>
						</div>
						<div className="flex gap-4">
							<div className="w-full">
								<Input identifiant="numVersion" valeur={numVersion} {...params0}>Numéro de version</Input>
							</div>
							<div className="w-full">
								<Input type="date" identifiant="dateAt" valeur={dateAt} {...params0}>Date</Input>
							</div>
						</div>
                    </div>
                </div>
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Contenu</div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						<div>
							<TinyMCE type={0} identifiant='contentCreated' valeur={contentCreated.value}{...params1}>
								Ajouts
							</TinyMCE>
						</div>
						<div>
							<TinyMCE type={0} identifiant='contentUpdated' valeur={contentUpdated.value}{...params1}>
								Modifications
							</TinyMCE>
						</div>
						<div>
							<TinyMCE type={0} identifiant='contentFix' valeur={contentFix.value}{...params1}>
								Correctifs
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
