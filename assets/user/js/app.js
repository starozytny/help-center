import '../css/app.scss';

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { Search } from "@userPages/Global/Search";

import Menu from "@tailwindFunctions/menu";

Routing.setRoutingData(routes);

Menu.menuListener();

let el = document.getElementById("global_search_product");
if (el) {
	createRoot(el).render(<Search {...el.dataset} />)
}
