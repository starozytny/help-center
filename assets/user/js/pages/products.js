import React from "react";
import { createRoot } from "react-dom/client";
import { Faq } from "@userPages/Faq/Faq";
import { ProductFormulaire } from "@userPages/Products/ProductForm";
import { DocumentationDelete } from "@userPages/Documentations/DocumentationDelete";
import { TutorialDelete } from "@userPages/Tutorials/TutorialDelete";
import { CategoryFormulaire } from "@userPages/Faq/Category/CategoryForm";
import { QuestionFormulaire } from "@userPages/Faq/Question/QuestionForm";

let el = document.getElementById("help_faq_list");
if (el) {
	createRoot(el).render(<Faq {...el.dataset} />)
}

el = document.getElementById("products_update");
if (el) {
	createRoot(el).render(<ProductFormulaire context="update" element={JSON.parse(el.dataset.element)} />)
}

el = document.getElementById("products_create");
if (el) {
	createRoot(el).render(<ProductFormulaire context="create" element={null} />)
}

let deletesDoc = document.querySelectorAll('.delete-doc');
if (deletesDoc) {
	deletesDoc.forEach(elem => {
		createRoot(elem).render(<DocumentationDelete context="product" {...elem.dataset} />)
	})
}

let deletesTuto = document.querySelectorAll('.delete-tuto');
if (deletesTuto) {
	deletesTuto.forEach(elem => {
		createRoot(elem).render(<TutorialDelete {...elem.dataset} />)
	})
}

let cat = document.getElementById("help_faq_category_update");
if (cat) {
	createRoot(cat).render(<CategoryFormulaire context="update" element={JSON.parse(cat.dataset.obj)}
											   productSlug={cat.dataset.productSlug} />)
}

cat = document.getElementById("help_faq_category_create");
if (cat) {
	createRoot(cat).render(<CategoryFormulaire context="create" element={null}
											   productSlug={cat.dataset.productSlug} />)
}


let quest = document.getElementById("help_faq_question_update");
if (quest) {
	createRoot(quest).render(<QuestionFormulaire context="update" element={JSON.parse(quest.dataset.obj)}
												 category={JSON.parse(quest.dataset.category)}
												 productSlug={quest.dataset.productSlug} />)
}

quest = document.getElementById("help_faq_question_create");
if (quest) {
	createRoot(quest).render(<QuestionFormulaire context="create" element={null}
												 category={JSON.parse(quest.dataset.category)}
												 productSlug={quest.dataset.productSlug} />)
}
