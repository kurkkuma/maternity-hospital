function AppointmentBooking() {
  return (
    <div className="appointment-booking">
      <h1 className="booking-title">Запишіться на прийом</h1>
      <div className="booking-label-conainer">
        <label htmlFor="doctor-speciality">Виберіть спеціальність: </label>
        <select id="doctor-speciality" name="doctor-speciality">
          <option value="">гинеколог</option>
          <option value="">терапевт</option>
        </select>
      </div>
      <div className="booking-label-conainer">
        <label htmlFor="doctor-name">Виберіть лікаря: </label>
        <select id="doctor-name" name="doctor-name">
          <option value="">имя 1</option>
          <option value="">имя 2</option>
        </select>
      </div>
      <div className="booking-label-conainer">
        <label htmlFor="doctor-date">Виберете день тижня: </label>
        <select id="doctor-date" name="doctor-date">
          <option value="">дата 1</option>
          <option value="">дата 2</option>
        </select>
      </div>
      <div className="booking-label-conainer">
        <label htmlFor="doctor-time">Виберіть час: </label>
        <select id="doctor-time" name="doctor-time">
          <option value="">время 1</option>
          <option value="">время 2</option>
        </select>
      </div>
      <p className="booking-office">Кабинет №103</p>
      <p className="booking-date">Дата: 2023-05-20 Понедилок</p>

      <button className="booking-btn">
        Записатись<span></span>
      </button>
    </div>
  );
}

export default AppointmentBooking;
