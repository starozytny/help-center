import React, { useState } from 'react';
import PropTypes from "prop-types";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

const URL_LIKES_ELEMENT = 'api_help_likes_like';

export function Likes ({ type, id, answer, haveAnswer, nbLikes, nbDislikes })
{
    const [active, setActive] = useState(parseInt(haveAnswer) === 1 ? parseInt(answer) : 2); // 2 none
    const [likes, setLikes] = useState(parseInt(nbLikes));
    const [dislikes, setDislikes] = useState(parseInt(nbDislikes));
    const [loadData, setLoadData] = useState(false);

    const handleClick = (answer) => {
        let self = this;

        if(!loadData){
            setLoadData(true);
            axios({ method: "POST", url: Routing.generate(URL_LIKES_ELEMENT, {'type': type, 'id': id, 'answer': answer}), data: {} })
                .then(function (response) {
                    let code = response.data.code;
                    setActive(parseInt(code) === 1 ? answer : 2);
                    setLikes(parseInt(response.data.likes))
                    setDislikes(parseInt(response.data.dislikes))
                    setLoadData(false);
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
            ;
        }
    }

    return <>
        <div className={`item${active === 1 ? ' active' : ''}`} onClick={() => handleClick(1)}>
            <span className="icon-like"></span>
            <span>{likes}</span>
        </div>
        <div className={`item${active === 0 ? ' active' : ''}`} onClick={() => handleClick(0)}>
            <span className="icon-dislike"></span>
            <span>{dislikes}</span>
        </div>
    </>
}

Likes.propTypes = {
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    haveAnswer: PropTypes.string.isRequired,
    nbLikes: PropTypes.string.isRequired,
    nbDislikes: PropTypes.string.isRequired,
}
