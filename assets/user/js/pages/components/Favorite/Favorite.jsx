import React, {useState} from "react";
import PropTypes from "prop-types";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { Button, ButtonIcon } from "@commonComponents/Elements/Button";

const URL_FAVORITE_ELEMENT = 'api_help_favorites_favorite';

export function Favorite ({ context, type, id, isFav })
{
    const [fav, setFav] = useState(parseInt(isFav) === 1);
    const [loadFav, setLoadFav] = useState(false)

    const handleClick = () => {
        let self = this;

        if(!loadFav){
            setLoadFav(true);
            axios({ method: "POST", url: Routing.generate(URL_FAVORITE_ELEMENT, {'type': type, 'id': id}), data: {} })
                .then(function (response) {
                    let code = response.data.code;
                    setFav(parseInt(code) !== 0)
                    setLoadFav(false);
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
            ;
        }
    }

    let icon = loadFav ? 'chart-3' : (fav ? 'heart1' : 'heart');
    let text = fav ? 'Enlever des favoris' : 'Mettre en favoris';

    return <>
        {context === "read"
            ? <ButtonIcon icon={icon} outline={true} onClick={handleClick} tooltipWidth={128}>{text}</ButtonIcon>
            : <ButtonIcon icon={icon} type="none" onClick={handleClick}>{text}</ButtonIcon>
        }
    </>
}

Favorite.propTypes = {
    context: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isFav: PropTypes.string.isRequired,
}
