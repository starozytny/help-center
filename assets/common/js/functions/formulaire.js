const axios = require("axios");
const toastr = require("toastr");
const moment = require("moment");
require("moment/locale/fr");

const Validateur = require("@commonFunctions/validateur");

function generiqueSendForm (self, context, paramsToValidate, url, data, urlReload) {
    let validate = Validateur.validateur(paramsToValidate)
    if(!validate.code){
        showErrors(this, validate);
    }else {
        loader(true);
        axios({ method: context === "update" ? "PUT" : "POST", url: url, data: data })
            .then(function (response) { location.href = urlReload; })
            .catch(function (error) { displayErrors(self, error); loader(false); })
        ;
    }
}

function axiosGetData(self, url, sorter = null){
    axios.get(url, {})
        .then(function (response) {
            let data = response.data;
            if(sorter !== null){
                data.sort(sorter);
            }
            self.setState({ data: data });
        })
        .catch(function (error) {
            displayErrors(self, error, "Une erreur est survenue lors de la récupération des données.")
        })
        .then(function () {
            self.setState({ loadData: false });
        })
    ;
}

function loader(status){
    let loader = document.querySelector('#loader');
    if(status){
        loader.style.display = "flex";
    }else{
        loader.style.display = "none";
    }
}

function setValue (value, defaultValue = "") {
    return value === null ? defaultValue : value;
}

function setValueDate (value, defaultValue = "") {
    return value === null ? defaultValue : moment(value).format('DD/MM/YYYY');
}

function setValueTime (value, defaultValue = "") {
    return value === null ? defaultValue : moment(value).format('HH[h]mm');
}

function showErrors(self, validate, text="Veuillez vérifier les informations transmises.", toTop = false)
{
    if(toTop){
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    toastr.warning(text);
    self.setState({ errors: validate.errors });
}

function displayErrors(self, error, message="Veuillez vérifier les informations transmises."){
    if(Array.isArray(error.response.data)){
        toastr.error(message);
        if(self){
            self.setState({ errors: error.response.data });
        }
    }else{
        if(error.response.data.message){
            toastr.error(error.response.data.message)
        }else{
            toastr.error(message);
        }
    }
}

function updateValueCheckbox(e, items, value){
    return (e.currentTarget.checked) ? [...items, ...[value]] : items.filter(v => v !== value)
}
module.exports = {
    generiqueSendForm,
    axiosGetData,
    loader,
    setValue,
    setValueDate,
    setValueTime,
    showErrors,
    displayErrors,
    updateValueCheckbox
}
