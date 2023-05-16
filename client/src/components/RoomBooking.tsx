import { useContext, useEffect, useState, useMemo } from "react";
import { AppContext } from "../App";

function RoomBooking() {
  //берем из контекста все палаты
  const { user, rooms, userBookedRoom } = useContext(AppContext);
  //фильтруем все палаты и оставляем только свободные
  const freeRooms = useMemo(
    () => rooms.filter((room) => room.status === "free"),
    [rooms]
  );

  //данные которые ввел пользователь
  const [selectedType, setSelectedType] = useState<string>("single"); //по умолчанию тип палаты на одного
  const [selectedNumber, setSelectedNumber] = useState<number | undefined>();
  const [selectedStartDate, setSelectedStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // текущая дата по умолчанию
  const [selectedEndDate, setSelectedEndDate] = useState<string>(
    new Date(Date.parse(selectedStartDate) + 86400000)
      .toISOString()
      .split("T")[0]
  ); //текущая дата + 1 день по умолчанию

  const [roomPrice, setRoomPrice] = useState<number>();
  const [amountOfDays, setAmountOfDays] = useState<number>();
  const [fullPrice, setFullPrice] = useState<number>();

  const [errorRoomExists, setErrorRoomExists] = useState<boolean>(false);
  //установим первый номер свободной палаты по умолчанию
  useEffect(() => {
    setSelectedNumber(
      freeRooms.find((room) =>
        selectedType === "single"
          ? room.number % 2 !== 0
          : room.number % 2 === 0
      )?.number
    );
  }, [freeRooms]);
  //после каждого изменения типа комнаты изменяем цены
  useEffect(() => {
    //находим кол-во дней, конечную и начальную дату переводим в миллисекунды и вычисляем разницу, полученный ответ
    // в миллисекундах делим на количество миллисекунд в одном дне и округляем методом ceil в большую сторону
    const amount = Math.ceil(
      (new Date(selectedEndDate).getTime() -
        new Date(selectedStartDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setAmountOfDays(amount);

    //цена за сутки
    const price =
      selectedType === "single"
        ? freeRooms.find((room) => room.number % 2 != 0)?.price
        : freeRooms.find((room) => room.number % 2 === 0)?.price;
    setRoomPrice(price);

    //если цена за сутки не undefined то считаем польную стоимость
    if (price) {
      setFullPrice(amount * price);
    }
  }, [freeRooms, selectedType, selectedStartDate, selectedEndDate]);
  // в избежании ошибки где начальная дата позже конечной обновлем возможность выбрать конечную дату после каждого изменения начальной
  useEffect(() => {
    setSelectedEndDate(
      new Date(Date.parse(selectedStartDate) + 86400000)
        .toISOString()
        .split("T")[0]
    );
  }, [selectedStartDate]);

  //бронирование палаты (создание объекта забронированной палаты)
  const handleBookRoom = () => {
    //если у пользователя еще нет забронированной палаты то бронируем
    if (!userBookedRoom) {
      const data = {
        userId: user.id,
        roomId: freeRooms.find((room) => room.number === selectedNumber)?.id,
        number: selectedNumber,
        type: freeRooms.find((room) => room.number === selectedNumber)?.type,
        description: freeRooms.find((room) => room.number === selectedNumber)
          ?.description,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        amountOfDays: amountOfDays,
        fullPrice: fullPrice,
      };
      console.log(data);
      fetch("http://localhost:8080/add-booked-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .catch((error) => console.log(error));
      location.reload();
    }
    //если же у пользователя уже есть забронированная палата то выводим ошибку
    setErrorRoomExists(true);
    setTimeout(() => {
      setErrorRoomExists(false);
    }, 7000);
  };

  return (
    <div className="room-booking">
      <h1 className="booking-title">Забронируйте палату</h1>
      <div className="booking-label-conainer">
        <label htmlFor="room-type">Виберіть тип палати: </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          id="room-type"
          name="room-type"
        >
          <option value="single">На одного</option>
          <option value="double">На двох</option>
        </select>
      </div>

      <div className="booking-label-conainer">
        <label htmlFor="room-number">Виберіть номер палати:</label>

        <select
          value={selectedNumber}
          //   приводим строку к числу
          onChange={(e) => setSelectedNumber(parseInt(e.target.value))}
          name="room-number"
          id="room-number"
        >
          {/* выводим свободные номера палат зависимо от выбранного типа */}
          {freeRooms
            .filter((room) =>
              selectedType === "single"
                ? room.number % 2 != 0
                : room.number % 2 === 0
            )
            .map((room, index) => {
              return (
                <option value={room.number} key={index}>
                  {" "}
                  Палата №{room.number}
                </option>
              );
            })}
        </select>
      </div>
      <div className="booking-label-conainer">
        <label htmlFor="start-date">Виберіть дату заселення:</label>
        <input
          value={selectedStartDate}
          onChange={(e) => setSelectedStartDate(e.target.value)}
          //добавляем ограничения что бы выбор даты начинался с текущего дня
          min={new Date().toISOString().split("T")[0]}
          type="date"
          id="start-date"
        />
      </div>
      <div className="booking-label-conainer">
        <label htmlFor="end-dater">Виберіть дату виселення:</label>

        <input
          value={selectedEndDate}
          onChange={(e) => setSelectedEndDate(e.target.value)}
          //добавляем ограничения что бы выбор даты начинался со следующего дня относительно начальной даты
          min={
            new Date(Date.parse(selectedStartDate) + 86400000)
              .toISOString()
              .split("T")[0]
          }
          type="date"
          id="end-date"
        />
      </div>
      <p className="booking-price">
        {/* в зависимости от типа палаты показываем цену за сутку */}
        {roomPrice} грн/добу
      </p>
      <p className="booking-price">
        Ціна за {amountOfDays} доби: {fullPrice} грн
      </p>

      <button onClick={handleBookRoom} className="booking-btn">
        Забронювати палату<span></span>
      </button>
      {errorRoomExists && (
        <p className="booking-error">
          Помилка! Один користувач може мати лише одну заброньовану палату
        </p>
      )}
    </div>
  );
}

export default RoomBooking;
