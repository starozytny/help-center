import React, { useState } from "react";

import { Button } from "@commonComponents/Elements/Button";

import { StyleguideList } from "@adminPages/Styleguide/StyleguideList";

import { StyleguideColors }      from "@adminPages/Styleguide/Generals/StyleguideColors";
import { StyleguideIcons }       from "@adminPages/Styleguide/Generals/StyleguideIcons";
import { StyleguideAlerts }      from "@adminPages/Styleguide/Components/StyleguideAlerts";
import { StyleguideButtons }     from "@adminPages/Styleguide/Components/StyleguideButtons";
import { StyleguideDropdowns }   from "@adminPages/Styleguide/Components/StyleguideDropdowns";
import { StyleguideBreadcrumbs } from "@adminPages/Styleguide/Components/StyleguideBreadcrumbs";
import { StyleguideForms }       from "@adminPages/Styleguide/Formulaires/StyleguideForms";

export function Styleguide () {
    const [context, setContext] = useState("");

    let content;
    switch (context){
        case "form-all":         content = <StyleguideForms />; break;
        case "gene-icons":       content = <StyleguideIcons />; break;
        case "gene-colors":      content = <StyleguideColors />; break;
        case "comp-alerts":      content = <StyleguideAlerts />; break;
        case "comp-dropdowns":   content = <StyleguideDropdowns />; break;
        case "comp-buttons":     content = <StyleguideButtons />; break;
        case "comp-breadcrumbs": content = <StyleguideBreadcrumbs />; break;
        default: content = <StyleguideList onChangeContext={setContext} />; break;
    }

    return <>
        {context !== "list" && <div className="page-toolbar">
            <Button icon="left-arrow" outline={true} type="default" onClick={() => setContext("list")}>Retour</Button>
        </div>}
        <div className="styleguide">{content}</div>
    </>
}
