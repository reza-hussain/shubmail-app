import { Layout } from "antd";
import Header from "./components/Header";
// styles
import "./App.css";
import { Route, Routes } from "react-router-dom";

import Inbox from "./pages/inbox";
import Emails from "./pages/emails";

function App() {
  return (
    <Layout className="w-full bg-white h-screen max-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Inbox />} />
        <Route path="/emails" element={<Emails />} />
      </Routes>
    </Layout>
  );
}

export default App;
