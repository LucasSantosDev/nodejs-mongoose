const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    age: Number,
    password: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword;
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
