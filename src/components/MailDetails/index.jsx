import { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  Empty,
  Layout,
  notification,
  Skeleton,
  Space,
} from "antd";
import { Content } from "antd/es/layout/layout";
import parse from "html-react-parser";

// services
import { postRequest } from "../../services/inbox";

// components
import MessageBox from "../MessageBox";

// context
import { useStateValue } from "../../context/StateProvider";
import ThreadItem from "../ThreadItem";
import DOMPurify from "dompurify";

const MailDetails = ({ menu, messageOpen, setMessageOpen }) => {
  const { emailData, setEmailData, mailLoader, activeEmail, inbox, setInbox } =
    useStateValue();
  const [emailsToSend, setEmailsToSend] = useState([]);
  const [ccEmails, setCcEmails] = useState([]);
  const [bccEmails, setBccEmails] = useState([]);
  const [editorState, setEditorState] = useState("");

  const [api, contextHolder] = notification.useNotification();

  const handleToast = (type, message) => {
    api[type]({
      message,
    });
  };

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
    if (messageOpen === 3) {
      handleForward();
    } else {
      handleReply();
    }
  };

  const handleReply = async () => {
    let data = {
      threadId: emailData?.id,
      to: emailsToSend?.map((email) => email.split("<")?.[1]?.split(">")?.[0]),
      from: emailData?.to?.[0].split("<")?.[1]?.split(">")?.[0],
      subject: emailData?.subject,
      message: editorState,
    };

    if (messageOpen === 2) {
      data = {
        ...data,
        bcc: emailData?.bcc,
        cc: emailData?.cc,
        subject: emailData?.subject,
      };
    }

    setIsLoading(true);
    try {
      await postRequest({
        url: `/gmail/${activeEmail}/reply-emails`,
        data,
      });

      handleToast("success", "Email forwarded successfully");
      setEmailsToSend([]);
      setBccEmails([]);
      setCcEmails([]);
      setMessageOpen(false);
    } catch (error) {
      handleToast("error", "Failed to forward email");
      // throw new Error(error);
    } finally {
      setIsLoading(false);
      setEditorState("");
    }
  };

  const handleForward = async () => {
    setIsLoading(true);
    try {
      await postRequest({
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

      handleToast("success", "Email forwarded successfully");

      setMessageOpen(false);
    } catch (error) {
      handleToast("error", "Failed to forward email");
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

  const onClose = () => {
    setIsLoading(false);
    setEmailsToSend([]);
    setBccEmails([]);
    setCcEmails([]);
    setEditorState("");
  };

  useEffect(() => {
    if (messageOpen === 2) {
      emailData?.bcc?.length > 0 && setBccEmails([emailData?.bcc]);
      emailData?.cc?.length > 0 && setCcEmails([emailData?.cc]);

      setEmailsToSend([emailData?.from]);
    }
    if (messageOpen === 1) {
      setEmailsToSend([emailData?.from]);
    }

    if (messageOpen === null) onClose();

    // eslint-disable-next-line
  }, [messageOpen]);

  useEffect(() => {
    setMessageOpen(false);

    // eslint-disable-next-line
  }, [emailData]);

  const saveAsDraft = async () => {
    const draft = await postRequest({
      url: `/gmail/${activeEmail}/mark-read-unread-emails`,
      data: JSON.stringify({
        to: emailsToSend,
        subject: emailData?.subject,
        message: editorState,
      }),
    });

    return draft;
  };

  const cleanHTML = DOMPurify.sanitize(emailData?.body);

  return (
    <Layout className="max-w-[60%] p-4 bg-white h-full">
      {emailData ? (
        <Content className="w-full flex justify-center items-start h-full overflow-hidden">
          <div className="w-full flex flex-col justify-start items-start h-full gap-5 relative">
            {/* MAIL HEADER */}
            <div className="w-full py-4 flex justify-between items-center">
              <div className="w-full flex flex-col justify-start items-start gap-4 ">
                {mailLoader ? (
                  <Skeleton.Input size="small" className="!w-full" active />
                ) : (
                  <h4>{emailData?.from}</h4>
                )}
                <div className="w-full flex justify-start items-center gap-4 flex-wrap">
                  <p className="font-bold">To</p>
                  {mailLoader ? (
                    <Skeleton.Input size="small" className="!w-full" active />
                  ) : (
                    emailData?.to?.map(
                      (item) =>
                        item?.length > 0 && (
                          <p key={item} className="py-1 px-2 bg-gray-100">
                            {item}
                          </p>
                        )
                    )
                  )}
                </div>
                {emailData?.cc?.length > 0 && (
                  <div className="w-full flex justify-start items-center gap-4 flex-wrap">
                    {mailLoader ? (
                      <Skeleton.Input size="small" className="!w-full" active />
                    ) : (
                      <>
                        <p className="font-bold">CC:</p>
                        {emailData?.cc?.map(
                          (item) =>
                            item?.length > 0 && (
                              <p key={item} className="py-1 px-2 bg-gray-100">
                                {item}
                              </p>
                            )
                        )}
                      </>
                    )}
                  </div>
                )}
                {emailData?.bcc?.length > 0 && (
                  <div className="w-full flex justify-start items-center gap-4 flex-wrap">
                    {mailLoader ? (
                      <Skeleton.Input size="small" className="!w-full" active />
                    ) : (
                      <>
                        <p className="font-bold">BCC:</p>
                        {emailData?.bcc?.map(
                          (item) =>
                            item?.length > 0 && (
                              <p key={item} className="py-1 px-2 bg-gray-100">
                                {item}
                              </p>
                            )
                        )}
                      </>
                    )}
                  </div>
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

            {/* MAIL SUBJECT */}

            <div className="w-full flex justify-start items-start font-medium  border-0 border-solid border-b-2 border-[rgba(5,5,5,0.06)]">
              {emailData?.subject}
            </div>

            {/* EMAIL BODY */}
            <div
              className={`w-full ${
                messageOpen ? "lg:basis-[20%] 2xl:basis-[30%]" : "basis-[80%]"
              } border overflow-auto transition-all duration-200 ease-linear ${
                messageOpen ? "opacity-50" : "opacity-100"
              }`}
            >
              {mailLoader ? (
                <Skeleton active />
              ) : emailData?.threadData?.length > 1 ? (
                emailData?.threadData?.map((thread, index) => (
                  <ThreadItem
                    data={thread}
                    isLastItem={index === emailData?.threadData?.length - 1}
                  />
                ))
              ) : (
                parse(cleanHTML ?? "")
              )}
            </div>
            {/* REPLY BOX */}
            {messageOpen && !mailLoader && (
              <div className="w-full h-[450px] bg-white z-[100]">
                <MessageBox
                  messageOpen={messageOpen}
                  setMessageOpen={setMessageOpen}
                  emailsToSend={emailsToSend}
                  setEmailsToSend={setEmailsToSend}
                  body={messageOpen === 3 ? emailData?.body : null}
                  mailSubject={emailData?.subject ?? null}
                  editorState={editorState}
                  setEditorState={setEditorState}
                  bccEmails={bccEmails}
                  ccEmails={ccEmails}
                  setBccEmails={setBccEmails}
                  setCcEmails={setCcEmails}
                />
              </div>
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
                    <Button
                      onClick={handleSend}
                      disabled={!emailsToSend?.length}
                      loading={isLoading}
                    >
                      Send Email
                    </Button>
                    <Button
                      onClick={() => {
                        setMessageOpen(null);
                        setIsLoading(false);
                      }}
                    >
                      Discard
                    </Button>
                    <Button onClick={saveAsDraft}>Save as Draft</Button>
                  </>
                )}
              </div>
            )}
          </div>
          {contextHolder}
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
