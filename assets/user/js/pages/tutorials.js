import '../../css/pages/tutorials.scss';

import React from "react";
import { createRoot } from "react-dom/client";
import { TutorialFormulaire } from "@userPages/Tutorials/TutorialForm";
import { TutorialDelete } from "@userPages/Tutorials/TutorialDelete";
import { Favorite } from "@userPages/Favorite/Favorite";
import { Likes } from "@userPages/Likes/Likes";

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
        createRoot(elem).render(<TutorialDelete context="read" {...elem.dataset}/>)
    })
}

let favoritesTuto = document.querySelectorAll('.favorite-tuto');
if(favoritesTuto){
    favoritesTuto.forEach(elem => {
        createRoot(elem).render(<Favorite context="read" {...elem.dataset} />)
    })
}

let likes = document.getElementById('likes');
if(likes) {
    createRoot(likes).render(<Likes {...likes.dataset} />);
}
