import { useContext } from "react";
import { AppContext } from "../App";

function RoomInfo() {
  const { userBookedRoom, setUserBookedRoom } = useContext(AppContext);

  const handleRoomDelete = () => {
    fetch("http://localhost:8080/delete-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userBookedRoom),
    })
      .then((response) => response.json())
      .then(() => setUserBookedRoom(undefined))
      .catch((error) => console.error(error));
    location.reload();
  };

  return (
    <div className="room-info">
      <h1 className="info-title">Ваша заброньована палата:</h1>
      {/* если забронированная палата есть, то выводим данные о ней */}
      {userBookedRoom ? (
        <>
          <h1 className="info-number">Палата №{userBookedRoom.number}</h1>
          <p className="info-type">{userBookedRoom.type}</p>
          <p className="info-description">{userBookedRoom.description}</p>
          <p className="info-start-date">
            Дата заселення: {userBookedRoom.startDate}
          </p>
          <p className="info-end-date">
            Дата виселення: {userBookedRoom.endDate}
          </p>
          <p className="info-price">
            Ціна за {userBookedRoom.amountOfDays} доби:{" "}
            {userBookedRoom.fullPrice} грн
          </p>
          <h6 onClick={handleRoomDelete}>Скасувати бронювання</h6>
        </>
      ) : (
        // если палата еще не забронирована то выводим соответствующую информацию
        <p className="info-warning">У вас немає заброньованої палати</p>
      )}
    </div>
  );
}

export default RoomInfo;
