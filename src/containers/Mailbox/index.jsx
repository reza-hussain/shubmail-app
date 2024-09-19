import React, { useEffect, useState } from "react";
import { Layout, Menu, Radio } from "antd";

// styles
import "antd/es/layout/style/index";
import { useSidebarItems } from "../../hooks/sidebar";
import { getRequest } from "../../services/inbox";
import InboxList from "../../components/InboxList";
import MailDetails from "../../components/MailDetails";
import { useStateValue } from "../../context/StateProvider";

const { Sider } = Layout;

const Mailbox = () => {
  const [messageOpen, setMessageOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [checkedEmails, setCheckedEmails] = useState([]);

  const { sidebarItems, fetchData } = useSidebarItems(emails);
  const {
    activeEmail,
    setActiveEmail,
    setEmailLoader,

    setFilterType,
    filterType,
  } = useStateValue();

  const handleCheckbox = (id) => {
    const emailExists =
      checkedEmails?.filter((item) => item === id)?.length > 0;

    if (emailExists) {
      setCheckedEmails(checkedEmails?.filter((item) => item !== id));
    } else {
      setCheckedEmails((prev) => [...prev, id]);
    }
  };

  const handleRadio = (e) => {
    const type = e.target.value;

    if (filterType === type) {
      setFilterType("all");
      fetchData(null, "all");
    } else {
      fetchData(null, type);
      setFilterType(type);
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
          className="!bg-white border-0 border-r-[1px] border-solid border-[rgba(5,5,5,0.06)] h-full relative"
        >
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

          <Radio.Group
            value={filterType}
            className="fixed bottom-10 flex-col flex max-w-[200px] w-[200px] mx-auto"
          >
            <Radio.Button
              onClick={handleRadio}
              value="all"
              className="w-full !border-none"
            >
              Inbox
            </Radio.Button>
            <Radio.Button
              onClick={handleRadio}
              value="sent"
              className="w-full !border-none"
            >
              Sent
            </Radio.Button>
            <Radio.Button
              onClick={handleRadio}
              value="spam"
              className="w-full !border-none"
            >
              Junk/Spam
            </Radio.Button>
            <Radio.Button
              onClick={handleRadio}
              value="trash"
              className="w-full !border-none"
            >
              Deleted
            </Radio.Button>
            <Radio.Button
              onClick={handleRadio}
              value="drafts"
              className="w-full !border-none"
            >
              Drafts
            </Radio.Button>
          </Radio.Group>
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
