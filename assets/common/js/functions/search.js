const Sanitaze = require('@commonFunctions/sanitaze')

function search(type, dataImmuable, search) {
    let newData = [];
    search = search.toLowerCase();
    search = Sanitaze.removeAccents(search);
    newData = dataImmuable.filter(function(v) {
        return switchFunction(type, search, v);
    })

    return newData;
}

function searchStartWith (value, search){
    let val = value.toLowerCase();
    val = Sanitaze.removeAccents(val);
    return val.startsWith(search)
}

function searchContainsWith (value, search){
    console.log(value);
    let val = value.toLowerCase();
    val = Sanitaze.removeAccents(val);
    return val.search(search) !== -1
}

function switchFunction(type, search, v) {
    switch (type) {
        case "user":
            if(searchContainsWith(v.username, search)
                || searchStartWith(v.email, search)
                || searchContainsWith(v.firstname, search)
                || searchContainsWith(v.lastname, search)
            ){
                return v;
            }
            break;
        case "society":
            if(searchContainsWith(v.name, search)
                || searchContainsWith(v.code, search)
            ){
                return v;
            }
            break;
        case "name":
            if(searchContainsWith(v.name, search)){
                return v;
            }
            break;
        case "global-search":
            if((v.name && searchContainsWith(v.name, search))
                || (v.content && searchContainsWith(v.content, search))
                || (v.description && searchContainsWith(v.description, search))
            ){
                return v;
            }
            break;
        case "he_changelog":
            if(searchContainsWith(v.name, search)
                || searchStartWith(v.numero+"", search)
                || searchStartWith(v.numVersion, search)
            ){
                return v;
            }
            break;
        default:
            break;
    }
}

function selectSearch (value, itemValue) {
    let search = value !== "" ? value.toLowerCase() : "";
    search = Sanitaze.removeAccents(search);

    let label = itemValue.toLowerCase();
    label = Sanitaze.removeAccents(label);

    return label.includes(search) ? 1 : 2;
}

module.exports = {
    search,
    selectSearch,
}
