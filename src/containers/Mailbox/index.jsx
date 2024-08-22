import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";

// styles
import "antd/es/layout/style/index";
import { useSidebarItems } from "../../constants/sidebar";
import { getRequest } from "../../services/inbox";
import InboxList from "../../components/InboxList";
import MailDetails from "../../components/MailDetails";
import { useStateValue } from "../../context/StateProvider";

const { Sider } = Layout;

const Mailbox = () => {
  const [messageOpen, setMessageOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [checkedEmails, setCheckedEmails] = useState([]);

  const { sidebarItems } = useSidebarItems(emails);
  const { activeEmail, setActiveEmail, setEmailLoader, emailLoader } =
    useStateValue();

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
      setEmailLoader(true);
      try {
        const emailsList = await getRequest({
          url: "/gmail/get-emails",
        });
        setEmails(emailsList);
      } catch (error) {
        throw new Error(error);
      } finally {
        setEmailLoader(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full max-h-[calc(100vh-64px)] h-full overflow-hidden pl-16">
      <Layout className="w-full bg-white h-full">
        <Sider
          width={200}
          className="!bg-white border-0 border-r-[1px] border-solid border-[rgba(5,5,5,0.06)] h-full"
        >
          {emailLoader ? (
            <p>Loading...</p>
          ) : (
            <Menu
              mode="inline"
              defaultSelectedKeys={[activeEmail]}
              style={{
                height: "100%",
                borderRight: 0,
                background: "#fff",
              }}
              selectedKeys={[activeEmail]}
              items={sidebarItems}
            />
          )}
        </Sider>

        <InboxList
          activeEmail={activeEmail}
          setActiveEmail={setActiveEmail}
          handleCheckbox={handleCheckbox}
          checkedEmails={checkedEmails}
        />
        <MailDetails
          setMessageOpen={setMessageOpen}
          messageOpen={messageOpen}
        />
      </Layout>
    </div>
  );
};

export default Mailbox;
