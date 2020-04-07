const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

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
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      userdata: doc,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  // find email
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res
        .status(403)
        .json({ loginSuccess: false, message: "Email not found. Try again." });

    // check password
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res
          .status(403)
          .json({ loginSuccess: false, message: "Wrong password. Try again." });

      // generate a token
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        res.cookie("user_token", user.token).status(200).json({
          loginSuccess: true,
          token: user.token,
        });
      });
    });
  });
});

app.post("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    dialogs: req.user.dialogs,
  });
});

app.post("/api/users/addContact", (req, res) => {
  const { userId, contactId } = req.body;
  User.find({
    _id: {
      $in: [
        mongoose.Types.ObjectId(userId),
        mongoose.Types.ObjectId(contactId),
      ],
    },
  }).exec((err, docs) => {
    const user = docs.find((doc) => doc.id === userId);
    const contact = docs.find((doc) => doc.id === contactId);

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
          contactId: userId,
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
                    userData: [userdoc, contactdoc, dialogdoc],
                  });
                } else {
                  res.status(401).json({
                    error: err,
                  });
                }
              });
            } else {
              res.status(400).json({
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
      console.log(dialog);
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

const port = 3001;
app.listen(port, () => {
  console.log(`Server runnig at ${port}`);
});
