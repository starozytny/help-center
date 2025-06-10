import React, { Component } from 'react';

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Toastr from "@tailwindFunctions/toastr";
import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Input } from "@tailwindComponents/Elements/Fields";
import { Button } from "@tailwindComponents/Elements/Button";

const URL_UPDATE_GROUP = "intern_api_help_products_changelogs_settings";

export function SettingsFormulaire ({ element }) {
	let url = Routing.generate(URL_UPDATE_GROUP, { id: element.id });

	return <Form
        url={url}

		numeroChangelogVersion={Formulaire.setValue(element.numeroChangelogVersion)}
		numeroChangelogPatch={Formulaire.setValue(element.numeroChangelogPatch)}
        folderChangelog={Formulaire.setValue(element.folderChangelog)}
    />;
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			numeroChangelogVersion: props.numeroChangelogVersion,
			numeroChangelogPatch: props.numeroChangelogPatch,
			folderChangelog: props.folderChangelog,
			errors: []
		}
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { url } = this.props;
		const { numeroChangelogVersion, numeroChangelogPatch } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'numeroChangelogVersion', value: numeroChangelogVersion },
			// { type: "text", id: 'numeroChangelogPatch', value: numeroChangelogPatch },
		];

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			let self = this;
			Formulaire.loader(true);
			axios({ method: "PUT", url: url, data: this.state })
				.then(function (response) {
					Toastr.toast('info', 'Données mises à jours.');
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
				})
				.then(function () {
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { errors, numeroChangelogVersion, numeroChangelogPatch, folderChangelog } = this.state;

        let params0 = { errors: errors, onChange: this.handleChange };

        return <form onSubmit={this.handleSubmit}>
            <div className="flex flex-col gap-4 xl:gap-6">
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Paramètres</div>
						<div className="text-gray-600 text-sm">
							Le <i>compteur</i> représente le numéro des changelogs.
							<br/>
							Par exemple, si le compteur est à 5, la prochaine création d'un changelog portera le numéro 6.
							<br/><br/>
							Le <i>dossier FTP</i> représente le chemin où sera déposé le fichier. Attention,
							veuillez à ce que le chemin existe.
						</div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						<div>
						</div>
						<div className="flex gap-4">
							<div className="w-full">
								<Input identifiant="numeroChangelogVersion" valeur={numeroChangelogVersion} {...params0}>Compteur des versions</Input>
							</div>
							{/*<div className="w-full">*/}
							{/*	<Input identifiant="numeroChangelogPatch" valeur={numeroChangelogPatch} {...params0}>Compteur des patchs</Input>*/}
							{/*</div>*/}
							<div className="w-full">
								<Input identifiant="folderChangelog" valeur={folderChangelog} {...params0}>Dossier FTP</Input>
							</div>
						</div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button type="blue" isSubmit={true}>Enregistrer les modifications</Button>
            </div>
        </form>
    }
}
