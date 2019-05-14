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

function setHashParams(params) {
    var paramsStrings = [];
    Object.getOwnPropertyNames(params).forEach(function (name) {
        if(params[name]) {
            paramsStrings.push(name + "=" + params[name]);
        }
    })
    window.location.hash = paramsStrings.join("&");
}