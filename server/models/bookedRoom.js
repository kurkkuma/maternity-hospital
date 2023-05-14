const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Создаем модель для палаты
const bookedRoomSchema = new Schema({
  userId: {
    type: String,
    require: true,
  },
  roomId: {
    type: String,
    require: true,
  },
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
  startDate: {
    type: String,
    require: false,
  },
  endDate: {
    type: String,
    require: true,
  },
  amountOfDays: {
    type: Number,
    require: true,
  },
  fullPrice: {
    type: Number,
    require: true,
  },
});

const BookedRoom = mongoose.model("BookedRoom", bookedRoomSchema);
//экспортируем модель
module.exports = BookedRoom;
