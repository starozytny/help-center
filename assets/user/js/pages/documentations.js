import '../../css/pages/documentations.scss';

import React from "react";
import { createRoot } from "react-dom/client";
import { DocumentationFormulaire } from "@userPages/Documentations/DocumentationForm";
import { DocumentationDelete } from "@userPages/Documentations/DocumentationDelete";

let el = document.getElementById("documentations_update");
if(el){
    createRoot(el).render(<DocumentationFormulaire context="update" productSlug={el.dataset.productSlug}
                                                   element={JSON.parse(el.dataset.element)} />)
}

el = document.getElementById("documentations_create");
if(el){
    createRoot(el).render(<DocumentationFormulaire context="create" productSlug={el.dataset.productSlug}
                                                   element={null} />)
}

let deletesDoc = document.querySelectorAll('.delete-doc');
if(deletesDoc){
    deletesDoc.forEach(elem => {
        createRoot(elem).render(<DocumentationDelete context="read" {...elem.dataset}/>)
    })
}
