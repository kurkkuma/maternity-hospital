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
  id: number;
  name: string;
  surname: string;
  phone: string;
  password: string;
};
export type RoomType = {
  id: number;
  number: number;
  type: string;
  description: string;
  price: number;
  status: string;
};
export type BookedRoomType = {
  id: number;
  user_id: number;
  room_id: number;
  number: number;
  type: string;
  description: string;
  start_date: string;
  end_date: string;
  amount_days: number;
  full_price: number;
};
export type DoctorsType = {
  id: number;
  name: string;
  speciality: string;
  office: number;
  schedule: any;
};
export type AppointmentType = {
  id: number;
  user_id: number;
  doctor_id: number;
  speciality: string;
  name: string;
  office: number;
  date: string;
  time: string;
  schedule: Record<string, unknown>;
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
  activeTab: string;
  setActiveTab: (activeTab: "room" | "appointment") => void;
  doctors: Array<DoctorsType>;
  userAppointments: Array<AppointmentType> | undefined;
  setUserAppointments: (appointments: AppointmentType[]) => void;
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
  activeTab: "room",
  setActiveTab: () => {},
  doctors: [],
  userAppointments: undefined as AppointmentType[] | undefined,
  setUserAppointments: () => {},
});
////////////////////////////////////////////////////////////////////////////////////////////
function App() {
  const [user, setUser] = useState<Partial<UserType>>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [bookedRooms, setBookedRooms] = useState<BookedRoomType[]>([]);
  const [doctors, setDoctors] = useState<DoctorsType[]>([]);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);

  //берем палату авторизированного пользователя
  const [userBookedRoom, setUserBookedRoom] = useState<
    BookedRoomType | undefined
  >();
  //берем все записи на прием авторизированного пользователя
  const [userAppointments, setUserAppointments] = useState<
    AppointmentType[] | undefined
  >();

  const [activeTab, setActiveTab] = useState<string>("room");

  //при монтировании компонента отправится запрос на получение всех палат
  useEffect(() => {
    fetch("http://localhost:8080/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));

    fetch("http://localhost:8080/booked-rooms")
      .then((res) => res.json())
      .then((data) => setBookedRooms(data));

    fetch("http://localhost:8080/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data));

    fetch("http://localhost:8080/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data));
  }, []);

  useEffect(() => {
    setUserBookedRoom(bookedRooms.find((room) => room.user_id === user.id));
  }, [bookedRooms, user]);

  useEffect(() => {
    setUserAppointments(
      appointments.filter((appointment) => appointment.user_id === user.id)
    );
  }, [appointments, user]);
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
      activeTab,
      setActiveTab,
      doctors,
      userAppointments,
      setUserAppointments,
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
      activeTab,
      setActiveTab,
      doctors,
      userAppointments,
      setUserAppointments,
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
