import AsyncStorage from "@react-native-async-storage/async-storage";

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

function getBase64(file, onLoadCallback) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const getTokens = async (address, username, password) => {
    try {
        return await fetch(`${address}/api/token/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"password": password, "username": username})
        })
        .then((res) => {return Promise.all([res.status, res.text()])})
        .then((result) => {
            const response = JSON.parse(result[1]);
            console.log(response);
            if (result[0] === 200) {
                AsyncStorage.setItem("accessToken", response.access);
                AsyncStorage.setItem("refreshToken", response.refresh);
            }
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

const refreshToken = async (address) => {
    try {
        let refToken = await AsyncStorage.getItem("refreshToken");
        return await fetch(`${address}/api/token/refresh/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"refresh": refToken})
        })
        .then((res) => {return Promise.all([res.status, res.text()])})
        .then((result) => {
            const response = JSON.parse(result[1]);
            console.log("Refreshing Token...");
            if (result[0] === 200) {
                console.log("ok")
                AsyncStorage.setItem("accessToken", response.access);
            }
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

const userLogin = async (address, username, password) => {
    try {
        let accessToken = (await getTokens(address, username, password)).body.access;
        return await fetch(`${address}/users/${constructParams({username: username})}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        .then((res) => {return Promise.all([res.status, res.text()])})
            .then((result) => {
                const response = JSON.parse(result[1]);
                console.log(response);
                return {
                    status: result[0],
                    body: response.items ? response.items[0] : null
                }
            }
        );
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getUsers = async (address, params={}) => {
    try {
        let accessToken = await AsyncStorage.getItem("accessToken");
        let fetchResponse = await fetch(`${address}/users/${constructParams(params)}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
        })
        .then((res) => {return Promise.all([res.status, res.text()])})
        .then((result) => {
            let response = null;

            if(result[0] === 200)
                response = JSON.parse(result[1]);   

                console.log(response);
            return {
                status: result[0],
                body: response
            }
        }
        );
        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/users/${constructParams(params)}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
                })
                .then((res) => {return Promise.all([res.status, res.text()])})
                .then((result) => {
                    let response = null;

            if(result[0] === 200)
                response = JSON.parse(result[1]);   

                console.log(response);
            return {
                status: result[0],
                body: response
            }
                }
            );
        }
        return fetchResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getTickets = async (address, params={}) => {
    try {
        let accessToken = await AsyncStorage.getItem("accessToken");
        console.log(`${address}/tickets/${constructParams(params)}`);
        let fetchResponse = await fetch(`${address}/tickets/${constructParams(params)}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        .then((res) => {return Promise.all([res.status, res.text()])})
        .then((result) => {

            let response = null;

            if(result[0] === 200)
                response = JSON.parse(result[1]);   

                console.log(response);
            return {
                status: result[0],
                body: response
            }
        }
        );
        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/tickets/${constructParams(params)}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
            .then((res) => {return Promise.all([res.status, res.text()])})
            .then((result) => {
                let response = null;

            if(result[0] === 200)
                response = JSON.parse(result[1]);   

                console.log(response);
            return {
                status: result[0],
                body: response
            }
            }
            );
        }
        return fetchResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const putUsers = async (address, params) => {
    try {
        let accessToken = await AsyncStorage.getItem("accessToken");
        let params_copy = JSON.parse(JSON.stringify(params));
        delete params_copy.id;
        let fetchResponse = await fetch(`${address}/users/?id=${params.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(params_copy)
        })
        .then((res) => {return Promise.all([res.status, res.text()])})
        .then((result) => {
            let response = null;

            if(result[0] === 200)
                response = JSON.parse(result[1]);   

                console.log(response);
            return {
                status: result[0],
                body: response
            }
        }
        );
        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/users/?id=${params.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(params_copy)
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
        }
        return fetchResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const putTickets = async (address, params) => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    let params_copy = JSON.parse(JSON.stringify(params));
    delete params_copy.id;
    try {
        let fetchResponse = await fetch(`${address}/tickets/?id=${params.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(params_copy)
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
        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/tickets/?id=${params.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(params_copy)
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
        }
        return fetchResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const postUsers = async (address, params) => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    try {
        let fetchResponse = await fetch(`${address}/users/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(params)
        })
        .then((res) => {return Promise.all([res.status, res.text()])})
        .then((result) => {
            const response = JSON.parse(result[1]);
            console.log(response);
            console.log(response);
            return {
                status: result[0],
                body: response
            }
        }
        );
        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/users/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(params)
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
        }
        return fetchResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const postTickets = async (address, params) => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    try {
        let fetchResponse = await fetch(`${address}/tickets/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(params)
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
        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/tickets/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                    "username": username,
                    "password": password
                },
                body: JSON.stringify(params)
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
        }
        return fetchResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const deleteUsers = async (address, params) => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    try {
        let fetchResponse = await fetch(`${address}/users/?id=${params.id}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
        })
        .then(res => {
            return {status: res.status, body: null};
        });
        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/users/?id=${params.id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
                })
                .then(res => {
                    return {status: res.status, body: null};
                });
        }
        return fetchResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const deleteTickets = async (address, params) => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    try {
        let fetchResponse = await fetch(`${address}/tickets/?id=${params.id}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
        })
        .then(res => {
            return {status: res.status, body: null};
        });
        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/tickets/?id=${params.id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
                })
                .then(res => {
                    return {status: res.status, body: null};
                });
        }
        return fetchResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getFile = async (address, params) => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    try {
        let fetchResponse = await fetch(`${address}/file/${constructParams(params)}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
        })
        .then(res => {

            return {status:res.status, body: res.blob().then(resBlob => {
                return getBase64(resBlob);
                })
            }
            }
        );

        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/file/${constructParams(params)}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
                })
                .then(res => {

                    return {status:res.status, body: res.blob().then(resBlob => {
                        return getBase64(resBlob);
                        })
                    }
                    }
                );

        }
        return fetchResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const postFile = async (address, fileData) => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    try {
        const uri = fileData.uri;
        const fileName = fileData.name;
        const response = await fetch(uri);
        const fileBlob = await response.blob();
        let fetchResponse = await fetch(`${address}/file/${fileName}/`, {
        method: 'POST',
        headers: {
            "Content-type": fileData.type,
            "Authorization": `Bearer ${accessToken}`
        },
        body: fileBlob
        })
        .then(res => {return Promise.all([res.status, res.text()])})
        .then(result => {
            console.log(result[1]);
            const response = JSON.parse(result[1]);
                    console.log(response);
                    return {
                        status: result[0],
                        body: response
                    }
        });
        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/file/${fileName}/`, {
                method: 'POST',
                headers: {
                    "Content-type": fileData.type,
                    "Authorization": `Bearer ${accessToken}`
                },
                body: fileBlob
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
        }
        return fetchResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getTicketTypes = async (address) => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    try {
        let fetchResponse = await fetch(`${address}/requesttypes/`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        })
        .then((res) => {return Promise.all([res.status, res.text()])})
        .then((result) => {
            console.log(result[1]);
            const response = JSON.parse(result[1]);
            console.log(response);
            return {
                status: result[0],
                body: response
            }
        }
        );
        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/requesttypes/`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
            })
            .then((res) => {return Promise.all([res.status, res.text()])})
            .then((result) => {
                console.log(result[1]);
                const response = JSON.parse(result[1]);
                console.log(response);
                return {
                    status: result[0],
                    body: response
                }
            }
            );
        }
        return fetchResponse;
    } catch (err) {
        console.error(err);
        return null;
    }
}

const getFileTypes = async (address) => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    try {
        let fetchResponse = await fetch(`${address}/filetypes/`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        })
        .then((res) => {return Promise.all([res.status, res.text()])})
        .then((result) => {
            console.log(result[1]);
            const response = JSON.parse(result[1]);
            console.log(response);
            return {
                status: result[0],
                body: response
            }
        }
        );
        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/filetypes/`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
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
        }
        return fetchResponse;
    } catch (err) {
        console.error(err);
        return null;
    }
}

const getUserTypes = async (address) => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    try {
        let fetchResponse = await fetch(`${address}/usertypes/`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
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
        if (fetchResponse.status === 401) {
            accessToken = (await refreshToken(address)).body.access;
            fetchResponse = await fetch(`${address}/usertypes/`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
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
        }
        return fetchResponse;
    } catch (err) {
        console.error(err);
        return null;
    }
}


export {getTokens, constructParams ,userLogin, getFileTypes, getTicketTypes, getUserTypes, getUsers, getTickets, putUsers, putTickets, postUsers, postTickets, deleteUsers, deleteTickets, getFile, postFile };
