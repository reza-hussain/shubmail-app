import React, { useEffect, useState } from "react";
import { Button, Empty, Flex, Input, Layout, Pagination, Skeleton } from "antd";

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

    setSearch,
  } = useStateValue();

  const { fetchData } = useSidebarItems();
  const [isUnread, setIsUnread] = useState(false);

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
          inbox.map((mail, idx) => (
            <EmailCard
              index={idx}
              activeEmail={activeEmail}
              mail={mail}
              key={mail.id}
              checkedEmails={checkedEmails}
              handleCheckbox={handleCheckbox}
            />
          ))
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
