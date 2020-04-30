const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path")
const uuid = require("uuid").v1

const multer = require('multer')

require("dotenv").config();

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);



mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/static", express.static(__dirname + '/static'));


//Middleware
const { auth } = require("./middleware/auth");

//Models
const { User } = require("./models/user");
const { Dialog } = require("./models/dialog");

const throwError = (res, errorCode, errorMessage) => {
    return (
        res.status(errorCode).json({
            error: errorMessage
        })
    )
}
//=====================================
//              USERS
//=====================================

app.post("/api/users/register", (req, res) => {
    const newUser = new User(req.body);
    User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            throwError(res, 403, "A user with this email already exists. Try other email again.")
        } else {
            newUser.save((err, doc) => {
                if (err) throwError(res, 403, err);
                res.status(200).json({
                    userdata: doc,
                });
            });
        }
    });
});

app.post("/api/users/login", (req, res) => {

    // find email
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user || err) {
            throwError(res, 403, "Email not found. Try again.")
        } else {
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch || err) {
                    throwError(res, 403, "Wrong password. Try again.")
                } else {
                    user.generateToken((err, user) => {
                        if (err) throwError(res, 403, err)

                        res.cookie("user_token", user.token).status(200).json({
                            token: user.token,
                            id: user._id,
                        });
                    });
                }
            });
        }
    });
});

app.post("/api/users/auth", auth, (req, res) => {
    res.status(200).json({
        isAuth: true,
        id: req.user._id,
        avatarUrl: req.user.avatarUrl,
        name: req.user.name,
        lastname: req.user.lastname,
        contacts: req.user.contacts,
    });
});

const storage = multer.diskStorage({
    destination: __dirname + '/static',
    filename: function (req, file, cb) {
        cb(null, uuid() + path.extname(file.originalname).toLowerCase())
    }
})

const upload = multer({
    storage,
    limits: { fieldSize: 1 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        checkFileType(req, file, cb)
    }
}).single('file')
const checkFileType = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)
    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb((err) => {
            throwError(res, 413, err)
        })
    }
}

app.post("/api/users/addAvatar", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            throwError(res, 413, err)
        } else {
            const avatarUrl = `static/${req.file.filename}`
            res.status(200).json(
                avatarUrl
            );
        }
    })
});

app.post("/api/users/saveAvatar", (req, res) => {
    console.log(req.body);
    const { avatarUrl } = req.body
    User.findOne({ _id: req.body }, (err, user) => {
        if (user) {
            user.avatarUrl = avatarUrl
            user.save((err, doc) => {
                res.status(200).json({
                    userData: doc
                });
            });
        } else {
            throwError(res, 401, "Cannot find user.")
        }
    })
})

app.get("/api/users/getContactById", (req, res) => {
    const { contactId } = req.query;
    console.log(contactId);
    User.findOne({ _id: contactId }, (err, user) => {
        if (user) {
            const { name, lastname, avatarUrl, email, _id } = user;
            res.status(200).json({
                id: _id,
                name,
                lastname,
                email,
                avatarUrl,
            });
        } else {
            throwError(res, 401, "Cannot find user.")
        }
    });
});

app.get("/api/users/getDialogById", (req, res) => {
    const { dialogId } = req.query;

    Dialog.findOne({ _id: dialogId }, (err, dialog) => {
        if (dialog) {
            res.status(200).json(dialog);
        } else {
            throwError(res, 401, "Cannot find dialog.")
        }
    });
});

app.post("/api/users/updateClient", (req, res) => {
    User.findOne({ _id: req.body }, (err, user) => {
        if (user) {
            for (key in req.body) {
                if (key !== "_id" && req.body[key] !== "") {
                    user[key] = req.body[key];
                }
            }
            user.save((err, doc) => {
                res.status(200).json({
                    userData: doc
                });
            });
        } else {
            throwError(res, 401, "Cannot find user.")
        }
    });
});

//=====================================
//              SOCKET
//=====================================
connections = [];

