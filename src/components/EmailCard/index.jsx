import React, { useEffect, useState } from "react";
import { Card, Checkbox } from "antd";
import parse from "html-react-parser";
import moment from "moment";
import { getRequest } from "../../services/inbox";
import { useStateValue } from "../../context/StateProvider";

const EmailCard = ({ checkedEmails, handleCheckbox, mail, index }) => {
  const [isUnread, setIsUnread] = useState(false);
  const { activeEmail, setEmailData, setMailLoader, emailData } =
    useStateValue();

  const filterDetails = (response, key) => {
    return response?.payload?.headers?.filter(
      (data) => data?.name.toLowerCase() === key?.toLowerCase()
    )?.[0]?.value;
  };

  const handleClick = async () => {
    if (mail?.id !== emailData?.id) {
      setMailLoader(true);
      try {
        const response = await getRequest({
          url: `/gmail/${activeEmail}/read-single-emails/${mail.id}`,
        });

        // checking if the email is read or unread
        const isUnread = response?.labelIds?.some(
          (label) => label.toLowerCase() === "unread"
        );
        setIsUnread(isUnread);

        // Decoding the email body
        const base64urlData = response?.payload?.parts
          ? response?.payload?.parts?.[1].body?.data
          : response?.payload?.body?.data;
        const body = base64urlData?.replace(/-/g, "+")?.replace(/_/g, "/");

        const details = {
          from: filterDetails(response, "from"),
          to: filterDetails(response, "to"),
          subject: filterDetails(response, "subject"),
          date: filterDetails(response, "date"),
          body: atob(body),
          id: response.id,
          isUnread,
        };
        setEmailData(details);
      } catch (error) {
        throw new Error(error);
      } finally {
        setMailLoader(false);
      }
    }
  };

  useEffect(() => {
    const isUnread = mail?.labelIds?.some(
      (label) => label.toLowerCase() === "unread"
    );
    setIsUnread(isUnread);

    // eslint-disable-next-line
  }, [mail]);

  return (
    <Card
      className={`mailCard cursor-pointer ${
        activeEmail === mail.id ? "mailCardActive" : ""
      } ${!isUnread ? "!text-gray-500" : "text-black"}`}
      key={mail.id}
      onClick={handleClick}
    >
      <Checkbox
        onClick={(e) => e.stopPropagation()}
        onChange={() => handleCheckbox(mail.id)}
        checked={checkedEmails?.some((item) => item === mail.id)}
        className="absolute left-[10px] top-[22px] z-10"
      />
      <h4 className="text-lg font-semibold max-w-full text-ellipsis overflow-hidden">
        {mail.headers.from.split("<")?.[0]?.length > 0
          ? mail.headers.from.split("<")?.[0]
          : mail.headers.from.split("<")?.[1]}
      </h4>
      <p>{parse(mail.snippet)}</p>
      <span>{moment(mail.headers.date).format("DD-MMM-YYYY")}</span>
    </Card>
  );
};

export default EmailCard;
