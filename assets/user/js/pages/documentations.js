import React from "react";
import { createRoot } from "react-dom/client";

import Toastr from "@tailwindFunctions/toastr";

import { DocumentationFormulaire } from "@userPages/Documentations/DocumentationForm";
import { DocumentationDelete } from "@userPages/Documentations/DocumentationDelete";
import { CommentaryFormulaire } from "@userPages/Commentary/CommentaryForm";
import { CommGerance } from "@userPages/Documentations/Products/Lotys/CommGerance/CommGerance";

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

let commentary = document.getElementById('commentary_create');
if(commentary){
    createRoot(commentary).render(<CommentaryFormulaire type="documentation" {...commentary.dataset} />)
}

let shareUrl = document.getElementById('share_url');
if(shareUrl){
    shareUrl.addEventListener('click', () => {
        navigator.clipboard.writeText(shareUrl.dataset.url);
        Toastr.toast('info', 'Lien copié dans le presse papier.')
    })
}

let lotysCommGerance = document.getElementById('lotys_comm_gerance');
if(lotysCommGerance){
    createRoot(lotysCommGerance).render(<CommGerance />)
}
