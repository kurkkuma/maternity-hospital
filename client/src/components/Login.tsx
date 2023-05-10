import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../App";

function Login() {
  //данные о слайдах
  const { logData } = useContext(AppContext);

  const [activeIndex, setActiveIndex] = useState(0);

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
          type="text"
          placeholder="Ваше прізвище"
          className="form-surname"
        />
        <input
          type="password"
          placeholder="Ваш пароль"
          className="form-password"
        />
        <button className="form-login">
          Увійти<span></span>
        </button>
        <Link to="/register" style={{ textDecoration: "none" }}>
          <p className="form-register">Створити обліковий запис</p>
        </Link>
      </div>
    </div>
  );
}

export default Login;
