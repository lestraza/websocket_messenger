const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//Middleware
const { auth } = require("./middleware/auth");

//Models
const { User } = require("./models/user");
const { Dialog } = require("./models/dialog");

//=====================================
//              USERS
//=====================================

app.post("/api/users/register", (req, res) => {
  const newUser = new User(req.body);
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      return res.status(403).json({
        loginSuccess: false,
        message:
          "A user with this email already exists. Try other email again.",
      });
    } else {
      newUser.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
          success: true,
          userdata: doc,
        });
      });
    }
  });
});

app.post("/api/users/login", (req, res) => {
  // find email
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user || err)
      return res
        .status(403)
        .json({ loginSuccess: false, message: "Email not found. Try again." });

    // check password
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch || err)
        return res
          .status(403)
          .json({ loginSuccess: false, message: "Wrong password. Try again." });

      // generate a token
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        res.cookie("user_token", user.token).status(200).json({
          loginSuccess: true,
          token: user.token,
          id: user._id,
        });
      });
    });
  });
});

app.post("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    isAuth: true,
    id: req.user._id,
    avatarUrl: res.avatarUrl,
    name: req.user.name,
    lastname: req.user.lastname,
    dialogs: req.user.dialogs,
  });
});

app.post("/api/users/addAvatar", (req, res) => {
  const { avatarUrl } = req.body;
  User.findOne({ _id: req.body }, (err, user) => {
    if (user) {
      user.avatarUrl = avatarUrl;
      user.save((err, doc) => {
        res.status(200).json({
          success: true,
          userData: doc,
        });
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Cannot find user.",
      });
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
          success: true,
          userData: doc,
        });
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Cannot find user.",
      });
    }
  });
});

//=====================================
//              DIALOG
//=====================================
app.post("/api/users/findContact", (req, res) => {
  // find email
  const { email } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (!user || err) {
      return res
        .status(403)
        .json({ loginSuccess: false, message: "Email not found. Try again." });
    }
    if (user) {
      res.status(200).json({
        id: user._id,
        avatarUrl: user.avatarUrl,
        name: user.name,
        lastname: user.lastname,
      });
    }
  });
});

app.post("/api/users/addContact", (req, res) => {
  const { clientId, contactId } = req.body;
  console.log(clientId, contactId);
  User.find({
    _id: {
      $in: [
        mongoose.Types.ObjectId(clientId),
        mongoose.Types.ObjectId(contactId),
      ],
    },
  }).exec((err, docs) => {
    const user = docs.find((doc) => doc.id === clientId);
    const contact = docs.find((doc) => doc.id === contactId);
    console.log(user, contact);
    if (user && contact) {
      if (!user.contacts.includes(contactId)) {
        const dialog = new Dialog({
          messages: [],
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
        //user.dialogs.push(dialog.id)
        // contact.dialogs.push(dialog.id)
        dialog.save((err, dialogdoc) => {
          if (err) return res.json({ success: false, err });

          user.save((err, userdoc) => {
            if (!err) {
              contact.save((err, contactdoc) => {
                if (!err) {
                  res.status(200).json({
                    success: true,
                    contacts: contactdoc,
                  });
                } else {
                  res.status(401).json({
                    error: err,
                  });
                }
              });
            } else {
              res.status(401).json({
                error: err,
              });
            }
          });
        });
      }
    }
  });
});
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
          success: true,
          doc,
        });
      });
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
