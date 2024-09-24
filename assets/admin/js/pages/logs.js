import "../../css/pages/logs.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Logs } from "@adminPages/Logs/Logs";

let el = document.getElementById("logs_history_list");
if(el){
    createRoot(el).render(<Logs {...el.dataset} />)
}
