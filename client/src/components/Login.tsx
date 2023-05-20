import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

function Login() {
  //берем данные из контекста
  const { logData, setUser } = useContext(AppContext);
  //используем хук для будущей навигации
  const navigate = useNavigate();
  //данные которые ввел пользователь
  const [logPhone, setLogPhone] = useState<string>("");
  const [logPassword, setLogPassword] = useState<string>("");
  //массив с ошибками для валидации данных при авторизации
  const [errors, setErrors] = useState<string[]>([]);
  //стейт для хранения значения если такой пользователь не найден
  const [userError, setUserError] = useState<boolean>(false);
  //стейт для хранения текущего индекса слайда
  const [activeIndex, setActiveIndex] = useState<number>(0);
  //функция авторизации и отправки введенных данных пользователя
  const handleLogin = (e: any) => {
    e.preventDefault();
    let newErrors = [];
    //проверяем заполнены ли все поля
    if (logPhone.trim().length === 0 || logPassword.trim().length === 0) {
      newErrors.push("Заповніть всі поля");
    }
    //сохраняем все ошибки в стейт
    setErrors(newErrors);
    //если валидация прошла успешно и нет ошибок, сохраняем данные и отправляем на сервер
    if (newErrors.length === 0) {
      const data = {
        phone: logPhone,
        password: logPassword,
      };
      //отправка данных на сервер
      fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.status === 401) {
            //если пароль уже занят то меняем значение ошибки на true что бы предупредить пользователя
            setUserError(true);
            throw new Error("no such user exists");
          }
          //если все в порядке убираем ошибку
          setUserError(false);
          //перекидываем юзера на аккаунт
          navigate("/account");
          return res.json();
        })
        //сохраняем данные полученные с сервера о пользователе в стейт и локальное хранилище
        .then((data) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch((error) => console.error(error));
    }
  };

  //смена индекса текущего слайда каждые 8 секунд
  setTimeout(() => {
    setActiveIndex(activeIndex == logData.length - 1 ? 0 : activeIndex + 1);
  }, 8000);

  return (
    <div className="log-container">
      {/* проходимся по каждому элементу массива с данными о слайдах и если индекс элемента совпадает с текущим индексом слайда то отображаем его      */}
      {logData.map((slide, index) => {
        if (index === activeIndex)
          return (
            <div key={index} className="log-slider">
              <img src={slide.url} alt="slider-img" className="slider-img" />
              <p className="slider-description">{slide.description}</p>
            </div>
          );
      })}

      <div className="log-form">
        <img
          src="./images/icons/holding-hand.png"
          alt="icon-img"
          className="form-img"
        />
        <h1 className="form-greetings">Раді вас вітати!</h1>
        <h3 className="form-description">
          Сайт пологового будинку №50 міста Київ
        </h3>
        <p className="form-title">Увійдіть до свого облікового запису</p>
        <input
          name="phone"
          value={logPhone}
          onChange={(e) => setLogPhone(e.target.value)}
          type="text"
          placeholder="Ваш номер телефону формату"
          className="form-phone"
        />
        <input
          name="password"
          value={logPassword}
          onChange={(e) => setLogPassword(e.target.value)}
          type="password"
          placeholder="Ваш пароль"
          className="form-password"
        />
        {errors.length > 0 &&
          errors.map((error, index) => {
            return (
              <p key={index} className="form-error">
                {error}
              </p>
            );
          })}
        {userError && <p className="form-error">Такого користувача не існує</p>}
        <button className="form-login" onClick={handleLogin}>
          Увійти<span></span>
        </button>

        <p onClick={() => navigate("/register")} className="form-register">
          Створити обліковий запис
        </p>
      </div>
    </div>
  );
}

export default Login;
