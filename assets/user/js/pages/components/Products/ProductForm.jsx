import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, InputFile, Radiobox } from "@commonComponents/Elements/Fields";
import { TinyMCE }          from "@commonComponents/Elements/TinyMCE";
import { Button }           from "@commonComponents/Elements/Button";

import Formulaire           from "@commonFunctions/formulaire";
import Validateur           from "@commonFunctions/validateur";

const URL_INDEX_ELEMENTS    = "user_help_product_read";
const URL_CREATE_ELEMENT    = "intern_api_help_products_create";
const URL_UPDATE_ELEMENT    = "intern_api_help_products_update";
const TEXT_CREATE           = "Ajouter le produit";
const TEXT_UPDATE           = "Enregistrer les modifications";

export function ProductFormulaire ({ context, element })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);

    if(context === "update"){
        url = Routing.generate(URL_UPDATE_ELEMENT, {'id': element.id});
    }

    let form = <Form
        context={context}
        url={url}
        type={element ? Formulaire.setValue(element.type) : 0}
        name={element ? Formulaire.setValue(element.name) : ""}
        website={element ? Formulaire.setValue(element.url) : ""}
        description={element ? Formulaire.setValue(element.description) : ""}
        logoFile={element ? Formulaire.setValue(element.logoFile) : ""}
    />

    return <div className="formulaire">{form}</div>;
}

ProductFormulaire.propTypes = {
    context: PropTypes.string.isRequired,
    element: PropTypes.object,
}

class Form extends Component {
    constructor(props) {
        super(props);

        let description = props.description ? props.description : "";

        this.state = {
            type: props.type,
            name: props.name,
            website: props.website,
            description: { value: description, html: description },
            errors: [],
        }

        this.file = React.createRef();
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeTinyMCE = (name, html) => {
        this.setState({ [name]: {value: this.state[name].value, html: html} })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url } = this.props;
        const { name, type, website, description } = this.state;

        this.setState({ errors: [] });

        let paramsToValidate = [
            {type: "text",  id: 'name', value: name},
            {type: "text",  id: 'type', value: type},
            {type: "text",  id: 'description', value: description.html},
        ];

        if(parseInt(type) === 0){
            paramsToValidate = [...paramsToValidate, ...[ {type: "text", id: 'website', value: website} ]];
        }

        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else {
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            let file = this.file.current;
            if(file.state.files.length > 0){
                formData.append("logo", file.state.files[0]);
            }

            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    location.href = Routing.generate(URL_INDEX_ELEMENTS, {'slug': response.data.slug});
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
            ;
        }
    }

    render () {
        const { context, logoFile } = this.props;
        const { errors, name, type, website, description } = this.state;

        let params  = { errors: errors, onChange: this.handleChange };

        let typesItems = [
            { value: 0, label: 'Webservice',  identifiant: 'type-0' },
            { value: 1, label: 'Windev',      identifiant: 'type-1' },
        ]

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line-container">
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Informations générales</div>
                            <div className="subtitle">
                                La description doit être très courte pour décrire rapidement à quoi sert cette documentation
                            </div>
                        </div>
                        <div className="line-col-2">
                            <div className="line line-fat-box">
                                <Radiobox items={typesItems} identifiant="type" valeur={type} {...params}>
                                    Type de produit
                                </Radiobox>
                            </div>
                            <div className="line">
                                <Input identifiant="name" valeur={name} {...params}>Intitulé *</Input>
                            </div>
                            {parseInt(type) === 0
                                ? <div className="line">
                                    <Input identifiant="website" valeur={website} placeholder="website.fr" {...params}>
                                        Site internet *
                                    </Input>
                                </div>
                                : null
                            }
                            <div className="line">
                                <TinyMCE type={5} identifiant='description' valeur={description.value}
                                         errors={errors} onUpdateData={this.handleChangeTinyMCE}>
                                    Courte description *
                                </TinyMCE>
                            </div>
                            <div className="line">
                                <InputFile ref={this.file} type="simple" identifiant="logo" valeur={logoFile}
                                           placeholder="Glissez et déposer le logo" {...params}>
                                    Logo
                                </InputFile>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="line-buttons">
                    <Button isSubmit={true} type="primary">{context === "create" ? TEXT_CREATE : TEXT_UPDATE}</Button>
                </div>
            </form>
        </>
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
