import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, Popover, Radio } from "antd";

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
  const [activeItem, setActiveItem] = useState(null);

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
      setFilterType("inbox");
      fetchData(null, "inbox");
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

  const handleClick = async (data) => {
    setActiveItem(data);

    if (data !== activeEmail) await fetchData(data);

    localStorage.setItem("activeEmail", JSON.stringify(data));
  };

  return (
    <div className="w-full max-h-[calc(100vh-64px)] h-full overflow-hidden pl-16">
      <Layout className="w-full bg-white h-full">
        <Sider
          width={200}
          className="w-full overflow-hidden  !bg-white border-0 border-r-[1px] border-solid border-[rgba(5,5,5,0.06)] h-full relative"
        >
          <div className="w-full flex flex-col justify-start items-center mt-5 gap-5 max-h-[65%] overflow-auto">
            {sidebarItems?.[0]?.children?.map((item) => (
              <Popover
                className="max-w-full overflow-hidden"
                onClick={() => handleClick(item?.key)}
                content={item.title}
                trigger="hover"
              >
                <Button
                  className={`min-h-[24px] max-h-[24px] flex justify-start items-center w-full max-w-full overflow-hidden text-ellipsis !border-none ${
                    activeItem === item?.key ? "!text-blue-400" : ""
                  }`}
                >
                  {item.title}
                </Button>
              </Popover>
            ))}
          </div>

          <Radio.Group
            value={filterType}
            className="fixed bottom-10 flex-col flex max-w-[200px] w-[200px] mx-auto"
          >
            <Radio.Button
              onClick={handleRadio}
              value="inbox"
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
