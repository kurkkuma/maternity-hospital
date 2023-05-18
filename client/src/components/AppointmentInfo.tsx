import { useContext } from "react";
import { AppContext } from "../App";

function AppointmentInfo() {
  const { userAppointments, setUserAppointments } = useContext(AppContext);

  const handleDeleteAppointment = (index: number) => {
    if (userAppointments) {
      fetch("http://localhost:8080/delete-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userAppointments[index]),
      })
        .then(() =>
          setUserAppointments(
            userAppointments.filter((_, index0) => index0 !== index)
          )
        )
        .catch((error) => console.error(error));
      console.log(userAppointments[index]);
    }
  };
  return (
    <div className="appointment-info">
      <h1 className="info-title">Ваші записи на прийоми:</h1>
      {userAppointments && userAppointments?.length > 0 ? (
        userAppointments.map((appointment, index) => {
          return (
            <div key={index}>
              <h1 className="info-date">
                {appointment.date} {appointment.time}
              </h1>
              <p className="info-speciality">
                Спеціальність: {appointment.speciality}
              </p>
              <p className="info-name">Ваш лікар: {appointment.name}</p>
              <p className="info-office">Кабинет №{appointment.office}</p>

              <h6 onClick={() => handleDeleteAppointment(index)}>
                Скасувати запис
              </h6>
            </div>
          );
        })
      ) : (
        // если палата еще не забронирована то выводим соответствующую информацию
        <p className="info-warning">У вас немає записів на прийом</p>
      )}
    </div>
  );
}

export default AppointmentInfo;
