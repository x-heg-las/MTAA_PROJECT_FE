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
    } catch (error) {
        return null;
        //console.error(error);
    }
}

const getUsers = async (address, username, password, params={}) => {
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
    } catch (error) {
        return null;
        //console.error(error);
    }
}

const getTickets = async (address, username, password, params={}) => {
    try {
        return await fetch(`${address}/tickets/${constructParams(params)}`, {
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
    } catch (error) {
        return null;
        //console.error(error);
    }
}

const putUsers = async (address, username, password, params) => {
    let params_copy = JSON.parse(JSON.stringify(params));
    delete params_copy.id;
    try {
        return await fetch(`${address}/users/?id=${params.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "username": username,
            "password": password
        },
        body: JSON.stringify(params_copy)
        })
        .then(res => res.text())
        .then(result => {
            return JSON.parse(result);
        }
        );
    } catch (error) {
        return null;
        //console.error(error);
    }
}

const putTickets = async (address, username, password, params) => {
    let params_copy = JSON.parse(JSON.stringify(params));
    delete params_copy.id;
    try {
        return await fetch(`${address}/tickets/?id=${params.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "username": username,
            "password": password
        },
        body: JSON.stringify(params_copy)
        })
        .then(res => res.text())
        .then(result => {
            return JSON.parse(result);
        }
        );
    } catch (error) {
        return null;
        //console.error(error);
    }
}

const postUsers = async (address, username, password, params) => {
    try {
        return await fetch(`${address}/users/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "username": username,
            "password": password
        },
        body: JSON.stringify(params)
        })
        .then(res => res.text())
        .then(result => {
            return JSON.parse(result);
        }
        );
    } catch (error) {
        return null;
        //console.error(error);
    }
}

const postTickets = async (address, username, password, params) => {
    try {
        return await fetch(`${address}/tickets/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "username": username,
            "password": password
        },
        body: JSON.stringify(params)
        })
        .then(res => res.text())
        .then(result => {
            return JSON.parse(result);
        }
        );
    } catch (error) {
        return null;
        //console.error(error);
    }
}

const deleteUsers = async (address, username, password, params) => {
    try {
        return await fetch(`${address}/users/?id=${params.id}`, {
        method: 'DELETE',
        headers: {
            "username": username,
            "password": password
        }
        })
        .then(res => {
            return res.status;
        });
    } catch (error) {
        return null;
        //console.error(error);
    }
}

const deleteTickets = async (address, username, password, params) => {
    try {
        return await fetch(`${address}/tickets/?id=${params.id}`, {
        method: 'DELETE',
        headers: {
            "username": username,
            "password": password
        }
        })
        .then(res => {
            return res.status;
        });
    } catch (error) {
        return null;
        //console.error(error);
    }
}

const getFile = async (address, username, password, params={}) => {
    try {
        return await fetch(`${address}/file/${constructParams(params)}`, {
        method: 'GET',
        headers: {
            "username": username,
            "password": password
        }
        })
        .then(res => {
            return res.blob();
        });
    } catch (error) {
        return null;
        //console.error(error);
    }
}

const postFile = async (address, username, password, fileName, fileData) => {
    let fileType = fileName.split(".")[-1];
    let contentType = "image/jpeg";
    if (fileType == "pdf") {
        contentType = "application/pdf";
    }
    try {
        return await fetch(`${address}/file/${fileName}/`, {
        method: 'POST',
        headers: {
            "Content-type": contentType,
            "username": username,
            "password": password
        },
        body: fileData
        })
        .then(res => res.text())
        .then(result => {
            return JSON.parse(result);
        });
    } catch (error) {
        return null;
        //console.error(error);
    }
}

export { postLogin, getUsers, getTickets, putUsers, putTickets, postUsers, postTickets, deleteUsers, deleteTickets, getFile, postFile };