io.sockets.on("connection", (socket) => {
    connections.push(socket);
    socket.on("disconnect", () => {
        connections.splice(connections.indexOf(socket), 1);
    });

    socket.on("joinChat", (dialogId) => {
        socket.join(dialogId);
    });
    socket.on("leaveChat", (dialogId) => {
        socket.leave(dialogId);
    });

    socket.on("sendMessage", (dialogMessage) => {
        let socketsInRoom = 0;
        for (key in socket.rooms) {
            if (key) {
                socketsInRoom++;
            }
        }
        if (socketsInRoom < 3) {
            const filteredSocket = connections.find(
                (socket) => socket.handshake.query.id === dialogMessage.contactId
            );
            if (filteredSocket) {
                socket.broadcast
                    .to(filteredSocket.id)
                    .emit("inviteToChat", dialogMessage.id);
            }
        }
        saveMessageToHistory(dialogMessage);
        // const rooms = connections.map( socket => socket.rooms)
        // console.log(rooms);
        socket.broadcast
            .to(dialogMessage.dialogId)
            .emit("receiveMessage", dialogMessage);
    });
});

const saveMessageToHistory = (dialogMessage) => {
    Dialog.findOne({
        _id: dialogMessage.dialogId,
    }).exec((err, dialog) => {
        if (dialog) {
            dialog.messages.push(dialogMessage);
            dialog.save((err, doc) => { });
        }
    });
};
app.post("/api/users/findContact", (req, res) => {
    // find email
    const { email } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (!user || err) throwError(res, 403, "Email not found. Try again.")
        if (user) {
            res.status(200).json({
                id: user._id,
                avatarUrl: user.avatarUrl,
                name: user.name,
                email: user.email,
                lastname: user.lastname,
            });
        }
    });
});

app.post("/api/users/addContact", (req, res) => {
    const { clientId, contactId } = req.body;
    User.find({
        _id: {
            $in: [
                mongoose.Types.ObjectId(clientId),
                mongoose.Types.ObjectId(contactId),
            ],
        },
    })
        .exec((err, docs) => {
            const user = docs.find((doc) => doc.id === clientId);
            const contact = docs.find((doc) => doc.id === contactId);
            if (user && contact) {
                const isAlreadyContact = user.contacts.some(
                    (contact) => contact.contactId === contactId
                );
                if (!isAlreadyContact) {
                    Dialog.findOne().where({
                        participants: {
                            $in: [clientId, contactId]
                        }
                    }).exec((err, dialog) => {
                        if (!dialog) {
                            const dialog = new Dialog({
                                messages: [],
                                participants: [clientId, contactId]
                            });

                            const dialogId = dialog.id;
                            user.contacts.push({
                                contactId,
                                dialogId,
                            });
                            contact.contacts.push({
                                contactId: clientId,
                                dialogId,
                            });
                            dialog.save((err, dialogdoc) => {
                                if (err) return res.json(err);
                            })

                        } else {
                            const dialogId = dialog.id;
                            user.contacts.push({
                                contactId,
                                dialogId,
                            });
                        }
                        user.save((err, userdoc) => {
                            if (!err) {
                                contact.save((err, contact) => {
                                    if (!err) {
                                        res.status(200).json(contact);
                                    } else {
                                        throwError(res, 401, err)
                                    }
                                });
                            } else {
                                throwError(res, 401, err)
                            }
                        });
                    })
                };
            } else {
                throwError(res, 401, err)
            }
        })
});

app.post("/api/users/deleteContact", (req, res) => {
    const { clientId, contactId } = req.body;
    User.findOne({ _id: clientId }).exec((err, user) => {
        const contact = user.contacts.find(contact => contact.contactId === contactId)
        if (contact) {
            user.contacts.remove(contact)
            user.save((error, user) => {
                res.status(200).json(user.contacts);
                if (error) {
                    throwError(res, 401, error)
                }
            })
        }
    })
})
//=====================================
//              DIALOG
//=====================================

app.post("/api/messages/addMessage", (req, res) => {
    const { dialogId, message } = req.body;
    Dialog.findOne({
        _id: { $in: mongoose.Types.ObjectId(dialogId) },
    }).exec((err, dialog) => {
        if (dialog) {
            dialog.messages.push(JSON.stringify(message));
            dialog.save((err, doc) => {
                res.status(200).json({
                    doc,
                });
            });
        } else {
            throwError(res, 403, err)
        }
    });
});

const port = process.env.PORT || 3006;
// app.listen(port, () => {
//     console.log(`Server runnig at ${port}`);
// });

server.listen(port, () => {
    console.log(`Server runnig at ${port}`);
});
