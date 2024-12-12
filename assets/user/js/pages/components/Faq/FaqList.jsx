import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from 'prop-types';

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Alert } from "@tailwindComponents/Elements/Alert";
import { Button, ButtonA, ButtonIcon, ButtonIconA } from "@tailwindComponents/Elements/Button";
import Toastr from "@tailwindFunctions/toastr";

const URL_INDEX_ELEMENTS = "user_help_product_read";
const URL_AUTO_CONNECT = "auto_connect";

const URL_CREATE_CATEGORY = "user_help_category_create";
const URL_UPDATE_CATEGORY = "user_help_category_update";
const URL_DELETE_CATEGORY = "intern_api_help_faq_categories_delete";

const URL_CREATE_QUESTION = "user_help_question_create";
const URL_UPDATE_QUESTION = "user_help_question_update";
const URL_DELETE_QUESTION = "intern_api_help_faq_questions_delete";

export function FaqList ({ role, productSlug, categories, questions, defaultCategory }) {
	const [category, setCategory] = useState(defaultCategory);
	const [question, setQuestion] = useState(null);

	const refDeleteCategory = useRef(null);
	const refDeleteQuestion = useRef(null);

	let handleModal = (identifiant, id, idCategory) => {
		switch (identifiant) {
			case "delete-category":
				refDeleteCategory.current.handleClick();
				refDeleteCategory.current.handleUpdateFooter(<Button type="red"
																	 onClick={() => handleDelete(refDeleteCategory, Routing.generate(URL_DELETE_CATEGORY, { id: id }))}>
					Confirmer la suppression
				</Button>);
				break;
			case "delete-question":
				refDeleteQuestion.current.handleClick();
				refDeleteQuestion.current.handleUpdateFooter(<Button type="red"
																	 onClick={() => handleDelete(refDeleteQuestion, Routing.generate(URL_DELETE_QUESTION, { category: idCategory, id: id }))}>
					Confirmer la suppression
				</Button>);
				break;
			default:
				break;
		}
	}

	let handleDelete = (ref, url) => {
		let self = this;
		let instance = axios.create();
		instance.interceptors.request.use((config) => {
			ref.current.handleUpdateFooter(<Button type="red" icon="chart-3" isLoader={true}>Confirmer la suppression</Button>);
			return config;
		}, function (error) {
			return Promise.reject(error);
		});
		instance({ method: "DELETE", url: url, data: {} })
			.then(function (response) {
				let params = response.data.message ? { slug: productSlug } : { slug: productSlug, cat: response.data.id };
				location.href = Routing.generate(URL_INDEX_ELEMENTS, params);
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
			})
		;
	}

	let handleShare = (elem) => {
		navigator.clipboard.writeText(location.origin + Routing.generate(URL_AUTO_CONNECT, {token: 'TOKEN_USER_A_REMPLACER', page: productSlug, type: 'faq', cat: elem.category.id, id: elem.id}));
		Toastr.toast('info', 'Lien copié dans le presse papier.')
	}

	return <div>
		<div className="flex flex-col gap-4 md:flex-row">
			<div className="min-w-80">
                {role === "admin"
                    ? <div className="mb-4">
                        <ButtonA iconLeft="add" type="blue"
                                onClick={Routing.generate(URL_CREATE_CATEGORY, { slug: productSlug })}>
                            Ajouter une catégorie
                        </ButtonA>
                    </div>
                    : null
                }
                {categories.length !== 0
                    ? <div className="flex flex-col gap-2">
                        {categories.map((elem, index) => {
							if ((elem.visibility === 1 && role === "admin") || elem.visibility === 0) {
								return <div className={`flex gap-2 items-center p-2 rounded transition-colors cursor-pointer ${elem.id === category ? "bg-white" : "bg-gray-200 hover:bg-gray-50"}`} key={index}
											onClick={() => setCategory(elem.id)}>
									<span className={"icon-" + elem.icon} />
									<span>{elem.name}</span>
								</div>
							}
                        })}
                    </div>
                    : <Alert type="blue" withIcon={false}>Aucun question-réponse pour le moment.</Alert>
                }
            </div>
			<div className="w-full">
				{category
					? (categories.map((elem, index) => {
						if (elem.id === category) {
							return <div className="flex gap-2 justify-between" key={index}>
								<div className="flex gap-2">
									<div className="w-12 h-12 bg-white rounded-md p-2 flex justify-center items-center">
										<span className={"icon-" + elem.icon + " !text-lg"} />
									</div>
									<div>
										<div className="font-medium">{elem.name}</div>
										<div className="text-gray-600">{elem.subtitle}</div>
									</div>
								</div>
								{role === "admin" && <div>
									<div className="flex gap-2">
										<ButtonIconA icon="pencil" type="default"
													 onClick={Routing.generate(URL_UPDATE_CATEGORY, { slug: productSlug, id: elem.id })}>
											Modifier
										</ButtonIconA>
										<ButtonIcon icon="trash" type="default"
													onClick={() => handleModal('delete-category', elem.id)}>
											Supprimer
										</ButtonIcon>
									</div>
								</div>}
							</div>
						}
					}))
					: (categories.length !== 0
						? <div className="flex gap-2">
							<div className="w-12 h-12 bg-white rounded-md p-2 flex justify-center items-center">
								<span className="icon-question !text-lg" />
							</div>
							<div>
								<div className="font-medium">Sélectionnez une catégorie</div>
								<div className="text-gray-600">Cliquez sur la catégorie souhaitée.</div>
							</div>
						</div> : null)
				}

				<div className="mt-4 flex flex-col gap-2">
					{(role === "admin" && category)
						? <div className="mb-4">
							<ButtonA iconLeft="add" type="blue"
									onClick={Routing.generate(URL_CREATE_QUESTION, { slug: productSlug, category: category })}>
								Ajouter une question-réponse
							</ButtonA>
						</div>
						:null
					}
					{questions.map((elem, index) => {
						if (elem.category.id === category) {
							if ((elem.visibility === 1 && role === "admin") || elem.visibility === 0){
								return <div className={`w-full flex flex-col rounded cursor-pointer bg-white ${elem.id === question ? "mb-8" : ""}`} key={index}>
									<div className="w-full flex items-center justify-between gap-2 p-4" onClick={() => setQuestion(elem.id === question ? null : elem.id)}>
										<div className="font-medium">{elem.visibility === 1 ? <span className="text-red-500">[A] </span>  : ""}{elem.name}</div>
										<div><span className="icon-down-chevron"></span></div>
									</div>
									<div className={`border-t p-4 ${elem.id === question ? "block" : "hidden"}`}>
										{role === "admin" && <div className="flex gap-2 mb-4">
											<ButtonIconA icon="pencil" type="default"
														 onClick={Routing.generate(URL_UPDATE_QUESTION, { 'slug': productSlug, 'category': elem.category.id, 'id': elem.id })}>
												Modifier
											</ButtonIconA>
											<ButtonIcon icon="trash" type="default"
														onClick={() => handleModal('delete-question', elem.id, elem.category.id)}>
												Supprimer
											</ButtonIcon>
											<ButtonIcon icon="share" type="default"
														onClick={() => handleShare(elem)}>
												Supprimer
											</ButtonIcon>
										</div>}
										<div dangerouslySetInnerHTML={{ __html: elem.content }} />
									</div>
								</div>
							}
						}
					})}
				</div>
			</div>
		</div>

		{createPortal(<Modal ref={refDeleteCategory} identifiant="delete-category" maxWidth={414} title="Supprimer la catégorie"
							 content={<p>Les questions seront aussi supprimées.</p>} footer={null} />
			, document.body)
		}
		{createPortal(<Modal ref={refDeleteQuestion} identifiant="delete-question" maxWidth={414} title="Supprimer la question"
							 content={<p>Le contenu sera définitivement supprimé.</p>} footer={null} />
			, document.body)
		}
	</div>
}

FaqList.propTypes = {
	role: PropTypes.string.isRequired,
	categories: PropTypes.array.isRequired,
	questions: PropTypes.array.isRequired,
	defaultCategory: PropTypes.number,
}
