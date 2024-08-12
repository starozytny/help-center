import React from "react";
import { createRoot } from "react-dom/client";
import { Mails } from "@tailwindComponents/Modules/Mails/Mails";

let el = document.getElementById("mails");
if(el){
    createRoot(el).render(<Mails {...el.dataset} />)
}
