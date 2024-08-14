import React, { useRef } from "react";
import PropTypes from "prop-types";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { Button } from "@tailwindComponents/Elements/Button";
import { Modal } from "@tailwindComponents/Elements/Modal";

const URL_INDEX_ELEMENTS = 'user_help_documentation_index';
const URL_DELETE_ELEMENT = 'intern_api_help_documentations_delete';

export function DocumentationDelete ({ id, name, productSlug })
{
    let modalRef = useRef(null);

    const handleClick = () => { modalRef.current.handleClick(); }

    const handleDelete = () => {
        let self = this;

        modalRef.current.handleUpdateFooter(<Button isLoader={true} type="red">Confirmer la suppression</Button>);
        axios({ method: "DELETE", url: Routing.generate(URL_DELETE_ELEMENT, {id: id}), data: {} })
            .then(function (response) {
                location.href = Routing.generate(URL_INDEX_ELEMENTS, {p_slug: productSlug});
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
        ;
    }

    return <>
        <div className="text-sm underline cursor-pointer hover:text-gray-700" onClick={handleClick}>Supprimer</div>
        <Modal ref={modalRef} identifiant={`delete-doc-${id}`} maxWidth={414} title="Supprimer la documentation"
               content={<p>Êtes-vous sûr de vouloir supprimer la documentation : <b>{name}</b> ?</p>}
               footer={<Button type="red" onClick={handleDelete}>Confirmer la suppression</Button>} closeTxt="Annuler" />
    </>
}

DocumentationDelete.propTypes = {
    context: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    productSlug: PropTypes.string.isRequired,
}
