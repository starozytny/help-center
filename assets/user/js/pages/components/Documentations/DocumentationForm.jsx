import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, InputIcon } from "@commonComponents/Elements/Fields";
import { Trumb }            from "@commonComponents/Elements/Trumb";
import { Button }           from "@commonComponents/Elements/Button";
import { LoaderTxt }        from "@commonComponents/Elements/Loader";

import Formulaire           from "@commonFunctions/formulaire";
import Validateur           from "@commonFunctions/validateur";
import Inputs               from "@commonFunctions/inputs";

const URL_INDEX_ELEMENTS    = "user_help_documentation_read";
const URL_CREATE_ELEMENT    = "api_help_documentations_create";
const URL_UPDATE_GROUP      = "api_help_documentations_update";
const TEXT_CREATE           = "Ajouter la documentation";
const TEXT_UPDATE           = "Enregistrer les modifications";

export function DocumentationFormulaire ({ context, element, productSlug })
{
    let url = Routing.generate(URL_CREATE_ELEMENT, {'slug': productSlug});

    if(context === "update"){
        url = Routing.generate(URL_UPDATE_GROUP, {'slug': productSlug, 'id': element.id});
    }

    let form = <Form
        productSlug={productSlug}
        context={context}
        url={url}
        icon={element ? Formulaire.setValue(element.icon) : ""}
        name={element ? Formulaire.setValue(element.name) : ""}
        duration={element ? Formulaire.setValueTime(element.duration) : ""}
        description={element ? Formulaire.setValue(element.description) : ""}
        content={element ? Formulaire.setValue(element.content) : ""}
    />

    return <div className="formulaire">{form}</div>;
}

DocumentationFormulaire.propTypes = {
    productSlug: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
    element: PropTypes.object,
}

class Form extends Component {
    constructor(props) {
        super(props);

        let description = props.description ? props.description : "";
        let content = props.content ? props.content : "";

        this.state = {
            icon: props.icon,
            name: props.name,
            duration: props.duration,
            description: { value: description, html: description },
            content: { value: content, html: content },
            errors: [],
            icons: [],
            loadIcons: true,
        }
    }

    componentDidMount = () => { Inputs.getIcons(this); }

    handleChange = (e) => {
        let name  = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "duration"){
            value = Inputs.timeInput(e, this.state[name]);
        }

        this.setState({[name]: value})
    }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleClickIcon = (icon) => { this.setState({ icon }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, productSlug } = this.props;
        const { name, icon, duration, description, content } = this.state;

        this.setState({ errors: [] });

        let paramsToValidate = [
            {type: "text",  id: 'name', value: name},
            {type: "text",  id: 'description', value: description.html},
            {type: "text",  id: 'content', value: content.html},
        ];

        if(icon !== ""){
            paramsToValidate = [...paramsToValidate, ...[ {type: "text", id: 'icon', value: icon} ]];
        }

        if(duration !== ""){
            paramsToValidate = [...paramsToValidate, ...[ {type: "time", id: 'duration', value: duration} ]];
        }

        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else {
            let self = this;
            Formulaire.loader(true);
            axios({ method: context === "update" ? "PUT" : "POST", url: url, data: this.state })
                .then(function (response) {
                    location.href = Routing.generate(URL_INDEX_ELEMENTS, {'p_slug': productSlug, 'slug': response.data.slug});
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
            ;
        }
    }

    render () {
        const { context } = this.props;
        const { errors, loadIcons, name, icon, duration, description, content, icons } = this.state;

        let params  = { errors: errors, onChange: this.handleChange }
        let params1 = { errors: errors, onChange: this.handleClickIcon }

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
                            <div className="line">
                                <Input identifiant="name" valeur={name} {...params}>Intitulé *</Input>
                            </div>
                            {loadIcons
                                ? <LoaderTxt text="Chargement des icônes" />
                                : <div className="line line-icons">
                                    <InputIcon identifiant="icon" valeur={icon} icons={icons} {...params1}>Icône</InputIcon>
                                </div>
                            }
                            <div className="line">
                                <Input identifiant="duration" valeur={duration} placeholder="00h00" {...params}>Durée de lecture</Input>
                            </div>
                            <div className="line">
                                <Trumb identifiant="description" valeur={description.value} errors={errors} onChange={this.handleChangeTrumb}>
                                    Courte description *
                                </Trumb>
                            </div>
                        </div>
                    </div>
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Contenu</div>
                            <div className="subtitle">
                                Documentation complète de la fonctionnalité ou caractéristique de votre solution
                            </div>
                        </div>
                        <div className="line-col-2">
                            <div className="line">
                                <Trumb identifiant="content" valeur={content.value} errors={errors} onChange={this.handleChangeTrumb}>
                                    Description *
                                </Trumb>
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
    productSlug: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
    url: PropTypes.node.isRequired,
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
}