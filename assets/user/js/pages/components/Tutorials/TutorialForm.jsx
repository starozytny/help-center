import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from "axios";
import toastr from "toastr";
import { uid } from "uid";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Inputs from "@commonFunctions/inputs";
import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Button } from "@tailwindComponents/Elements/Button";
import { TinyMCE } from "@tailwindComponents/Elements/TinyMCE";
import { Input, Radiobox } from "@tailwindComponents/Elements/Fields";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";

import { StepFormulaire } from "@userPages/Tutorials/StepForm";

const URL_INDEX_PAGE = "user_help_tutorial_read";
const URL_UPDATE_PAGE = "user_help_tutorial_update";
const URL_CREATE_ELEMENT = "intern_api_help_tutorials_create";
const URL_UPDATE_ELEMENT = "intern_api_help_tutorials_update";

export function TutorialFormulaire ({ context, productSlug, element, steps }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });
	}

	return <Form
        productSlug={productSlug}
        context={context}
        url={url}
        steps={steps}
        name={element ? Formulaire.setValue(element.name) : ""}
        duration={element ? Formulaire.setValueTime(element.duration) : ""}
        status={element ? Formulaire.setValue(element.status) : 0}
        description={element ? Formulaire.setValue(element.description) : ""}
        visibility={element ? Formulaire.setValue(element.visibility) : 0}
    />
}

TutorialFormulaire.propTypes = {
	productSlug: PropTypes.string.isRequired,
	context: PropTypes.string.isRequired,
	steps: PropTypes.array,
	element: PropTypes.object,
}

class Form extends Component {
	constructor (props) {
		super(props);

		let description = props.description ? props.description : "";

		this.state = {
			productSlug: props.productSlug,
			name: props.name,
			duration: props.duration,
			status: props.status,
			description: { value: description, html: description },
			visibility: props.visibility,
			errors: [],
			loadSteps: true,
		}
	}

	componentDidMount = () => {
		const { steps } = this.props;

		let nbSteps = steps.length > 0 ? steps.length : 1;

		if (steps.length > 0) {
			let self = this;
			steps.forEach((s, index) => {
				self.setState({ [`step${index + 1}`]: { uid: uid(), value: s.content } })
			})
		} else {
			this.setState({ step1: { uid: uid(), value: '' } })
		}

		this.setState({ nbSteps: nbSteps, loadStep: false })
	}

	handleChange = (e) => {
		let name = e.currentTarget.name;
		let value = e.currentTarget.value;

		if (name === "duration") {
			value = Inputs.timeInput(e, this.state[name]);
		}

		this.setState({ [name]: value })
	}

	handleChangeTinyMCE = (name, html) => {
		this.setState({ [name]: { value: this.state[name].value, html: html } })
	}

	handleIncreaseStep = () => {
		this.setState((prevState, prevProps) => ({
			nbSteps: prevState.nbSteps + 1, [`step${(prevState.nbSteps + 1)}`]: { uid: uid(), value: '' }
		}))
	}

	handleUpdateContentStep = (i, content) => {
		let name = `step${i}`;
		this.setState({ [name]: { uid: this.state[name].uid, value: content } })
	}

	handleRemoveStep = (step) => {
		const { nbSteps } = this.state;

		this.setState({ loadStep: true })

		let newNbSteps = nbSteps - 1;
		if (step !== nbSteps) {
			for (let i = step + 1 ; i <= nbSteps ; i++) {
				this.setState({ [`step${i - 1}`]: { uid: uid(), value: this.state[`step${i}`].value } })
			}
		}

		this.setState({ nbSteps: newNbSteps, loadStep: false })
	}

	handleSubmit = (e, stay = false) => {
		e.preventDefault();

		const { context, url, productSlug } = this.props;
		const { name, status, duration, description } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'name', value: name },
			{ type: "text", id: 'status', value: status },
			{ type: "text", id: 'description', value: description.html },
		];

		if (duration !== "") {
			paramsToValidate = [...paramsToValidate, ...[{ type: "time", id: 'duration', value: duration }]];
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
		const { errors, loadStep, name, status, description, nbSteps, visibility } = this.state;

		let params = { errors: errors, onChange: this.handleChange }

		let steps = [];
		for (let i = 1 ; i <= nbSteps ; i++) {
			let val = this.state[`step${i}`];
			steps.push(<StepFormulaire key={val.uid} content={val.value} step={i}
									   onUpdateData={this.handleUpdateContentStep}
									   onRemoveStep={this.handleRemoveStep} />)
		}

		let statusItems = [
			{ value: 0, label: 'Hors ligne', identifiant: 'type-0' },
			{ value: 1, label: 'En ligne', identifiant: 'type-1' },
		]

		let visibilityItems = [
			{ value: 0, label: 'Pour tous', identifiant: 'visi-0' },
			{ value: 1, label: 'Pour administration', identifiant: 'visi-1' },
		]

        return <form onSubmit={this.handleSubmit}>
            <div className="flex flex-col gap-4 xl:gap-6">
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Informations générales</div>
                        <div className="text-gray-600 text-sm">
                            La description doit être très courte pour décrire rapidement à quoi sert ce guide
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Radiobox items={statusItems} identifiant="status" valeur={status} {...params}>
                                    Statut *
                                </Radiobox>
                            </div>
                            <div class="w-full">
                                <Radiobox items={visibilityItems} identifiant="visibility" valeur={visibility} {...params}>
                                    Visibilité *
                                </Radiobox>
                            </div>
                        </div>
                        <div>
                            <Input identifiant="name" valeur={name} {...params}>Intitulé *</Input>
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
                            Le contenu d'un tutoriel est scindé en étapes.
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
                        {loadStep
                            ? <LoaderElements />
                            : <>
                                {steps}
                                <div>
                                    <Button outline={true} type="default" onClick={this.handleIncreaseStep}>Ajouter une étape</Button>
                                </div>
                            </>
                        }
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
	duration: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	status: PropTypes.number.isRequired,
}
