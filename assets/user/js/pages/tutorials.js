import '../../css/pages/tutorials.scss';

import React from "react";
import { createRoot } from "react-dom/client";
import { TutorialFormulaire } from "@userPages/Tutorials/TutorialForm";
import { TutorialDelete } from "@userPages/Tutorials/DocumentationDelete";

let el = document.getElementById("tutorials_update");
if(el){
    createRoot(el).render(<TutorialFormulaire context="update" productSlug={el.dataset.productSlug}
                                                   element={JSON.parse(el.dataset.element)} />)
}

el = document.getElementById("tutorials_create");
if(el){
    createRoot(el).render(<TutorialFormulaire context="create" productSlug={el.dataset.productSlug}
                                                   element={null} />)
}

let deletesTuto = document.querySelectorAll('.delete-tuto');
if(deletesTuto){
    deletesTuto.forEach(elem => {
        createRoot(elem).render(<TutorialDelete context="read" {...elem.dataset}/>)
    })
}
