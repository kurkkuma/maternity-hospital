import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

import RoomInfo from "./RoomInfo";
import RoomBooking from "./RoomBooking";

function Account() {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser({});
    navigate("/");
  };

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
          onClick={handleLogout}
          className="panel-logout"
          src="images/side-panel/logout.png"
          alt=""
        />
      </div>
      <div className="acc-room">
        <RoomInfo />
        <RoomBooking />
      </div>
    </div>
  );
}

export default Account;
