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
        
        console.error(error);
        return null;
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
        .then(res => {console.log("Call" + res) ;return res.text()})
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
        console.log(`${address}/tickets/${constructParams(params)}`);
        return await fetch(`${address}/tickets/${constructParams(params)}`, {
            method: 'GET',
            headers: {
                "username": username,
                "password": password
            }
        })
        .then((res) => {return Promise.all([res.status, res.text()])})
        .then((result) => {
            const response = JSON.parse(result[1]);
            console.log(response);
            return {
                status: result[0],
                body: response
            }
        }
        );
    } catch (error) {
        console.error(error);
        return null;
    }
}

const putUsers = async (address, username, password, params) => {
    try {
        let params_copy = JSON.parse(JSON.stringify(params));
        delete params_copy.id;
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
        console.error(error);
        return null;
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
            console.log(result)
            return JSON.parse(result);
        }
        );
    } catch (error) {
        console.error(error);
        return null;
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

const postFile = async (address, username, password, fileData) => {
    try {
        const uri = fileData.uri;
        const fileName = fileData.name;
        const response = await fetch(uri);
        const fileBlob = await response.blob();
        
        return await fetch(`${address}/file/${fileName}/`, {
        method: 'POST',
        headers: {
            "Content-type": fileData.type,
            "username": username,
            "password": password
        },
        body: fileBlob
        })
        .then(res => {return res.text()})
        .then(result => {
            return JSON.parse(result);
        });
    } catch (error) {
        
        console.error(error);
        return null;
    }
}

const getTicketTypes = async () => {

}

const getUserTypes = async (address, username, password) => {
    try {
        console.log(username, password);
        return await fetch(`${address}/usertypes/`, {
            method: 'GET',
            headers: {
                "username": username,
                "password": password,
            },
        })
        .then(result => {return Promise.all([result.status, result.text()])})
        .then(result => {
            const response = JSON.parse(result[1]);
            return {
                status: result[0],
                body: response
            }
        })
    } catch (err) {
        console.error(err);
        return null;
    }
}

export { getUserTypes, postLogin, getUsers, getTickets, putUsers, putTickets, postUsers, postTickets, deleteUsers, deleteTickets, getFile, postFile };
