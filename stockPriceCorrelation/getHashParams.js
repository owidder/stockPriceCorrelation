function getHashParams() {
    if(window.location.hash.length > 1) {
        const parts = window.location.hash.substr(1).split("&");
        const params = {};
        parts.forEach(function(part) {
            const nameValue = part.split("=");
            params[nameValue[0]] = nameValue[1];
        })

        return params;
    }

    return {}
}

function setHashParam(name, value) {
    const params = getHashParams();
    params[name] = value;
}

function setHashParams(params) {
    var paramsString = "";
    Object.getOwnPropertyNames(params).forEach(function (name) {

    })
    if(symbolX && symbolY) {
        const hash = "symbolX=" + symbolX + "&" + "symbolY=" + symbolY;
        window.location.hash = hash;
    }
}