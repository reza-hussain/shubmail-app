import React from "react";
import { Layout, Menu } from "antd";

// styles
import "antd/es/layout/style/index";
import { useSidebarItems } from "../../constants/sidebar";

const { Header, Sider } = Layout;

const Mailbox = () => {
  const navItems = [
    {
      label: "Inbox",
    },
    {
      label: "Mail",
    },
  ];

  const sidebarItems = useSidebarItems([]);

  return (
    <Layout className="w-full bg-white h-full">
      <Header className="bg-white text-black">
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
      <div className="w-full h-screen px-16">
        <Layout className="w-full bg-white min-h-[70%] h-full">
          <Sider
            width={200}
            className="!bg-white border-0 border-r-[1px] border-solid border-[rgba(5,5,5,0.06)] h-full"
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
                borderRight: 0,
                background: "#fff",
              }}
              items={sidebarItems}
            />
          </Sider>

          <Layout>Content</Layout>
        </Layout>
      </div>
    </Layout>
  );
};

export default Mailbox;
