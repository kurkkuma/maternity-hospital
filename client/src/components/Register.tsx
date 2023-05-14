import { useState, useContext } from "react";

import { AppContext } from "../App";

function Register() {
  //берем данные для слайда из контекста
  const { regData } = useContext(AppContext);
  //стейты для хранения данных которые ввел пользователь при регистрации
  const [regName, setRegName] = useState<string>("");
  const [regSurname, setRegSurname] = useState<string>("");
  const [regPhone, setRegPhone] = useState<string>("+380");
  const [regPassword, setRegPassword] = useState<string>("");
  //массив с ошибками для валидации данных при регистрации
  const [errors, setErrors] = useState<string[]>([]);
  //стейт для хранения значения если пароль уже занят
  const [phoneError, setPhoneError] = useState<boolean>(false);
  //стейт для хранения текущего индекса слайда
  const [activeIndex, setActiveIndex] = useState<number>(0);
  //функция проверки и отправки данных регистрации
  const handleRegister = (e: any) => {
    e.preventDefault();
    let newErrors: Array<string> = [];
    //проверка каждого ввода на валидность, в случае ошибки пополняем массив ошибок
    if (regName.trim().length === 0) {
      newErrors.push("Ваше ім'я повинне містити хоча б 1 букву");
    }
    if (regSurname.trim().length === 0) {
      newErrors.push("Ваше прізвище повинне містити хоча б 1 букву");
    }
    if (regPhone.trim().length !== 13) {
      newErrors.push(
        "Номер телефону повинен обов'язково містити +380 та бути довжиною 13 символів"
      );
    }
    if (regPassword.trim().length < 6) {
      newErrors.push("Пароль має бути довжиною 6 або більше символів");
    }
    //сохраняем все ошибки в стейт
    setErrors(newErrors);
    //если валидация прошла успешно и нет ошибок, сохраняем данные и отправляем на сервер
    if (newErrors.length === 0) {
      const data = {
        name: regName,
        surname: regSurname,
        phone: regPhone,
        password: regPassword,
      };
      //отправка данных на сервер
      fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.status === 409) {
            //если номер телефона уже занят то меняем значение ошибки на true что бы предупредить пользователя
            setPhoneError(true);
            throw new Error("this phone is already taken");
          }
          //если все в порядке убираем ошибку
          setPhoneError(false);
          return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  };

  //смена индекса текущего слайда каждые 8 секунд
  setTimeout(() => {
    setActiveIndex(activeIndex == regData.length - 1 ? 0 : activeIndex + 1);
  }, 8000);

  return (
    <div className="reg-container">
      <div className="reg-info">
        <p className="info-title">Чому вам варто зареєструватись?</p>
        <img
          src="images/slider/register.jpg"
          alt="register-img"
          className="info-img"
        />
        {regData.map((info, index) => {
          if (index === activeIndex) {
            return (
              <p key={index} className="info-description">
                {info}
              </p>
            );
          }
        })}
      </div>
      <div className="reg-register">
        <img src="images/icons/list.png" alt="list-icon" className="reg-img" />
        <h1 className="reg-title">Реєстрація</h1>
        <form className="reg-form">
          <input
            name="name"
            type="text"
            placeholder="Ваше ім'я"
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
          />
          <input
            name="surname"
            type="text"
            placeholder="Ваше прізвище"
            value={regSurname}
            onChange={(e) => setRegSurname(e.target.value)}
          />
          <input
            name="phone"
            type="tel"
            placeholder="Номер телефону"
            value={regPhone}
            onChange={(e) => setRegPhone(e.target.value)}
            maxLength={13}
          />
          <input
            name="password"
            type="text"
            placeholder="Створіть пароль"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />
          {/* если массив с ошибками НЕ пуст, то выводим информацию для
          пользователя */}
          {errors.length > 0 &&
            errors.map((error, index) => {
              return (
                <p key={index} className="form-error">
                  {error}
                </p>
              );
            })}
          {/* если такой пароль уже занят то информируем пользователя */}
          {phoneError && (
            <p className="form-error">Такий номер телефону вже зайнятий</p>
          )}
          <button onClick={handleRegister} className="form-submit">
            Зберегти<span></span>
          </button>
        </form>
        <p className="reg-gratitude">Дякуємо за довіру!</p>
      </div>
    </div>
  );
}

export default Register;
