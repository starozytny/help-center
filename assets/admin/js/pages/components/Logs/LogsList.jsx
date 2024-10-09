import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { LogsItems } from "@adminPages/Logs/LogsItems";

export function LogsList ({ data, users }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-logs">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Utilisateur</div>
                            <div className="col-2">Quand</div>
                            <div className="col-3">Url</div>
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <LogsItems key={elem.id} elem={elem} users={users} />;
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

LogsList.propTypes = {
    data: PropTypes.array.isRequired
}
