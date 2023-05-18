const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const con = require("./connection");
// Создаем экземпляр приложения Express
const app = express();
//подключение к бд
con.connect((error) => {
  if (error) console.log(error);
  console.log("Connected to db");
});
//устраняем ошибку политики безопасности CORS
app.use(cors());
// Регистрируем парсер формата JSON в приложении, чтобы можно было работать с данными, переданными в теле запроса, позволяет Express правильно распознавать JSON и URL-encoded данные, переданные в запросе, и обрабатывать их
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("hello :)");
});

//получаем все палаты с бд
app.get("/rooms", (req, res) => {
  try {
    //делаем запрос на все палаты
    const sql = "SELECT * FROM rooms";
    con.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        res.send("Database error");
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    res.send("Server error");
  }
});
//получаем все забронированные палаты
app.get("/booked-rooms", (req, res) => {
  try {
    //запрос на все забронированные палаты
    const sql = "SELECT * FROM booked_rooms";
    con.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        res.send("Database error");
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.log(error);
  }
});
//получаем всех врачей
app.get("/doctors", (req, res) => {
  try {
    //запрос на всех врачей с бд
    const sql = "SELECT * FROM doctors";
    con.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        res.send("Database error");
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.log(error);
  }
});
//получаем записи на прием
app.get("/appointments", (req, res) => {
  try {
    //запрос на все записи на прием с бд
    const sql = "SELECT * FROM appointments";
    con.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        res.send("Database error");
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.log(error);
  }
});
//регистрация
app.post("/register", (req, res) => {
  const { name, surname, phone, password } = req.body;
  //запрос на вставку в таблицу нового пользователя
  const sql = "INSERT INTO users(name,surname,phone,password) VALUES(?,?,?,?)";
  con.query(sql, [name, surname, phone, password], (error, result) => {
    if (error) console.log(error);
    res.send(`${result.surname} added to db`);
  });
});
//авторизация
app.post("/login", async (req, res) => {
  try {
    const { surname, password } = req.body;
    //поиск пользователя в базе данных
    const sql = "SELECT * FROM users WHERE surname = ? AND password = ?";
    con.query(sql, [surname, password], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        //обработка успешного результата
      } else if (result.length > 0) {
        res.status(200).json(result[0]);
        //обработка неудачного результата
      } else {
        res.status(401).json({ message: "This user does not exist" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//бронированние палаты и изменение статуса
app.post("/add-booked-room", (req, res) => {
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
  //запрос на добавление данных о забронированной палаты
  const sql =
    "INSERT INTO booked_rooms(user_id, room_id, number, type, description, start_date, end_date, amount_days, full_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  con.query(
    sql,
    [
      userId,
      roomId,
      number,
      type,
      description,
      startDate,
      endDate,
      amountOfDays,
      fullPrice,
    ],
    (error, result) => {
      if (error) {
        console.log(error);
        res.send("Database error");
      } //если ошибки нет то меняем статус палаты на забронированный
      else {
        const sql = "UPDATE rooms SET status = 'booked' WHERE id = ?";
        con.query(sql, [roomId], (error, result) => {
          if (error) {
            console.log(error);
            res.send("Database error");
          } else {
            res.send(result);
          }
        });
      }
    }
  );
});
//отменить забронированную палату
app.post("/delete-room", (req, res) => {
  const { id, room_id } = req.body;

  const sql1 = "DELETE FROM booked_rooms WHERE id = ?";
  con.query(sql1, [id], (error, result) => {
    if (error) {
      console.log(error);
      res.send("Database error");
    } else {
      const sql2 = "UPDATE rooms SET status = 'free' WHERE id = ?";
      con.query(sql2, [room_id], (error, result) => {
        if (error) {
          console.log(error);
          res.send("Database error");
        } else {
          res.send(result);
        }
      });
    }
  });
});
//записаться на прием
app.post("/make-appointment", (req, res) => {
  const { user_id, doctor_id, speciality, name, office, date, time, schedule } =
    req.body;

  const sql =
    "INSERT INTO appointments(user_id, doctor_id, speciality, name, office, date, time) VALUES (?, ?, ?, ?, ?, ?, ?)";

  con.query(
    sql,
    [user_id, doctor_id, speciality, name, office, date, time],
    (error, result) => {
      if (error) {
        console.log(error);
        res.send("Database error");
      } else {
        const doctorSchedule = schedule;
        // Извлекаем день недели (индекс) из выбранной даты
        const dayOfWeek = new Date(date.slice(0, 10)).getDay();
        // Удаляем забронированное время из графика работы выбранного дня
        const filteredSchedule = doctorSchedule[dayOfWeek].filter(
          (t) => t !== time
        );
        // Обновляем объект графика работы выбранного доктора
        doctorSchedule[dayOfWeek] = filteredSchedule;
        // Преобразуем обновленный график работы обратно в формат JSON
        const filteredScheduleJSON = JSON.stringify(doctorSchedule);
        // Обновляем график работы в базе данных для выбранного доктора
        const updateDoctorScheduleSql =
          "UPDATE doctors SET schedule = ? WHERE id = ?";
        con.query(
          updateDoctorScheduleSql,
          [filteredScheduleJSON, doctor_id],
          (error, result) => {
            if (error) {
              console.log(error);
              res.send("Database error");
            } else {
              res.send("Appointment booked successfully");
            }
          }
        );
      }
    }
  );
});
//удалить запись на прием
app.post("/delete-appointment", (req, res) => {
  const { id, doctor_id, date, time } = req.body;
  //запрос на удаление приема
  const deleteAppointmentSql = "DELETE FROM appointments WHERE id = ?";
  con.query(deleteAppointmentSql, [id], (error, result) => {
    if (error) {
      console.log(error);
      res.send("Database error");
    } //если прием удалился успешно то добовляем обратно время в свободные окошки врача
    else {
      const getDoctorScheduleSql = "SELECT schedule FROM doctors WHERE id = ?";
      con.query(getDoctorScheduleSql, [doctor_id], (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Database error");
        }
        if (result.length === 0 || !result[0].schedule) {
          console.log("Doctor schedule not found");
          return;
        }
        //берем из результата запроса график доктора и парсим в объект
        const doctorSchedule = JSON.parse(result[0].schedule);
        // Извлекаем день недели (индекс) из выбранной даты
        const dayOfWeek = new Date(date.slice(0, 10)).getDay().toString();
        // Получаем массив свободных временных слотов для выбранного дня недели
        const availableTimes = doctorSchedule[dayOfWeek] || [];
        // Добавляем время записи на прием в массив свободных временных слотов
        availableTimes.push(time);
        // Отсортировываем массив свободных временных слотов по возрастанию времени
        availableTimes.sort();
        //запрос на обновление графика работы врача
        const updateDoctorScheduleSql =
          "UPDATE doctors SET schedule = ? WHERE id = ?";
        //к прошлому графику добавляем обновленный день с обновленными окошками
        const updatedSchedule = JSON.stringify({
          ...doctorSchedule,
          [dayOfWeek]: availableTimes,
        });
        //отправляем запрос
        con.query(
          updateDoctorScheduleSql,
          [updatedSchedule, doctor_id],
          (error, result) => {
            if (error) {
              console.log(error);
              res.send("Database error");
            } else {
              res.send("Appointment deleted successfully");
            }
          }
        );
      });
    }
  });
});

// Закрываем соединение с базой данных при остановке сервера
process.on("SIGINT", () => {
  con.end((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Database connection closed");
    }
    process.exit();
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
