import React, { useRef } from "react";
import PropTypes from "prop-types";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { Button } from "@tailwindComponents/Elements/Button";
import { Modal } from "@tailwindComponents/Elements/Modal";

const URL_INDEX_ELEMENTS = 'user_help_product_read';
const URL_DELETE_ELEMENT = 'intern_api_help_tutorials_delete';

export function TutorialDelete ({ id, name, productSlug })
{
    let modalRef = useRef(null);

    const handleClick = () => { modalRef.current.handleClick(); }

    const handleDelete = () => {
        let self = this;

        modalRef.current.handleUpdateFooter(<Button isLoader={true} type="red">Confirmer la suppression</Button>);
        axios({ method: "DELETE", url: Routing.generate(URL_DELETE_ELEMENT, {id: id}), data: {} })
            .then(function (response) {
                location.href = Routing.generate(URL_INDEX_ELEMENTS, {slug: productSlug});
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
        ;
    }

    return <>
        <div className="text-sm underline cursor-pointer hover:text-gray-700" onClick={handleClick}>Supprimer</div>
        <Modal ref={modalRef} identifiant={`delete-tuto-${id}`} maxWidth={414} title="Supprimer le tutoriel"
               content={<p>Êtes-vous sûr de vouloir supprimer le tutoriel : <b>{name}</b> ?</p>}
               footer={<Button type="red" onClick={handleDelete}>Confirmer la suppression</Button>} closeTxt="Annuler" />
    </>
}

TutorialDelete.propTypes = {
    context: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    productSlug: PropTypes.string.isRequired,
}
