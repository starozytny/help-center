import React from "react";
import { createRoot } from "react-dom/client";
import { ProductFormulaire } from "@adminPages/Products/ProductForm";
import { ProductDelete } from "@userPages/Products/ProductDelete";

let el = document.getElementById("products_update");
if (el) {
	createRoot(el).render(<ProductFormulaire context="update" element={JSON.parse(el.dataset.element)} />)
}

el = document.getElementById("products_create");
if (el) {
	createRoot(el).render(<ProductFormulaire context="create" element={null} />)
}

let deletesProd = document.querySelectorAll('.delete-product');
if(deletesProd){
	deletesProd.forEach(elem => {
		createRoot(elem).render(<ProductDelete context="product" {...elem.dataset}/>)
	})
}

