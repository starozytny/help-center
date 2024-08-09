import React from "react";
import { createRoot } from "react-dom/client";
import { ProductDelete } from "@userPages/Products/ProductDelete";

let deletesProd = document.querySelectorAll('.delete-product');
if(deletesProd){
    deletesProd.forEach(elem => {
        createRoot(elem).render(<ProductDelete context="product" {...elem.dataset}/>)
    })
}
