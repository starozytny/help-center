import React, { Component } from 'react';

import axios from "axios";
import { uid } from "uid";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import moment from "moment";
import "moment/locale/fr";

import Toastr from "@tailwindFunctions/toastr";
import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Input, Switcher } from "@tailwindComponents/Elements/Fields";
import { Button } from "@tailwindComponents/Elements/Button";
import { TinyMCE } from "@tailwindComponents/Elements/TinyMCE";

const URL_INDEX_ELEMENTS = "user_help_changelogs_index";
const URL_CREATE_ELEMENT = "intern_api_help_changelogs_create";
const URL_UPDATE_ELEMENT = "intern_api_help_changelogs_update";
const URL_SAVE_ELEMENT = "intern_api_help_changelogs_save";

export function ChangelogFormulaire ({ context, element, productSlug }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });
	}

	return <Form
        context={context}
        url={url}

        id={element ? Formulaire.setValue(element.id) : null}
        uid={element ? Formulaire.setValue(element.uid) : uid()}
        numVersion={element ? Formulaire.setValue(element.numVersion) : ""}
        numPatch={element ? Formulaire.setValue(element.numPatch) : ""}
        isPatch={element ? element.isPatch : false}
        name={element ? Formulaire.setValue(element.name) : ""}
        dateAt={element ? Formulaire.setValueDate(element.dateAt) : moment().format("YYYY-MM-DD")}
		contentCreated={element ? Formulaire.setValue(element.contentCreated) : ""}
		contentUpdated={element ? Formulaire.setValue(element.contentUpdated) : ""}
		contentFix={element ? Formulaire.setValue(element.contentFix) : ""}
		isDraft={element ? element.isDraft : true}

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
			id: props.id,
			uid: props.uid,
			numVersion: props.numVersion,
			numPatch: props.numPatch,
			isPatch: props.isPatch ? [1] : [0],
			name: props.name,
			dateAt: props.dateAt,
			contentCreated: { value: contentCreated, html: contentCreated },
			contentUpdated: { value: contentUpdated, html: contentUpdated },
			contentFix: { value: contentFix, html: contentFix },
			isDraft: props.isDraft,
			errors: [],
			productSlug: props.productSlug,
			loadSave: false
		}

		this.intervalId = null;
	}

	componentDidMount () {
		setTimeout(() => {
			this.handleSave()
			this.intervalId = setInterval(this.handleSave, 5000); // toutes les 5 minutes
		}, 5000);
	}

	componentWillUnmount () {
		clearInterval(this.intervalId);
	}

	handleSave = () => {
		const { name, numVersion } = this.state;

		if (document.visibilityState === 'visible' && name !== "" && numVersion !== "") {
			this.setState({ loadSave: true })

			let self = this;
			axios({ method: "POST", url: Routing.generate(URL_SAVE_ELEMENT), data: this.state })
				.then(function (response) {
					self.setState({ id: response.data.id, uid: response.data.uid })
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
				})
				.then(function () {
					self.setState({ loadSave: false })
				})
			;
		}
	}

	handleChange = (e) => {
		let name = e.currentTarget.name;
		let value = e.currentTarget.value;

		if (name === "isPatch") {
			value = e.currentTarget.checked ? [parseInt(value)] : [0];
		}

		this.setState({ [name]: value })
	}

    handleChangeTinyMCE = (name, html) => {
        this.setState({ [name]: { value: this.state[name].value, html: html } })
    }

	handleSubmit = (e) => {
		e.preventDefault();

		const { context, url, productSlug } = this.props;
		const { loadSave, numVersion, name, dateAt, isPatch, numPatch } = this.state;

		if(loadSave){
			Toastr.toast('warning', 'Veuillez re-cliquez sur enregistrer, une sauvegarde était en cours.');
		}else{
			this.setState({ errors: [] });

			let paramsToValidate = [
				{ type: "text", id: 'numVersion', value: numVersion },
				{ type: "text", id: 'name', value: name },
				{ type: "text", id: 'dateAt', value: dateAt },
			];

			if(isPatch[0] === 1){
				paramsToValidate = [...paramsToValidate, ...[{ type: "text", id: 'numPatch', value: numPatch }]];
			}

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
	}

	render () {
        const { context } = this.props;
		const { errors, numVersion, isPatch, numPatch,  name, dateAt, contentCreated, contentUpdated, contentFix } = this.state;

        let params0 = { errors: errors, onChange: this.handleChange };
        let params1 = { errors: errors, onUpdateData: this.handleChangeTinyMCE };

		let patchItems = [{ value: 1, label: "Oui", identifiant: "oui-patch" }];

        return <form onSubmit={this.handleSubmit}>
            <div className="flex flex-col gap-4 xl:gap-6">
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Identification</div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						<div className="flex gap-4">
							<div className="w-full">
								<Input type="date" identifiant="dateAt" valeur={dateAt} {...params0}>Date</Input>
							</div>
							<div className="w-full">
								<Input identifiant="name" valeur={name} {...params0}>Titre</Input>
							</div>
						</div>
						<div className="flex gap-4">
							<div className="w-full">
								<Input identifiant="numVersion" valeur={numVersion} {...params0}>Numéro de version</Input>
							</div>
							<div className="w-full">
								<Switcher items={patchItems} identifiant="isPatch" valeur={isPatch} {...params0}>
									Est-ce un patch ?
								</Switcher>
							</div>
						</div>
						{isPatch[0] === 1
							? <div className="flex gap-4">
								<div className="w-full">
									<Input identifiant="numPatch" valeur={numPatch} {...params0}>Numéro de patch</Input>
								</div>
								<div className="w-full"></div>
							</div>
							: null
						}
                    </div>
                </div>
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Contenu</div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						<div>
							<TinyMCE type={99} identifiant='contentCreated' valeur={contentCreated.value} {...params1}>
								Ajouts
							</TinyMCE>
						</div>
						<div>
							<TinyMCE type={99} identifiant='contentUpdated' valeur={contentUpdated.value} {...params1}>
								Modifications
							</TinyMCE>
						</div>
						<div>
							<TinyMCE type={99} identifiant='contentFix' valeur={contentFix.value} {...params1}>
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
