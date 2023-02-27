import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios   from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Radiobox }  from "@commonComponents/Elements/Fields";
import { Button }           from "@commonComponents/Elements/Button";
import { LoaderTxt }        from "@commonComponents/Elements/Loader";

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";
import Inputs from "@commonFunctions/inputs";

const URL_INDEX_ELEMENTS    = "admin_help_faq_index";
const URL_CREATE_ELEMENT    = "api_help_faq_categories_create";
const URL_UPDATE_GROUP      = "api_help_faq_categories_update";
const TEXT_CREATE           = "Ajouter la catégorie";
const TEXT_UPDATE           = "Enregistrer les modifications";

export function CategoryFormulaire ({ context, element })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);

    if(context === "update"){
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    }

    let form = <Form
        context={context}
        url={url}
        id={element ? element.id : ""}
        name={element ? Formulaire.setValue(element.name) : ""}
        icon={element ? Formulaire.setValue(element.icon) : ""}
        subtitle={element ? Formulaire.setValue(element.subtitle) : ""}
        visibility={element ? Formulaire.setValue(element.visibility) : 0}
    />

    return <div className="formulaire">{form}</div>;
}

CategoryFormulaire.propTypes = {
    context: PropTypes.string.isRequired,
    element: PropTypes.object,
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            icon: props.icon,
            subtitle: props.subtitle,
            visibility: props.visibility,
            rank: 0,
            errors: [],
            icons: [],
            loadIcons: true,
        }
    }

    componentDidMount = () => { Inputs.getIcons(this); }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleClick = (icon) => { this.setState({ icon }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, id } = this.props;
        const { name, icon, subtitle } = this.state;

        this.setState({ errors: [] });

        let paramsToValidate = [
            {type: "text",  id: 'name',     value: name},
            {type: "text",  id: 'icon',     value: icon},
            {type: "text",  id: 'subtitle', value: subtitle},
        ];

        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else {
            Formulaire.loader(true);
            let self = this;

            axios({ method: context === "update" ? "PUT" : "POST", url: url, data: this.state })
                .then(function (response) {
                    location.href = Routing.generate(URL_INDEX_ELEMENTS, {'cat': response.data.id});
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
            ;
        }
    }

    render () {
        const { context } = this.props;
        const { errors, loadIcons, name, icon, subtitle, visibility, icons } = this.state;

        let visibilityItems = [
            { value: 0, label: 'Pour tous',             identifiant: 'type-0' },
            { value: 1, label: 'Pour administration',   identifiant: 'type-1' },
        ]

        let params = { errors: errors, onChange: this.handleChange }

        let error;
        if(errors && errors.length !== 0){
            errors.map(err => {
                if(err.name === "icon"){
                    error = err.message
                }
            })
        }

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line-container">
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Visibilité</div>
                            <div className="subtitle">Définissez le niveau de visibilité de la catégorie</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line line-fat-box">
                                <Radiobox items={visibilityItems} identifiant="visibility" valeur={visibility} {...params}>
                                    Visibilité
                                </Radiobox>
                            </div>
                        </div>
                    </div>
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Catégorie</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line line-2">
                                <Input identifiant="name" valeur={name} {...params}>Intitulé</Input>
                                <Input identifiant="subtitle" valeur={subtitle} {...params}>Sous titre</Input>
                            </div>
                            {loadIcons
                                ? <LoaderTxt text="Chargement des icônes" />
                                : <div className="line line-icons">
                                    <div className={'form-group' + (error ? " form-group-error" : "")}>
                                        <label htmlFor="icon">Icône</label>
                                        <div className="icons-choice">
                                            {icons.map((choice, index) => {
                                                return <div className={"icon-choice" + (choice === icon ? " active" : "")} key={index}
                                                            onClick={() => this.handleClick(choice)}>
                                                    <span className={"icon-" + choice}></span>
                                                </div>
                                            })}
                                        </div>
                                        <div className="error">{error ? <><span className='icon-error'/>{error}</> : null}</div>
                                    </div>
                                </div>
                            }
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
    id: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    visibility: PropTypes.number.isRequired,
}
