function constructParams(params) {
    if (Object.keys(params).length === 0) {
        return "";
    }
    let url = "?";
    for (const key of Object.keys(params)) {
        url += (key + "=" + params[key] + "&");
    }
    url = url.slice(0, url.length - 1);
    return url;
}

const postLogin = async (address, username, password) => {
    let response = null;
    let json = null;
    try {
        return await fetch(`${address}/login/`, {
        method: 'POST',
        body: JSON.stringify({"password": password, "username": username})
        })
        .then(res => res.text())
        .then(result => {
            return JSON.parse(result);
        }
        );
        //console.log(json);
    } catch (error) {
        return null;
        //console.error(error);
    }
}

const getUsers = async (address, username, password, params={}) => {
    let response = null;
    let json = null;
    try {
        return await fetch(`${address}/users/${constructParams(params)}`, {
        method: 'GET',
        headers: {
            "username": username,
            "password": password
        }
        })
        .then(res => res.text())
        .then(result => {
            return JSON.parse(result);
        }
        );
        //console.log(json);
    } catch (error) {
        return null;
        //console.error(error);
    }
}

export { postLogin, getUsers };
