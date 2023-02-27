import React, { useRef } from "react";
import PropTypes from "prop-types";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { Button, ButtonIcon } from "@commonComponents/Elements/Button";
import { Modal } from "@commonComponents/Elements/Modal";

const URL_INDEX_ELEMENTS = 'user_help_product_read';
const URL_DELETE_ELEMENT = 'api_help_documentations_delete';

export function DocumentationDelete ({ id, name, productSlug })
{
    let modalRef = useRef(null);

    const handleClick = () => { modalRef.current.handleClick(); }

    const handleDelete = () => {
        let self = this;

        modalRef.current.handleUpdateFooter(<Button isLoader={true} type="danger">Confirmer la suppression</Button>);
        axios({ method: "DELETE", url: Routing.generate(URL_DELETE_ELEMENT, {'id': id}), data: {} })
            .then(function (response) {
                location.href = Routing.generate(URL_INDEX_ELEMENTS, {'slug': productSlug});
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
        ;
    }

    return <>
        <ButtonIcon icon="trash" type="none" onClick={handleClick}>Supprimer</ButtonIcon>
        <Modal ref={modalRef} identifiant={`delete-${id}`} maxWidth={414} title="Supprimer la documentation"
               content={<p>Etes-vous sûr de vouloir supprimer la documentation : <b>{name}</b> ?</p>}
               footer={<Button type="danger" onClick={handleDelete}>Confirmer la suppression</Button>} closeTxt="Annuler" />
    </>
}

DocumentationDelete.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    productSlug: PropTypes.string.isRequired,
}
