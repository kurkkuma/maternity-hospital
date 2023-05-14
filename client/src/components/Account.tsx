import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

function Account() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="acc-container">
      <header className="acc-header">
        <p className="header-title">Сайт пологового будинку №50 міста Київ</p>
        <div className="header-user-info">
          <img
            className="header-user-icon"
            src="images/side-panel/user-dark.png"
            alt="user-icon"
          />
          <h1 className="header-user-name">
            {user.name} {user.surname}
          </h1>
          {/* <h1>{user.phone}</h1> */}
        </div>
        <div className="header-points">
          <p className="active">Забронювати палту</p>
          <p>Записатись на прийом до лікаря</p>
        </div>
      </header>
      <div className="acc-side-panel">
        <img src="images/side-panel/user-light.png" alt="" />

        <img src="images/side-panel/information.png" alt="" />

        <a href="http://facebook.com" target="_blank" rel="noopener noreferrer">
          <img src="images/side-panel/facebook.png" alt="" />
        </a>
        <a
          href="http://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="images/side-panel/instagram.png" alt="" />
        </a>
        <a href="http://telegram.com" target="_blank" rel="noopener noreferrer">
          <img src="images/side-panel/telegram.png" alt="" />
        </a>

        <a href="http://whatsapp.com" target="_blank" rel="noopener noreferrer">
          <img src="images/side-panel/whatsapp.png" alt="" />
        </a>

        <img
          onClick={() => navigate("/")}
          className="panel-logout"
          src="images/side-panel/logout.png"
          alt=""
        />
      </div>
      <div className="acc-room">
        <div className="room-info">
          <h1 className="info-title">Ваша заброньована палата:</h1>
          <h1 className="info-number">номпер палаты 13</h1>
          <p className="info-name">название палаты</p>
          <p className="info-description">
            Палата на одну особу: включає цілодобове медичне обслуговування,
            індивідуальний догляд, зручне ліжко, особистий санвузол та смачне
            харчування для матері, а також різні зручності, а також різні
            медичні приладдя, інструменти та обладнання для пологів
          </p>
          <p className="info-start-date">Дата заселение 23-05-2023</p>
          <p className="info-end-date">Дата заселение 30-05-2023</p>
          <p className="info-price">цена палаты</p>
          <h6>Скасувати бронювання</h6>
        </div>
        <div className="room-book">
          <h1 className="book-title">Забронируйте палату</h1>
          <div className="book-label-conainer">
            <label htmlFor="room-type">Виберіть тип палати: </label>
            <select id="room-type" name="room-type">
              <option value="single">На одного</option>
              <option value="double">На двох</option>
            </select>
          </div>

          <div className="book-label-conainer">
            <label htmlFor="room-number">Виберіть номер палати:</label>

            <select name="room-number" id="room-number">
              <option value="1">1</option>
              <option value="1">1</option>
              <option value="1">1</option>
            </select>
          </div>
          <div className="book-label-conainer">
            <label htmlFor="start-date">Виберіть дату заселення:</label>
            <input type="date" id="start-date" />
          </div>
          <div className="book-label-conainer">
            <label htmlFor="end-dater">Виберіть дату виселення:</label>

            <input type="date" id="end-date" />
          </div>
          <p className="book-price">Ціна: 20 грн/доба</p>
          <p className="book-price">Ціна за 2 доби: 60 грн</p>

          <button className="book-btn">
            Забронювати палату<span></span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
