import "../../css/pages/changelogs.scss"

import React from "react";
import { createRoot } from "react-dom/client";

import { Changelogs } from "@userPages/Changelogs/Changelogs";
import { ChangelogFormulaire } from "@userPages/Changelogs/ChangelogForm";

let el = document.getElementById("help_changelogs_list");
if(el){
    createRoot(el).render(<Changelogs {...el.dataset} />)
}

el = document.getElementById("help_changelogs_update");
if(el){
    createRoot(el).render(<ChangelogFormulaire context="update" productSlug={el.dataset.productSlug} element={JSON.parse(el.dataset.element)} />)
}

el = document.getElementById("help_changelogs_create");
if(el){
    createRoot(el).render(<ChangelogFormulaire context="create" productSlug={el.dataset.productSlug} element={null} />)
}
