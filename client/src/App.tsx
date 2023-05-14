import { createContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";

import { logData } from "./data/log-data.ts";
import { regData } from "./data/reg-data.ts";
///////////////////////////////////////////////////////////////////////////////////////////
//типизация объектов
type LogDataType = {
  url: string;
  description: string;
};
type UserType = {
  _id: string;
  name: string;
  surname: string;
  phone: string;
  password: string;
};
export type RoomType = {
  _id: string;
  number: number;
  type: string;
  description: string;
  price: number;
  status: string;
};

//типизация данных передаваемых в контекст
interface AppContextType {
  logData: Array<LogDataType>;
  regData: Array<string>;
  user: Partial<UserType>;
  setUser: (user: Partial<UserType>) => void;
  rooms: Array<RoomType>;
}
//создание контекста и указание начального значения для данных
export const AppContext = createContext<AppContextType>({
  logData: [],
  regData: [],
  user: {},
  setUser: () => {},
  rooms: [],
});
////////////////////////////////////////////////////////////////////////////////////////////
function App() {
  const [user, setUser] = useState<Partial<UserType>>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });
  const [rooms, setRooms] = useState<RoomType[]>([]);
  //при монтировании компонента отправится запрос на получение всех палат
  useEffect(() => {
    fetch("http://localhost:8080/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, []);

  //используем useMemo для оптимизации контекста, объект appContextValue будет пересоздан только, если logData или regData изменились.
  const appContextValue = useMemo(
    () => ({
      logData,
      regData,
      user,
      setUser,
      rooms,
    }),
    [logData, regData, user, setUser, rooms]
  );

  return (
    <AppContext.Provider value={appContextValue}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
