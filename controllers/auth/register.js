const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const idGenerate = require("bson-objectid");

const { User } = require("../../models/user");

const { createError, sendMail } = require("../../helpers");

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw createError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = idGenerate();
  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const mail = {
    to: email,
    subject: "Подтверждение регистрации",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Подтвердить</a>`,
  };

  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
      avatarURL: result.avatarURL,
    },
  });

  await sendMail(mail);
};

module.exports = register;
