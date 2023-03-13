import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from "axios";
import toastr from "toastr";
import { uid } from "uid";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }    from "@commonComponents/Elements/Button";
import { LoaderTxt } from "@commonComponents/Elements/Loader";
import { StepFormulaire } from "@userPages/Tutorials/StepForm";
import { Input, Radiobox } from "@commonComponents/Elements/Fields";

import Formulaire   from "@commonFunctions/formulaire";
import Validateur   from "@commonFunctions/validateur";
import Inputs       from "@commonFunctions/inputs";
import {TinyMCE} from "@commonComponents/Elements/TinyMCE";

const URL_INDEX_PAGE        = "user_help_tutorial_read";
const URL_UPDATE_PAGE       = "user_help_tutorial_update";
const URL_CREATE_ELEMENT    = "api_help_tutorials_create";
const URL_UPDATE_ELEMENT    = "api_help_tutorials_update";
const TEXT_CREATE           = "Ajouter la documentation";
const TEXT_UPDATE           = "Enregistrer les modifications";

export function TutorialFormulaire ({ context, productSlug, element, steps })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);

    if(context === "update"){
        url = Routing.generate(URL_UPDATE_ELEMENT, {'id': element.id});
    }

    let form = <Form
        productSlug={productSlug}
        context={context}
        url={url}
        steps={steps}
        name={element ? Formulaire.setValue(element.name) : ""}
        duration={element ? Formulaire.setValueTime(element.duration) : ""}
        status={element ? Formulaire.setValue(element.status) : 0}
        description={element ? Formulaire.setValue(element.description) : ""}
    />

    return <div className="formulaire">{form}</div>;
}

TutorialFormulaire.propTypes = {
    productSlug: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
    steps: PropTypes.array,
    element: PropTypes.object,
}

class Form extends Component {
    constructor(props) {
        super(props);

        let description = props.description ? props.description : "";

        this.state = {
            productSlug: props.productSlug,
            name: props.name,
            duration: props.duration,
            status: props.status,
            description: { value: description, html: description },
            errors: [],
            loadSteps: true,
        }
    }

    componentDidMount = () => {
        const { steps } = this.props;

        let nbSteps = steps.length > 0 ? steps.length : 1;

        if(steps.length > 0){
            let self = this;
            steps.forEach((s, index) => {
                self.setState({ [`step${index + 1}`]: { uid: uid(), value: s.content} })
            })
        }else{
            this.setState({ step1: { uid: uid(), value: '' } })
        }

        this.setState({ nbSteps: nbSteps, loadStep: false })
    }

    handleChange = (e) => {
        let name  = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "duration"){
            value = Inputs.timeInput(e, this.state[name]);
        }

        this.setState({[name]: value})
    }

    handleChangeTinyMCE = (name, html) => {
        this.setState({ [name]: {value: this.state[name].value, html: html} })
    }

    handleIncreaseStep = () => { this.setState((prevState, prevProps) => ({
        nbSteps: prevState.nbSteps + 1, [`step${(prevState.nbSteps + 1)}`]: { uid: uid(), value: '' }
    })) }

    handleUpdateContentStep = (i, content) => {
        let name = `step${i}`;
        this.setState({ [name]: { uid: this.state[name].uid, value: content } })
    }

    handleRemoveStep = (step) => {
        const { nbSteps } = this.state;

        this.setState({ loadStep: true })

        let newNbSteps = nbSteps - 1;
        if(step !== nbSteps){
            for(let i = step + 1; i <= nbSteps ; i++){
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
            {type: "text",  id: 'name', value: name},
            {type: "text",  id: 'status', value: status},
            {type: "text",  id: 'description', value: description.html},
        ];

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
                    if(!stay){
                        location.href = Routing.generate(URL_INDEX_PAGE, {'p_slug': productSlug, 'slug': response.data.slug});
                    }else{
                        toastr.info('Données enregistrées.');

                        if(context === "create"){
                            location.href = Routing.generate(URL_UPDATE_PAGE, {'p_slug': productSlug, 'slug': response.data.slug});
                        }else{
                            Formulaire.loader(false);
                        }
                    }
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
            ;
        }
    }

    render () {
        const { context } = this.props;
        const { errors, loadStep, name, status, duration, description, nbSteps } = this.state;

        let params  = { errors: errors, onChange: this.handleChange }

        let steps = [];
        for(let i = 1 ; i <= nbSteps ; i++){
            let val = this.state[`step${i}`];
            steps.push(<StepFormulaire key={val.uid} content={val.value} step={i}
                                       onUpdateData={this.handleUpdateContentStep}
                                       onRemoveStep={this.handleRemoveStep} />)
        }

        let statusItems = [
            { value: 0, label: 'Hors ligne', identifiant: 'type-0' },
            { value: 1, label: 'En ligne',   identifiant: 'type-1' },
        ]

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line-container">
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Informations générales</div>
                            <div className="subtitle">
                                La description doit être très courte pour décrire rapidement à quoi sert ce tutoriel
                            </div>
                        </div>
                        <div className="line-col-2">
                            <div className="line line-fat-box">
                                <Radiobox items={statusItems} identifiant="status" valeur={status} {...params}>
                                    Visibilité *
                                </Radiobox>
                            </div>
                            <div className="line">
                                <Input identifiant="name" valeur={name} {...params}>Intitulé *</Input>
                            </div>
                            <div className="line">
                                <Input identifiant="duration" valeur={duration} placeholder="00h00" {...params}>Durée de lecture</Input>
                            </div>
                            <div className="line">
                                <TinyMCE type={0} identifiant='description' valeur={description.value}
                                         errors={errors} onUpdateData={this.handleChangeTinyMCE}>
                                    Courte description
                                </TinyMCE>
                            </div>
                        </div>
                    </div>

                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Contenu</div>
                            <div className="subtitle">
                                Le contenu d'un tutoriel est scindé en étapes.
                            </div>
                        </div>
                        <div className="line-col-2">
                            {loadStep
                                ? <LoaderTxt />
                                : <>
                                    {steps}
                                    <div className="line">
                                        <Button outline={true} type="warning" onClick={this.handleIncreaseStep}>Ajouter une étape</Button>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>

                <div className="line-buttons">
                    <Button isSubmit={true} type="primary">{context === "create" ? TEXT_CREATE : TEXT_UPDATE}</Button>
                    <Button isSubmit={true} outline={true} type="primary" onClick={(e) => this.handleSubmit(e, true)}>Enregistrer et rester sur la page</Button>
                </div>
            </form>
        </>
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
