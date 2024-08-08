import React from "react";
import { Card, Flex, Input, Layout, Menu } from "antd";

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
    <Layout className="w-full bg-white h-screen max-h-screen">
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
      <div className="w-full max-h-[calc(100vh-64px)] h-full overflow-hidden pl-16">
        <Layout className="w-full bg-white h-full">
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

          <Layout className="max-w-[30%] bg-white h-full p-4">
            <Flex className="h-full overflow-scroll gap-4" vertical>
              <Input placeholder="Search emails" />
              {[1, 2, 3, 4].map(() => (
                <Card className="mailCard cursor-pointer">
                  <h4 className="text-lg font-semibold">
                    shubham.more@gmail.com
                  </h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua
                  </p>
                  <span>Aug 07 2022</span>
                </Card>
              ))}
            </Flex>
          </Layout>
          <Layout className="max-w-[60%]">Content</Layout>
        </Layout>
      </div>
    </Layout>
  );
};

export default Mailbox;
