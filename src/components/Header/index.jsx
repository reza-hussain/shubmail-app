import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo";

const Header = () => {
  const { Header } = Layout;
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Inbox",
      onClick: () => navigate("/"),
      key: "Inbox",
    },
    {
      label: "Emails",
      onClick: () => navigate("/emails"),
      key: "Emails",
    },
  ];

  return (
    <Header className="bg-white text-black flex justify-start items-center gap-2">
      <Logo width={18} height={18} />
      <Menu
        className="w-full bg-white text-black"
        mode="horizontal"
        defaultSelectedKeys={["Inbox"]}
        items={navItems}
        style={{
          flex: 1,
          minWidth: 0,
        }}
      />
    </Header>
  );
};

export default Header;
