import { useContext, useState, useEffect } from "react";
import { AppContext } from "../App";
import { DoctorsType } from "../App";

function AppointmentBooking() {
  const { doctors, user } = useContext(AppContext);
  //выбранная специальность врача (задаем значение по умолчанию)
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>(
    doctors[0]?.speciality
  );
  //фильтруем врачей по выбранной специальности
  const filteredDoctors: DoctorsType[] = doctors.filter(
    (doctor) => doctor.speciality === selectedSpeciality
  );
  //ставим по умолчанию имя первого доктора выбранной специальности
  const [selectedName, setSelectedName] = useState<string>(
    filteredDoctors[0]?.name
  );
  //выбранный доктор по имени
  const [selectedDoctor, setSelectedDoctor] = useState(
    filteredDoctors.find((doctor) => doctor.name === selectedName)
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  //парсим и возвращаем объект графика работы выбранного врача
  const schedule = () => {
    if (selectedDoctor && selectedDoctor.schedule)
      return JSON.parse(selectedDoctor?.schedule);
  };

  const getDate = (daysOfWeek: {}) => {
    const result: any[] = [];
    //из объекта графика работы врача делаем массив с днями по которым он работает
    const arrayDays: any = Object.keys(daysOfWeek);
    //проходимся по каждому элементу массива с днем (0-воскреснье-6-суббота) и приобразуем в ближайшую дату и день недели
    for (let i = 0; i < arrayDays.length; i++) {
      const today = new Date();
      const currentDayOfWeek = today.getDay(); // индекс текущего дня недели
      const daysToAdd = arrayDays[i] - currentDayOfWeek;
      const weekDays = [
        "Неділя",
        "Понеділок",
        "Вівторок",
        "Середа",
        "Четверг",
        `П'ятниця`,
        "Субота",
      ];

      // Если день недели уже прошел, добавляем 7 дней
      const daysToAddAdjusted = daysToAdd < 0 ? daysToAdd + 7 : daysToAdd;

      const date = new Date(
        today.getTime() + daysToAddAdjusted * 24 * 60 * 60 * 1000
      );
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // добавляем ведущий ноль, если месяц < 10
      const day = date.getDate().toString().padStart(2, "0"); // добавляем ведущий ноль, если день < 10
      const dayOfWeek = weekDays[date.getDay()];

      result.push(`${year}-${month}-${day} (${dayOfWeek})`);
    }
    return result;
  };
  const getTime = (day: string, schedule: any): string[] => {
    const result: [] = [];
    const dayOfWeek = new Date(day.slice(0, 11)).getDay();
    const selectedSchedule: [] = schedule[dayOfWeek];
    for (let i = 0; i < selectedSchedule?.length; i++) {
      result.push(selectedSchedule[i]);
    }
    return result;
  };

  //обновлем имя первого доктора по умолчанию каждый раз, когда меняется спецаильность врача
  //обновляем значение выбранного доктора
  //обновляем значение выбранной даты
  useEffect(() => {
    const name = doctors.filter(
      (doctor) => doctor.speciality === selectedSpeciality
    )[0].name;
    setSelectedName(name);
    setSelectedDoctor(filteredDoctors.find((doctor) => doctor.name === name));
    setSelectedDate(getDate(schedule())[0]);
  }, [selectedSpeciality]);
  //обновляем значение выбранного времени
  useEffect(() => {
    //массив всъ свободных окошек времени
    const availableTimes: string[] = getTime(selectedDate, schedule());
    //если массив содержит элементы и не содержит выбранное время то ставим по умолчанию первое свободное окошко
    if (availableTimes.length > 0 && !availableTimes.includes(selectedTime)) {
      setSelectedTime(availableTimes[0]);
    }
  }, [selectedDate, selectedSpeciality, schedule]);

  const handleMakeAppointment = () => {
    const data: {} = {
      user_id: user.id,
      doctor_id: selectedDoctor?.id,
      speciality: selectedSpeciality,
      name: selectedName,
      office: selectedDoctor?.office,
      date: selectedDate,
      time: selectedTime,
      schedule: schedule(),
    };
    fetch("http://localhost:8080/make-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch((error) => console.log(error));
    location.reload();
  };

  return (
    <div className="appointment-booking">
      <h1 className="booking-title">Запишіться на прийом</h1>
      <div className="booking-label-conainer">
        <label htmlFor="doctor-speciality">Виберіть спеціальність: </label>
        <select
          value={selectedSpeciality}
          onChange={(e) => setSelectedSpeciality(e.target.value)}
          id="doctor-speciality"
          name="doctor-speciality"
        >
          {/* отображаем все специальности врачей */}
          {/* 1. создаем массив всех специальностей 
          2. Конструктор Set создает новый объект Set, который содержит только уникальные значения из исходного массива специальностей
          3. Array.from для преобразования объекта Set обратно в массив.  */}
          {Array.from(new Set(doctors.map((doctor) => doctor.speciality))).map(
            (speciality, index) => {
              return (
                <option key={index} value={speciality}>
                  {speciality}
                </option>
              );
            }
          )}
        </select>
      </div>
      <div className="booking-label-conainer">
        <label htmlFor="doctor-name">Виберіть лікаря: </label>
        <select
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          id="doctor-name"
          name="doctor-name"
        >
          {/* отображаем только подходящие по выбранной специальности имена врачей */}
          {filteredDoctors.map((doctor, index) => {
            return (
              <option key={index} value={doctor.name}>
                {doctor.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="booking-label-conainer">
        <label htmlFor="doctor-date">Виберете день тижня: </label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          id="doctor-date"
          name="doctor-date"
        >
          {getDate(schedule()).map((day, index) => {
            return (
              <option key={index} value={day}>
                {day}
              </option>
            );
          })}
        </select>
      </div>
      <div className="booking-label-conainer">
        <label htmlFor="doctor-time">Виберіть час: </label>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          id="doctor-time"
          name="doctor-time"
        >
          {getTime(selectedDate, schedule()).map((time, index) => {
            return (
              <option key={index} value={time}>
                {time}
              </option>
            );
          })}
        </select>
      </div>
      <p className="booking-office">Кабинет №{selectedDoctor?.office}</p>
      <p className="booking-date">
        Дата: {selectedDate} {selectedTime}
      </p>

      <button onClick={handleMakeAppointment} className="booking-btn">
        Записатись<span></span>
      </button>
    </div>
  );
}

export default AppointmentBooking;
