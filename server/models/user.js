const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Создаем модель для пользователя
const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  surname: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("User", userSchema);
//экспортируем модель
module.exports = User;
