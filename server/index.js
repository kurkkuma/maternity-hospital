// Подключаем библиотеку Express для создания сервера
const express = require("express");
const mongoose = require("mongoose");
// Подключаем библиотеку body-parser для парсинга тела запроса в формате JSON
const bodyParser = require("body-parser");
const cors = require("cors");

const User = require("./models/user");
const Room = require("./models/room");
const BookedRoom = require("./models/bookedRoom");
// Создаем экземпляр приложения Express
const app = express();
// Устанавливаем порт, на котором будет запущен сервер. Если переменная окружения PORT не установлена, используем порт 8080
const PORT = process.env.PORT || 8080;
const db =
  "mongodb+srv://kurkkuma:mouse2505@cluster0.h3yjee1.mongodb.net/maternity-hospital-db";

//устраняем ошибку политики безопасности CORS
app.use(cors());

// Регистрируем парсер формата JSON в приложении, чтобы можно было работать с данными, переданными в теле запроса, позволяет Express правильно распознавать JSON и URL-encoded данные, переданные в запросе, и обрабатывать их
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//подключение к бд mongoDB
mongoose
  .connect(db)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

/////////////////////////////////////////////////////
//добавлние новых пользователй при регистрации в бд
app.post("/register", async (req, res) => {
  //Достаем данные с тела запроса
  const { name, surname, phone, password } = req.body;

  try {
    // Проверяем наличие пользователя с таким паролем
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      // Если пользователь уже есть в базе, возвращаем ошибку
      return res.status(409).send("this phone is already taken");
    }
    //если все хорошо, используя модель user собираем новый объект пользователя
    const user = new User({ name, surname, phone, password });
    //сохраняем в бд нового пользователя
    await user.save();
    res.send(user); //отображаем результат
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
//авторизация
app.post("/login", async (req, res) => {
  try {
    const { surname, password } = req.body;
    //поиск пользователя в базе данных
    const user = await User.findOne({ surname, password });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "This user does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//получаем все палаты с бд
app.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    console.log(error);
  }
});
app.get("/booked-rooms", async (req, res) => {
  try {
    const bookedRooms = await BookedRoom.find({});
    res.json(bookedRooms);
  } catch (error) {
    console.log(error);
  }
});
//бронированние палаты и изменение статуса
app.post("/add-booked-room", async (req, res) => {
  const {
    userId,
    roomId,
    number,
    type,
    description,
    startDate,
    endDate,
    amountOfDays,
    fullPrice,
  } = req.body;

  const bookedRoom = new BookedRoom({
    userId,
    roomId,
    number,
    type,
    description,
    startDate,
    endDate,
    amountOfDays,
    fullPrice,
  });
  try {
    //добавляем в базу данных забронированную палату
    const result = await bookedRoom.save();
    //ищем палату что бы изменить ее статус на забронированный
    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      throw new Error("Room not found");
    }
    room.status = "booked";
    await room.save();
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

//запуск сервера
app.listen(PORT, () => {
  try {
    console.log(`server has been started ${PORT}...`);
  } catch (error) {
    console.log(error);
  }
});
