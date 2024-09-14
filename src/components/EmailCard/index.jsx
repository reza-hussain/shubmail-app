import React, { useEffect, useState } from "react";
import { Card, Checkbox } from "antd";
import parse from "html-react-parser";
import moment from "moment";
import { getRequest } from "../../services/inbox";
import { useStateValue } from "../../context/StateProvider";

const EmailCard = ({ checkedEmails, handleCheckbox, mail }) => {
  const [isUnread, setIsUnread] = useState(false);
  const { activeEmail, setEmailData, setMailLoader, emailData } =
    useStateValue();

  const decodeResponse = (response) => {
    const otherMimeTypes = ["multipart/alternative", "multipart/report"];

    // eslint-disable-next-line
    const data = response?.map((item) => {
      if (item?.mimeType === "text/html") {
        return item?.body?.data;
      } else if (otherMimeTypes?.includes(item?.mimeType)) {
        return decodeResponse(item?.parts);
      }
    });

    return data?.[1];
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

        decodeResponse(response?.payload?.parts);

        const base64urlData = response?.payload?.parts
          ? decodeResponse(response?.payload?.parts)
          : response?.payload?.body?.data;
        const body = base64urlData?.replace(/-/g, "+")?.replace(/_/g, "/");

        const details = {
          from: response?.emailMetadata?.from,
          to: response?.emailMetadata?.to?.split(","),
          subject: response?.emailMetadata?.subject,
          date: response?.emailMetadata?.date,
          body: atob(body),
          id: response.id,
          isUnread,
          cc:
            response?.emailMetadata?.cc?.length > 0
              ? response?.emailMetadata?.cc?.split(",")
              : "",
          bcc:
            response?.emailMetadata?.bcc?.length > 0
              ? response?.emailMetadata?.bcc?.split(",")
              : "",
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
