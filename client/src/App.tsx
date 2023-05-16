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
  id: string;
  name: string;
  surname: string;
  phone: string;
  password: string;
};
export type RoomType = {
  id: string;
  number: number;
  type: string;
  description: string;
  price: number;
  status: string;
};
export type BookedRoomType = {
  id: string;
  user_id: string;
  room_id: string;
  number: number;
  type: string;
  description: string;
  start_date: string;
  end_date: string;
  amount_days: number;
  full_price: number;
};
//типизация данных передаваемых в контекст
interface AppContextType {
  logData: Array<LogDataType>;
  regData: Array<string>;
  user: Partial<UserType>;
  setUser: (user: Partial<UserType>) => void;
  rooms: Array<RoomType>;
  bookedRooms: Array<BookedRoomType>;
  userBookedRoom: BookedRoomType | undefined;
  setUserBookedRoom: (userBookedRoom: BookedRoomType | undefined) => void;
}
//создание контекста и указание начального значения для данных
export const AppContext = createContext<AppContextType>({
  logData: [],
  regData: [],
  user: {},
  setUser: () => {},
  rooms: [],
  bookedRooms: [],
  userBookedRoom: undefined as BookedRoomType | undefined,
  setUserBookedRoom: () => {},
});
////////////////////////////////////////////////////////////////////////////////////////////
function App() {
  const [user, setUser] = useState<Partial<UserType>>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [bookedRooms, setBookedRooms] = useState<BookedRoomType[]>([]);

  //берем палату авторизированного пользователя
  const [userBookedRoom, setUserBookedRoom] = useState<
    BookedRoomType | undefined
  >();

  //при монтировании компонента отправится запрос на получение всех палат
  useEffect(() => {
    fetch("http://localhost:8080/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));

    fetch("http://localhost:8080/booked-rooms")
      .then((res) => res.json())
      .then((data) => setBookedRooms(data));
  }, []);

  useEffect(() => {
    setUserBookedRoom(bookedRooms.find((room) => room.user_id === user.id));
  }, [bookedRooms, user]);

  //используем useMemo для оптимизации контекста, объект appContextValue будет пересоздан только, если logData или regData изменились.
  const appContextValue = useMemo(
    () => ({
      logData,
      regData,
      user,
      setUser,
      rooms,
      bookedRooms,
      userBookedRoom,
      setUserBookedRoom,
    }),
    [
      logData,
      regData,
      user,
      setUser,
      rooms,
      bookedRooms,
      userBookedRoom,
      setUserBookedRoom,
    ]
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
