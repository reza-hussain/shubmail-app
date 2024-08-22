import { useState } from "react";
import { Button, Dropdown, Empty, Layout, Skeleton, Space } from "antd";
import { Content } from "antd/es/layout/layout";
import parse from "html-react-parser";

// components
import MessageBox from "../MessageBox";

// context
import { useStateValue } from "../../context/StateProvider";

// services
import { postRequest } from "../../services/inbox";

const MailDetails = ({ menu, messageOpen, setMessageOpen }) => {
  const { emailData, setEmailData, mailLoader, activeEmail, inbox, setInbox } =
    useStateValue();
  const [emailsToSend, setEmailsToSend] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const menuItems = [
    {
      label: emailData?.isUnread ? "Mark as read" : "Mark as unread",
      onClick: () => handleMarkAsUnread(),
    },
    {
      label: "Delete email",
      onClick: () => handleDelete(),
    },
  ];

  const handleSend = async () => {
    if (messageOpen === 1) {
      handleReply();
    }

    if (messageOpen === 2) {
      handleReplyToAll();
    }

    if (messageOpen === 3) {
      handleForward();
    }
  };

  const handleReply = async () => {
    if (Array.isArray(emailData?.to)) {
      setEmailsToSend(emailData?.to);
    } else {
      setEmailsToSend([emailData?.to]);
    }
  };

  const handleReplyToAll = async () => {
    if (Array.isArray(emailData?.to)) {
      setEmailsToSend(emailData?.to);
    } else {
      setEmailsToSend([emailData?.to]);
    }
  };

  const handleForward = async () => {
    setIsLoading(true);
    try {
      const response = await postRequest({
        url: `/gmail/${activeEmail}/forward-emails`,
        // headers: {
        //   "Content-Type": "application/json",
        //   Cookie: "cookie_id=1694007207482",
        // },
        data: {
          messageId: emailData?.id,
          to: emailsToSend,
          from: emailData?.from,
          subject: emailData?.subject,
        },
      });

      setMessageOpen(false);
    } catch (error) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsUnread = async () => {
    const updatedMail = { ...emailData, isUnread: !emailData?.isUnread };

    const updatedInbox = inbox?.map((item) => {
      if (item?.id === emailData?.id) {
        const newLabelIds = emailData?.isUnread
          ? item.labelIds.filter((ele) => ele.toLowerCase() !== "unread")
          : [...item?.labelIds, "UNREAD"];
        return { ...item, labelIds: newLabelIds };
      }
      return item;
    });

    setInbox(updatedInbox);
    setEmailData(updatedMail);

    try {
      await postRequest({
        url: `/gmail/${activeEmail}/mark-read-unread-emails`,
        data: {
          messageIds: [emailData?.id],
          markAs: emailData?.isUnread ? "read" : "unread",
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  const handleDelete = async () => {
    const updatedInbox = inbox.filter((item) => item.id !== emailData?.id);
    setInbox(updatedInbox);

    setEmailData(null);

    await postRequest({
      url: `/gmail/${activeEmail}/delete-emails`,
      data: {
        messageIds: [emailData?.id],
      },
    });
  };

  return (
    <Layout className="max-w-[60%] p-4 bg-white h-full">
      {emailData ? (
        <Content className="w-full flex justify-center items-start h-full overflow-hidden">
          <div className="w-full flex flex-col justify-start items-start h-full gap-5">
            {/* MAIL HEADER */}
            <div className="w-full py-4 flex justify-between items-center border-0 border-solid border-b-2 border-[rgba(5,5,5,0.06)]">
              <div className="w-full flex flex-col justify-start items-start gap-4 ">
                {mailLoader ? (
                  <Skeleton.Input size="small" className="!w-full" active />
                ) : (
                  <h4>{emailData?.from}</h4>
                )}
                {mailLoader ? (
                  <Skeleton.Input size="small" className="!w-full" active />
                ) : (
                  <p>{emailData?.to}</p>
                )}
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
            <div className="w-full basis-[80%] border overflow-auto">
              {mailLoader ? <Skeleton active /> : parse(emailData?.body ?? "")}
            </div>

            {/* REPLY BOX */}
            {messageOpen && !mailLoader && (
              <MessageBox
                messageOpen={messageOpen}
                setMessageOpen={setMessageOpen}
                emailsToSend={emailsToSend}
                setEmailsToSend={setEmailsToSend}
                body={messageOpen === 3 ? emailData?.body : null}
                mailSubject={emailData?.subject ?? null}
              />
            )}

            {!mailLoader && (
              <div className="w-full flex justify-start items-center gap-4">
                {!messageOpen ? (
                  <>
                    <Button onClick={() => setMessageOpen(1)}>Reply</Button>
                    <Button onClick={() => setMessageOpen(2)}>
                      Reply to All
                    </Button>
                    <Button onClick={() => setMessageOpen(3)}>Forward</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleSend}>Send Email</Button>
                    <Button onClick={() => setMessageOpen(null)}>
                      Discard
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </Content>
      ) : !emailData && mailLoader ? (
        <Content className="w-full flex justify-center items-start h-full overflow-hidden">
          <div className="w-full flex flex-col justify-start items-start h-full gap-5">
            {/* MAIL HEADER */}
            <div className="w-full py-4 flex justify-between items-center border-0 border-solid border-b-2 border-[rgba(5,5,5,0.06)]">
              <div className="w-full flex flex-col justify-start items-start gap-4 ">
                <Skeleton.Input size="small" className="!w-full" active />

                <Skeleton.Input size="small" className="!w-full" active />
              </div>
            </div>
            {/* EMAIL BODY */}
            <div className="w-full basis-[80%] border overflow-auto">
              <Skeleton active />
            </div>
          </div>
        </Content>
      ) : (
        <Empty
          className="h-full w-full flex justify-center items-center"
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ height: 300 }}
          description={""}
        ></Empty>
      )}
    </Layout>
  );
};

export default MailDetails;
