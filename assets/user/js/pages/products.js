import '../../css/pages/products.scss';

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { Faq } from "@userPages/Faq/Faq";
import { DocumentationDelete } from "@userPages/Documentations/DocumentationDelete";

Routing.setRoutingData(routes);

let el = document.getElementById("help_faq_list");
if(el){
    createRoot(el).render(<Faq {...el.dataset} />)
}

let deletesDoc = document.querySelectorAll('.delete-doc');
if(deletesDoc){
    deletesDoc.forEach(elem => {
        createRoot(elem).render(<DocumentationDelete context="product" {...elem.dataset} />)
    })
}
