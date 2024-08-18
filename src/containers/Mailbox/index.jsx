import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  Flex,
  Input,
  Layout,
  Menu,
  Space,
} from "antd";

import { sampleEmails } from "../../constants/email";
import MessageBox from "../../components/MessageBox";

// styles
import "antd/es/layout/style/index";
import { useSidebarItems } from "../../constants/sidebar";
import { getRequest } from "../../services/inbox";

const { Sider, Content } = Layout;

const Mailbox = () => {
  const [messageOpen, setMessageOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const sidebarItems = useSidebarItems(emails);
  const [activeEmail, setActiveEmail] = useState("");
  const [checkedEmails, setCheckedEmails] = useState([]);

  const menuItems = [
    {
      label: "Mark as unread",
      onClick: () => alert("hello"),
    },
    {
      label: "Delete email",
      onClick: () => alert("hello"),
    },
  ];

  const handleCheckbox = (id) => {
    const emailExists =
      checkedEmails?.filter((item) => item === id)?.length > 0;

    if (emailExists) {
      setCheckedEmails(checkedEmails?.filter((item) => item !== id));
    } else {
      setCheckedEmails((prev) => [...prev, id]);
    }
  };

  useEffect(() => {
    (async () => {
      const emailsList = await getRequest({
        url: "/gmail/get-emails",
      });

      setEmails(emailsList);
    })();
  }, []);

  return (
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
            {sampleEmails.map((email) => (
              <Card
                className={`mailCard cursor-pointer ${
                  activeEmail === email.id ? "mailCardActive" : ""
                }`}
                key={email.id}
                onClick={() => setActiveEmail(email.id)}
              >
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleCheckbox(email.id)}
                  checked={checkedEmails?.some((item) => item === email.id)}
                  className="absolute left-[10px] top-[22px] z-10"
                />
                <h4 className="text-lg font-semibold">{email.email} </h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua
                </p>
                <span>Aug 07 2022</span>
              </Card>
            ))}
          </Flex>
        </Layout>
        <Layout className="max-w-[60%] p-4 bg-white h-full">
          <Content className="w-full flex justify-center items-start h-full overflow-auto">
            <div className="w-full flex flex-col justify-start items-start h-full gap-5">
              {/* MAIL HEADER */}
              <div className="w-full py-4 flex justify-between items-center border-0 border-solid border-b-2 border-[rgba(5,5,5,0.06)]">
                <div className="w-full flex flex-col justify-start items-start ">
                  <h4>Shubham More</h4>
                  <p>shubham.more@gmail.com</p>
                </div>
                <Dropdown
                  className="cursor-pointer"
                  menu={{
                    items: menuItems,
                  }}
                  trigger={["click"]}
                >
                  <Space>...</Space>
                </Dropdown>
              </div>
              {/* EMAIL BODY */}
              <div className="basis-[80%] border">
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum.
              </div>

              {/* REPLY BOX */}
              {messageOpen && (
                <MessageBox
                  messageOpen={messageOpen}
                  setMessageOpen={setMessageOpen}
                />
              )}

              <div className="w-full flex justify-start items-center gap-4">
                {!messageOpen ? (
                  <>
                    {" "}
                    <Button onClick={() => setMessageOpen(true)}>Reply</Button>
                    <Button onClick={() => setMessageOpen(true)}>
                      Reply to All
                    </Button>
                    <Button onClick={() => setMessageOpen(true)}>
                      Forward
                    </Button>
                  </>
                ) : (
                  <>
                    {" "}
                    <Button onClick={() => setMessageOpen(true)}>
                      Send Email
                    </Button>
                    <Button onClick={() => setMessageOpen(true)}>
                      Discard
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Mailbox;
