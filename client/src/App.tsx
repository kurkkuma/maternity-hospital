import { createContext, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";

import { logData } from "./data/log-data.ts";
import { regData } from "./data/reg-data.ts";
///////////////////////////////////////////////////////////////////////////////////////////
//типизация объектов для массива logData
type LogDataType = {
  url: string;
  description: string;
};
//типизация данных передаваемых в контекст
interface AppContextType {
  logData: Array<LogDataType>;
  regData: Array<string>;
}
//создание контекста и указание начального значения
export const AppContext = createContext<AppContextType>({
  logData: [],
  regData: [],
});
////////////////////////////////////////////////////////////////////////////////////////////
function App() {
  //используем useMemo для оптимизации контекста, объект appContextValue будет пересоздан только, если logData или regData изменились.
  const appContextValue = useMemo(
    () => ({ logData, regData }),
    [logData, regData]
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
