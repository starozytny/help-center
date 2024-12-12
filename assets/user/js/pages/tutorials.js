import React from "react";
import { createRoot } from "react-dom/client";

import Toastr from "@tailwindFunctions/toastr";

import { TutorialFormulaire } from "@userPages/Tutorials/TutorialForm";
import { TutorialDelete } from "@userPages/Tutorials/TutorialDelete";
import { CommentaryFormulaire } from "@userPages/Commentary/CommentaryForm";

let el = document.getElementById("tutorials_update");
if(el){
    createRoot(el).render(<TutorialFormulaire context="update" productSlug={el.dataset.productSlug}
                                              element={JSON.parse(el.dataset.element)}
                                              steps={JSON.parse(el.dataset.steps)} />)
}

el = document.getElementById("tutorials_create");
if(el){
    createRoot(el).render(<TutorialFormulaire context="create" productSlug={el.dataset.productSlug}
                                              element={null} steps={[]} />)
}

let deletesTuto = document.querySelectorAll('.delete-tuto');
if(deletesTuto){
    deletesTuto.forEach(elem => {
        createRoot(elem).render(<TutorialDelete {...elem.dataset}/>)
    })
}

let commentary = document.getElementById('commentary_create');
if(commentary){
    createRoot(commentary).render(<CommentaryFormulaire type="tutorial" {...commentary.dataset} />)
}

let shareUrl = document.getElementById('share_url');
if(shareUrl){
    shareUrl.addEventListener('click', () => {
        navigator.clipboard.writeText(shareUrl.dataset.url);
        Toastr.toast('info', 'Lien copié dans le presse papier.')
    })
}
