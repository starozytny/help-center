import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from "axios";
import toastr from "toastr";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Button } from "@tailwindComponents/Elements/Button";
import { TextArea } from "@tailwindComponents/Elements/Fields";

const URL_CREATE_ELEMENT = "intern_api_help_commentaries_create";

export function CommentaryFormulaire ({ type, referenceId }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	return <Form
        url={url}
		type={type}
		referenceId={referenceId}
    />
}

CommentaryFormulaire.propTypes = {
	type: PropTypes.string.isRequired,
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			type: props.type,
			referenceId: props.referenceId,
			message: "",
			errors: [],
		}
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { url } = this.props;
		const { message } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'message', value: message.html }
		];

		let validate = Validateur.validateur(paramsToValidate);
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			let self = this;
			Formulaire.loader(true);
			axios({ method: "POST", url: url, data: this.state })
				.then(function (response) {
					toastr.info('Données enregistrées.');
					location.reload();
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { errors, message } = this.state;

		let params0 = { errors: errors, onChange: this.handleChange };

		return <form onSubmit={this.handleSubmit}>
            <div>
				<TextArea identifiant="message" valeur={message} {...params0}>Votre message</TextArea>
			</div>
			<div className="mt-4">
				<Button isSubmit={true} type="blue">Envoyer</Button>
            </div>
        </form>
	}
}
