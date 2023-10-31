import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

import axios from "axios";
import parse from 'html-react-parser';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import List from "@commonFunctions/list";
import Sort from "@commonFunctions/sort";
import Sanitaze from '@commonFunctions/sanitaze';
import Formulaire from "@commonFunctions/formulaire";

import { Button, ButtonIcon } from "@commonComponents/Elements/Button";
import { Modal } from "@commonComponents/Elements/Modal";

import { MailFormulaire } from "@commonComponents/Modules/Mail/MailForm";

const URL_INDEX_PAGE      = "admin_mails_index";
const URL_GET_ATTACHMENT  = "intern_api_mails_mail_attachment";
const URL_TRASH_ELEMENT   = "intern_api_mails_mail_trash";
const URL_RESTORE_ELEMENT = "intern_api_mails_mail_restore";

const SORTER = Sort.compareCreatedAtInverse;

export function Mails ({ context, totalS, totalT, donnees, from, fromName }) {

    const formRef = useRef(null);
    const trashRef = useRef(null);
    const restoreRef = useRef(null);

    const [load, setLoad] = useState(false);
    const [element, setElement] = useState(null);
    const [data, setData] = useState(JSON.parse(donnees));
    const [totalSent, setTotalSent] = useState(parseInt(totalS));
    const [totalTrash, setTotalTrash] = useState(parseInt(totalT));
    const [selection, setSelection] = useState(false);
    const [selections, setSelections] = useState([]);

    let handleSelect = (elem) => {
        let find = selections.find((sel => sel === elem.id));

        if(!find){
            setSelections([...selections, elem.id]);
        }else{
            setSelections(selections.filter(sel => sel !== elem.id))
        }
    }

    let handleModal = (identifiant, elem) => {
        let ref;
        switch (identifiant){
            case 'formRef': ref = formRef; break;
            case 'trashRef': ref = trashRef; break;
            case 'restoreRef': ref = restoreRef; break;
            default:break;
        }
        if(ref){
            ref.current.handleClick();
            setElement(elem);
        }
    }

    let handleUpdateList = (elem, context) => {
        setData(List.updateDataMuta(elem, context, data, SORTER));
    }

    let handleTrash = (elem) => {
        if(!load){
            setLoad(true);
            trashRef.current.handleUpdateFooter(<Button onClick={null} isLoader={true} type="danger">Confirmer</Button>)

            axios({ method: "PUT", url: Routing.generate(URL_TRASH_ELEMENT, {'id': elem.id}), data: {} })
                .then(function (response) {
                    setTotalSent(totalSent - 1);
                    setTotalTrash(totalTrash + 1);
                    setData(List.updateData(response.data, 'delete', data, SORTER));
                    setElement(null);
                    trashRef.current.handleClose();
                })
                .catch(function (error) { Formulaire.displayErrors(null, error); })
                .then(function () { setLoad(false) })
            ;
        }
    }

    let handleRestore = (elem) => {
        if(!load){
            setLoad(true);
            restoreRef.current.handleUpdateFooter(<Button onClick={null} isLoader={true} type="primary">Confirmer</Button>)

            axios({ method: "PUT", url: Routing.generate(URL_RESTORE_ELEMENT, {'id': elem.id}), data: {} })
                .then(function (response) {
                    setTotalSent(totalSent + 1);
                    setTotalTrash(totalTrash - 1);
                    setData(List.updateData(response.data, 'delete', data, SORTER));
                    setElement(null);
                    restoreRef.current.handleClose();
                })
                .catch(function (error) { Formulaire.displayErrors(null, error); })
                .then(function () { setLoad(false) })
            ;
        }
    }

    let menu = [
        { context: 'envoyes',   icon: "email-tracking", label: "Envoyés",   total: totalSent },
        { context: 'corbeille', icon: "trash",          label: "Corbeille", total: totalTrash },
    ];

    let menuActive = null;
    let menuItems = menu.map((item, index) => {
        let active = false;
        if(item.context === context){
            menuActive = item;
            active = true;
        }

        return <a href={Routing.generate(URL_INDEX_PAGE, {'type': item.context})} className={"item " + active} key={index} >
            <div className="name">
                <span className={"icon-" + item.icon} />
                <span>{item.label}</span>
            </div>

            <div className="total"><span>{item.total}</span></div>
        </a>
    })

    return <div className="boite-mail">
        <div className="col-1">
            <div className="mail-add">
                Les réponses ne sont pas récupérées dans cette boite.
            </div>
            <div className="mail-add">
                <Button icon="email-edit" type="primary" onClick={() => handleModal('formRef', null)}>Nouveau message</Button>
            </div>
            <div className="mail-menu">
                <div className="items">{menuItems}</div>
            </div>
        </div>
        <div className="col-2">
            <div className="mail-list">
                <div className="title">
                    <span className={"icon-" + menuActive.icon} />
                    <span>{menuActive.label}</span>
                </div>
                {/*<div className="actions">*/}
                {/*    <div onClick={() => setSelection(!selection)}>*/}
                {/*        <span>Sélectionner des messages</span>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="items">
                    <ItemMail data={data} setElement={setElement}
                              selection={selection} selections={selections} onSelect={handleSelect} />
                </div>
            </div>
        </div>

        <div className="col-3" id="read">
            <div className="mail-item">
                {selection
                    ? <div class="item">
                        <div style={{marginBottom: "12px"}}>
                            Actions sur les éléments sélectionnés
                        </div>
                    </div>
                    : (element
                            ? <div className="item">
                                <div className="actions">
                                    <div className="col-1">
                                        <div className="createdAt">{Sanitaze.toDateFormat(element.createdAt)}</div>
                                    </div>
                                    <div className="col-2">
                                        {context === "corbeille"
                                            ? <>
                                                <ButtonIcon icon="refresh1" onClick={() => handleModal('restoreRef', element)}>
                                                    Restaurer
                                                </ButtonIcon>
                                            </>
                                            : <>
                                                <ButtonIcon icon="trash" onClick={() => handleModal('trashRef', element)} type="danger">
                                                    Corbeille
                                                </ButtonIcon>
                                            </>
                                        }
                                    </div>
                                </div>

                                <div className="item-header">
                                    <div className="avatar-letter">
                                        <span className="icon-email-tracking"></span>
                                    </div>
                                    <div className="content">
                                        <div className="name">
                                            <div><span>De</span> <span>:</span></div>
                                            <div className="items"><span>{element.expeditor}</span></div>
                                        </div>
                                        <Destinators prefix="A" data={element.destinators} />
                                        {element.cc.length !== 0 ? <Destinators prefix="Cc" data={element.cc} /> : null}
                                        {element.bcc.length !== 0 ? <Destinators prefix="Cci" data={element.bcc} /> : null}
                                    </div>
                                </div>

                                <div className="item-body">
                                    <div className="badges">
                                        <div className="badge">Thème : {element.themeString}</div>
                                    </div>
                                    <div className="subject">{element.subject}</div>
                                    <div className="message">{parse(element.message)}</div>
                                    <div className="files">
                                        {element.files.map((file, index) => {
                                            return <a className="file" key={index}
                                                      download={file} target="_blank"
                                                      href={Routing.generate(URL_GET_ATTACHMENT, {'filename': file})}
                                            >
                                            <span className="icon">
                                                <span className="icon-file" />
                                            </span>
                                                <span className="infos">
                                                <span className="name">PJ {index + 1}</span>
                                            </span>
                                            </a>
                                        })}
                                    </div>
                                </div>
                            </div>
                            : null
                        )
                    }
            </div>
        </div>
        {createPortal(
            <Modal ref={formRef} identifiant="mail" maxWidth={768} margin={2} title="Envoyer un mail" isForm={true}
                   content={<MailFormulaire identifiant="mail" element={element} tos={[]}
                                            from={from} fromName={fromName}
                                            onUpdateList={handleUpdateList} />}
                   footer={null} />,
            document.body)
        }
        {createPortal(
            <Modal ref={trashRef} identifiant="trash" maxWidth={414}
                   title="Déplacer dans la corbeille"
                   content="Déplacer le mail sélectionné dans la corbeille ?"
                   footer={<Button onClick={() => handleTrash(element)} type="danger">Confirmer</Button>}
                   key={element ? element.id : 0} />,
            document.body)
        }

        {createPortal(
            <Modal ref={restoreRef} identifiant="restore" maxWidth={414}
                   title="Restaurer un email"
                   content="Restaurer le mail sélectionné dans la boite d'envois ?"
                   footer={<Button onClick={() => handleRestore(element)} type="primary">Confirmer</Button>}
                   key={element ? element.id : 0} />,
            document.body)
        }
    </div>
}


function Destinators ({ prefix, data }) {
    return <div className="destinators">
        <div><span>{prefix}</span> <span>:</span></div>
        <div className="items">
            {data.map((dest, index) => {
                return <span key={index}>{dest}</span>
            })}
        </div>
    </div>
}

function Item ({ data, setElement, selection, selections, onSelect }) {
    return (data.length !== 0
        ? data.map(elem => {
            return <div className={`item${selections.includes(elem.id) ? " selected" : ""}`} key={elem.id}
                        onClick={selection ? () => onSelect(elem) : () => setElement(elem)}
            >
                <div className="expeditor">
                    <div className="avatar-letter">
                        {selection
                            ? (selections.includes(elem.id)
                                ? <span className="icon-check1"></span>
                                : null
                            )
                            : <span className="icon-email-tracking"></span>
                        }
                    </div>
                    <div className="content">
                        <div className="name">{elem.expeditor}</div>
                        <div className="subject">{elem.subject}</div>
                    </div>
                </div>
                <div className="createdAt">
                    <div>{Sanitaze.toDateFormat(elem.createdAt)}</div>
                </div>
            </div>
        })
        : <div className="item">Aucun résultat.</div>
    )
}

const ItemMail = React.memo(Item);
