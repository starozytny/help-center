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
        numero={element ? Formulaire.setValue(element.numero) : ""}
        numVersion={element ? Formulaire.setValue(element.numVersion) : ""}
        isPatch={element ? element.isPatch : false}
        name={element ? Formulaire.setValue(element.name) : ""}
        dateAt={element ? Formulaire.setValueDate(element.dateAt) : moment().format("YYYY-MM-DD")}
		contentCreated={element ? Formulaire.setValue(element.contentCreated) : ""}
		contentUpdated={element ? Formulaire.setValue(element.contentUpdated) : ""}
		contentFix={element ? Formulaire.setValue(element.contentFix) : ""}
		contentNew={element ? Formulaire.setValue(element.contentNew) : ""}
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
		let contentNew = props.contentNew ? props.contentNew : "";

		this.state = {
			id: props.id,
			uid: props.uid,
			numero: props.numero,
			numVersion: props.numVersion,
			isPatch: props.isPatch ? [1] : [0],
			name: props.name,
			dateAt: props.dateAt,
			contentCreated: { value: contentCreated, html: contentCreated },
			contentUpdated: { value: contentUpdated, html: contentUpdated },
			contentFix: { value: contentFix, html: contentFix },
			contentNew: { value: contentNew, html: contentNew },
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
			this.intervalId = setInterval(this.handleSave, 2 * 60 * 1000); // toutes les 5 minutes
		}, 30000);
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
		const { loadSave, numVersion, name, dateAt } = this.state;

		if(loadSave){
			Toastr.toast('warning', 'Veuillez re-cliquez sur enregistrer, une sauvegarde était en cours.');
		}else{
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
	}

	render () {
        const { context } = this.props;
		const { errors, numero, numVersion, isPatch, name, dateAt, contentCreated, contentUpdated, contentFix, contentNew } = this.state;

        let params0 = { errors: errors, onChange: this.handleChange };
        let params1 = { errors: errors, onUpdateData: this.handleChangeTinyMCE };

		let patchItems = [{ value: 1, label: "Oui", identifiant: "oui-patch" }];

        return <form onSubmit={this.handleSubmit}>
            <div className="flex flex-col gap-4 xl:gap-6">
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Identification</div>
						<div className="text-gray-600 text-sm">
							<p>
								La date n'apparait pas dans le fichier HTML.
								<br/>
								Activer <i>Est-ce un patch ?</i>, permet d'avoir la mention [PATCH] dans le titre afin de le distinguer.
								<br/><br/>
								<u>Recommandation</u> : Suivre le même pattern de version + patch afin d'avoir une chronologie cohérente.
								<br/>
								(exemple : 3000.0.0.1P001)

							</p>
						</div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						{context === "update"
							? <div className="w-full">
								<Input identifiant="numero" valeur={numero} {...params0}>
									Numéro
									<br/>
									<span className="text-yellow-600">En cas de changement, le compteur automatique ne sera pas affecté.</span>
								</Input>
							</div>
							: null
						}
						<div className="flex gap-4">
							<div className="w-full">
								<Input identifiant="name" valeur={name} {...params0}>Titre</Input>
							</div>
							<div className="w-full">
								<Input type="date" identifiant="dateAt" valeur={dateAt} {...params0}>Date</Input>
							</div>
						</div>
						<div className="flex gap-4">
							<div className="w-full">
								<Input identifiant="numVersion" valeur={numVersion} {...params0} placeholder="ex: 3000.0.0.1P001">Numéro de version + patch</Input>
							</div>
							<div className="w-full">
								<Switcher items={patchItems} identifiant="isPatch" valeur={isPatch} {...params0}>
									Est-ce un patch ?
								</Switcher>
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
							<TinyMCE type={99} identifiant='contentCreated' valeur={contentCreated.value} {...params1}>
								Nouveautés
							</TinyMCE>
						</div>
						<div>
							<TinyMCE type={99} identifiant='contentUpdated' valeur={contentUpdated.value} {...params1}>
								Améliorations
							</TinyMCE>
						</div>
						<div>
							<TinyMCE type={99} identifiant='contentFix' valeur={contentFix.value} {...params1}>
								Correctifs
							</TinyMCE>
						</div>
						<div>
							<TinyMCE type={99} identifiant='contentNew' valeur={contentNew.value} {...params1}>
								Actualités
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
