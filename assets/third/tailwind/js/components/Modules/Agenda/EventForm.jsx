import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Checkbox, Input } from "@commonComponents/Elements/Fields";
import { Trumb }            from "@commonComponents/Elements/Trumb";
import { Button }           from "@commonComponents/Elements/Button";

import Formulaire from "@commonFunctions/formulaire";
import Inputs     from "@commonFunctions/inputs";

const URL_INDEX_ELEMENTS    = "admin_agenda_index";
const URL_CREATE_ELEMENT    = "intern_api_agenda_events_create";
const URL_UPDATE_GROUP      = "intern_api_agenda_events_update";
const TEXT_CREATE           = "Ajouter l'évènement";
const TEXT_UPDATE           = "Enregistrer les modifications";

export function EventFormulaire ({ context, element })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);

    if(context === "update"){
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    }

    let form = <Form
        context={context}
        url={url}
        name={element ? Formulaire.setValue(element.name) : ""}
        type={element ? Formulaire.setValue(element.type) : 0}
        content={element ? Formulaire.setValue(element.content) : ""}
        localisation={element ? Formulaire.setValue(element.localisation): ""}
        startAt={element ? Formulaire.setValueDate(element.startAt) : ""}
        endAt={element ? Formulaire.setValueDate(element.endAt) : ""}
        startTime={element ? Formulaire.setValueTime(element.startAt) : ""}
        endTime={element ? Formulaire.setValueTime(element.endAt) : ""}
        allDay={element ? Formulaire.setValue([element.allDay ? 1 : 0]) : [0]}
    />

    return <div className="formulaire">{form}</div>;
}

EventFormulaire.propTypes = {
    context: PropTypes.string.isRequired,
    element: PropTypes.object,
}

class Form extends Component {
    constructor(props) {
        super(props);

        let content = props.content ? props.content : ""

        this.state = {
            name: props.name,
            type: props.type,
            content: { value: content, html: content },
            localisation: props.localisation,
            startAt: props.startAt,
            endAt: props.endAt,
            startTime: props.startTime,
            endTime: props.endTime,
            allDay: props.allDay,
            errors: [],
        }
    }

    componentDidMount = () => { Inputs.initDateInput(this.handleChangeDate, this.handleChange, new Date()) }

    handleChange = (e, picker) => {
        let name  = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "startAt" || name === "endAt"){
            value = Inputs.dateInput(e, picker, this.state[name]);
        }

        if(name === "startTime" || name === "endTime"){
            value = Inputs.timeInput(e, this.state[name]);
        }

        this.setState({[name]: value})
    }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleSwitch = (e) => {
        this.setState({ [e.currentTarget.name]: e.currentTarget.checked ? [parseInt(e.currentTarget.value)] : [0] })
    }

    handleChangeDate = (name, value) => { this.setState({ [name]: value }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url } = this.props;
        const { name, type, allDay, startAt, startTime, endAt, endTime } = this.state;

        this.setState({ errors: [] });

        let paramsToValidate = [
            {type: "text",  id: 'name',      value: name},
            {type: "text",  id: 'type',      value: type},
            {type: "text",  id: 'type',      value: type},
            {type: "date",  id: 'startAt',   value: startAt},
        ];

        if(allDay[0] === 0){
            paramsToValidate = [...paramsToValidate, ...[
                {type: "time", id: 'startTime', value: startTime},
                {type: "date", id: 'endAt',   value: endAt},
                {type: "time", id: 'endTime', value: endTime},
            ]];
        }

        Formulaire.generiqueSendForm(this, context, paramsToValidate, url, this.state, Routing.generate(URL_INDEX_ELEMENTS));
    }

    render () {
        const { context } = this.props;
        const { errors, name, content, localisation, startAt, endAt, startTime, endTime, allDay } = this.state;

        let params = { errors: errors, onChange: this.handleChange }

        let allDayItems = [{ value: 1, label: "Oui", identifiant: "oui" }]

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line-container">
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Évènement</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line line-2">
                                <Input identifiant="name" valeur={name} {...params}>Nom de l'évènement</Input>
                                <Input identifiant="localisation" valeur={localisation} {...params}>Lieu de l'évènement</Input>
                            </div>
                        </div>
                    </div>
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Dates</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line">
                                <Checkbox items={allDayItems} identifiant="allDay" valeur={allDay}
                                          errors={[]} onChange={this.handleSwitch} isSwitcher={true}>
                                    Toute la journée
                                </Checkbox>
                            </div>
                            <div className="line line-2">
                                <Input type="js-date" identifiant="startAt" valeur={startAt} {...params}>Début</Input>
                                <Input type="js-date" identifiant="endAt" valeur={allDay[0] === 0 ? endAt : startAt} {...params}>Fin</Input>
                            </div>
                            {allDay[0] === 0
                                ? <div className="line line-2">
                                    <Input identifiant="startTime" valeur={startTime} placeholder="00h00" {...params}>Horaire du début</Input>
                                    <Input identifiant="endTime" valeur={endTime} placeholder="00h00" {...params}>Horaire de fin</Input>
                                </div>
                                : null
                            }
                        </div>
                    </div>
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Contenu</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line">
                                <Trumb identifiant="content" valeur={content.value} errors={errors} onChange={this.handleChangeTrumb}>
                                    Description
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
    context: PropTypes.string.isRequired,
    url: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    localisation: PropTypes.string.isRequired,
    startAt: PropTypes.string.isRequired,
    endAt: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    allDay: PropTypes.array.isRequired,
}
