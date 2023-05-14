const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Создаем модель для палаты
const roomSchema = new Schema({
  number: {
    type: Number,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
});

const Room = mongoose.model("Room", roomSchema);
//экспортируем модель
module.exports = Room;
