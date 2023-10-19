import React, { useRef } from "react";
import PropTypes from "prop-types";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { Button, ButtonIcon } from "@commonComponents/Elements/Button";
import { Modal } from "@commonComponents/Elements/Modal";

const URL_INDEX_ELEMENTS = 'user_help_products_index';
const URL_DELETE_ELEMENT = 'intern_api_help_products_delete';

export function ProductDelete ({ context, id, name })
{
    let modalRef = useRef(null);

    const handleClick = () => { modalRef.current.handleClick(); }

    const handleDelete = () => {
        let self = this;

        modalRef.current.handleUpdateFooter(<Button isLoader={true} type="danger">Confirmer la suppression</Button>);
        axios({ method: "DELETE", url: Routing.generate(URL_DELETE_ELEMENT, {'id': id}), data: {} })
            .then(function (response) {
                location.href = Routing.generate(URL_INDEX_ELEMENTS);
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
        ;
    }

    return <>
        {context === "read"
            ? <Button icon="trash" type="danger" onClick={handleClick}>Supprimer</Button>
            : <ButtonIcon icon="trash" type="none" onClick={handleClick}>Supprimer</ButtonIcon>
        }
        <Modal ref={modalRef} identifiant={`delete-doc-${id}`} maxWidth={414} title="Supprimer le produit"
               content={<p>
                   Etes-vous sûr de vouloir supprimer la documentation : <b>{name}</b> ? <br/><br/>
                   Toutes les données liées à ce produit seront également supprimés.
                </p>}
               footer={<Button type="danger" onClick={handleDelete}>Confirmer la suppression</Button>} closeTxt="Annuler" />
    </>
}

ProductDelete.propTypes = {
    context: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
}
