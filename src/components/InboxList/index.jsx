import React, { useEffect, useState } from "react";
import {
  Button,
  Empty,
  Flex,
  Input,
  Layout,
  Pagination,
  Skeleton,
  Switch,
} from "antd";

// components
import EmailCard from "../EmailCard";

//context
import { useStateValue } from "../../context/StateProvider";

// services
import { postRequest } from "../../services/inbox";
import { useSidebarItems } from "../../hooks/sidebar";

const InboxList = ({
  // setActiveEmail,
  handleCheckbox,
  checkedEmails,
}) => {
  const {
    inbox,
    inboxLoader,
    pagination,
    activeEmail,
    setCurrentPage,
    currentPage,
    filterType,
    setSearch,
  } = useStateValue();

  const { fetchData } = useSidebarItems();
  const [isUnread, setIsUnread] = useState(false);
  const [unreadToggle, setUnreadToggle] = useState(false);

  const [activeInboxItem, setActiveInboxItem] = useState();

  const handleMarkAsUnread = async () => {
    const firstSelectedEmail = inbox?.filter(
      (item) => item?.id === checkedEmails?.[0]
    )?.[0];

    const isSelectedUnread = firstSelectedEmail?.labelIds?.some(
      (item) => item?.toLowerCase() === "unread"
    );

    try {
      await postRequest({
        url: `/gmail/${activeEmail}/mark-read-unread-emails`,
        data: {
          messageIds: checkedEmails,
          markAs: isSelectedUnread ? "read" : "unread",
        },
      });
    } catch (err) {
      throw new Error(err);
    } finally {
      fetchData();
    }
  };

  const handleDelete = async () => {
    try {
      await postRequest({
        url: `/gmail/${activeEmail}/delete-emails`,
        data: {
          messageIds: checkedEmails,
        },
      });
    } catch (err) {
      throw new Error(err);
    } finally {
      fetchData();
    }
  };

  const handleSwitch = (checked) => {
    setUnreadToggle(checked);

    const type = checked ? "unread" : "inbox";

    fetchData(null, type);
  };

  useEffect(() => {
    const firstSelectedEmail = inbox?.filter(
      (item) => item?.id === checkedEmails?.[0]
    )?.[0];

    const isSelectedUnread = firstSelectedEmail?.labelIds?.some(
      (item) => item?.toLowerCase() === "unread"
    );
    setIsUnread(isSelectedUnread);

    // eslint-disable-next-line
  }, [checkedEmails, inbox]);

  return (
    <Layout className="max-w-[30%] bg-white h-full p-4">
      <Flex className="h-full overflow-scroll gap-4 relative" vertical>
        <Input
          placeholder="Search emails"
          onChange={(e) => setSearch(e?.target?.value)}
        />
        {filterType?.toLowerCase() === "inbox" && (
          <div className="w-full flex justify-end items-center gap-4">
            <span className="text-gray-700 font-medium">
              Show {unreadToggle ? "Read" : "Unread"}
            </span>
            <Switch onChange={handleSwitch} />
          </div>
        )}
        {checkedEmails?.length > 0 && (
          <div className="w-full flex justify-end items-center gap-4 bg-white z-[100]">
            <Button onClick={handleMarkAsUnread}>
              Mark as {isUnread ? "read" : "unread"}
            </Button>
            <Button onClick={handleDelete}>Delete</Button>
          </div>
        )}
        {inboxLoader ? (
          Array(10)
            .fill()
            .map((_, index) => (
              <Skeleton key={index} loading={inboxLoader} active />
            ))
        ) : inbox?.length ? (
          inbox.map((mail, idx) => {
            return (
              <EmailCard
                index={idx}
                activeEmail={activeEmail}
                isActive={activeInboxItem === mail?.id}
                activeInboxItem={activeInboxItem}
                setActiveInboxItem={setActiveInboxItem}
                mail={mail}
                key={mail.id}
                checkedEmails={checkedEmails}
                handleCheckbox={handleCheckbox}
              />
            );
          })
        ) : (
          <Empty />
        )}
      </Flex>
      <Pagination
        align="center"
        className="pt-8 pb-4"
        current={currentPage}
        total={pagination?.totalMessages}
        // defaultCurrent={6}
        disabled={inboxLoader}
        showSizeChanger={false}
        onChange={(page) => setCurrentPage(page)}
      />
    </Layout>
  );
};

export default InboxList;
