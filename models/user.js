const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },

    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", userSchema);

const register = Joi.object({
  subscription: Joi.string(),
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const email = Joi.object({
  email: Joi.string().required(),
});
const schemas = {
  register,
  login,
  email,
};

module.exports = {
  User,
  schemas,
};
