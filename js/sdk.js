const SDK = {
        serverURL: "http://localhost:8080/api",
        request: (options, callback) => {

            let headers = {};
            if (options.headers) {
                Object.keys(options.headers).forEach((h) => {
                    headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
                });
            }

            $.ajax({
                url: SDK.serverURL + options.url,
                method: options.method,
                headers: headers,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(SDK.encrypt(JSON.stringify(options.data))),
                success: (data, status, xhr) => {
                    callback(null, SDK.decrypt(data), status, xhr);
                },
                error: (xhr, status, errorThrown) => {
                    callback({xhr: xhr, status: status, error: errorThrown});
                }
            });
        },

        login: (username, password, callback) => {
            SDK.request({
                data: {
                    username: username,
                    password: password
                },
                url: "/user/login",
                method: "POST"
            }, (err, data) => {

                if (err) return callback(err);
                SDK.Storage.persist("Token", data);

                callback(null, data);
            });
        },


        signup: (newUsername, newPassword, callback) => {
            SDK.request({
                data: {
                    username: newUsername,
                    password: newPassword
                },
                url: "/user/signup",
                method: "POST"
            }, (err, data) => {
                if (err) return callback(err);

                callback(null, data);
            });
        },

        loadCurrentUser: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/myuser",
                headers: {
                    authorization: SDK.Storage.load("Token"),
                },
            }, (err, user) => {
                if (err) return cb(err);
                SDK.Storage.persist("User", user);
                cb(null, user);
            });
        },

        currentUser: () => {
            const loadedUser = SDK.Storage.load("User");
            return loadedUser.currentUser;
        },

        logOut: (userId, cb) => {
            SDK.request({
                method: "POST",
                url: "/user/logout",
                data: userId,
            }, (err, data) => {
                if (err) return cb(err);

                cb(null, data);
            });

        },


        loadmenu: (cb) => {
            $("#nav-container").load("menu.html", () => {
                    const currentUser = SDK.currentUser();
                    const userId = currentUser.userId;

                    $(".navbar-right").html(`<li><a href="#" id="logout-link">Log out</a></li>`);

                    $("#logout-link").click(() => {
                        SDK.logOut(userId, (err, data) => {
                            if (err && err.xhr.status == 401) {
                                $(".form-group").addClass("has-error");
                            } else {
                                window.location.href = "login.html";
                                SDK.Storage.remove("User")
                                SDK.Storage.remove("token")
                            }
                        })
                    });
                    cb;
                }
            );

        },

        Storage:
            {
                prefix: "DøkQuizSDK",
                persist:
                    (key, value) => {
                        window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
                    },
                load:
                    (key) => {
                        const val = window.localStorage.getItem(SDK.Storage.prefix + key);
                        try {
                            return JSON.parse(val);
                        }
                        catch (e) {
                            return val;
                        }
                    },
                remove:
                    (key) => {
                        window.localStorage.removeItem(SDK.Storage.prefix + key);
                    }

            }
        ,

        encrypt: (encrypt) => {
            if (encrypt !== undefined && encrypt.length !== 0) {
                const key = ['L', 'Y', 'N'];
                let isEncrypted = "";
                for (let i = 0; i < encrypt.length; i++) {
                    isEncrypted += (String.fromCharCode((encrypt.charAt(i)).charCodeAt(0) ^ (key[i % key.length]).charCodeAt(0)))
                }
                return isEncrypted;
            } else {
                return encrypt;
            }
        },

        decrypt:
            (decrypt) => {
                if (decrypt !== undefined && decrypt.length !== 0) {
                    const key = ['L', 'Y', 'N'];
                    let isDecrypted = "";
                    for (let i = 0; i < decrypt.length; i++) {
                        isDecrypted += (String.fromCharCode((decrypt.charAt(i)).charCodeAt(0) ^ (key[i % key.length]).charCodeAt(0)))
                    }
                    return isDecrypted;
                } else {
                    return decrypt;
                }
            },
    }
;
