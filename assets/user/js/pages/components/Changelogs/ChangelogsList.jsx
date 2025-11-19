import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { ChangelogsItem } from "@userPages/Changelogs/ChangelogsItem";

export function ChangelogsList ({ data, highlight, onModal, productSlug }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-changelogs">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">#</div>
                            <div className="col-2">Version</div>
                            <div className="col-3">Titre</div>
                            <div className="col-4">Date</div>
                            <div className="col-5">Type</div>
                            <div className="col-6 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <ChangelogsItem key={elem.id} elem={elem} highlight={highlight} onModal={onModal} productSlug={productSlug} />;
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

ChangelogsList.propTypes = {
    data: PropTypes.array.isRequired,
    onModal: PropTypes.func.isRequired,
    highlight: PropTypes.number,
}
