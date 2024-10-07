import React, { useEffect, useState } from "react";
import { Card, Checkbox } from "antd";
import parse from "html-react-parser";
import moment from "moment";
import { getRequest } from "../../services/inbox";
import { useStateValue } from "../../context/StateProvider";
import DOMPurify from "dompurify";

const EmailCard = ({
  checkedEmails,
  handleCheckbox,
  mail,
  index,
  activeInboxItem,
  setActiveInboxItem,
  onClick,
}) => {
  const [isUnread, setIsUnread] = useState(false);
  const { activeEmail, setEmailData, setMailLoader, mailLoader, emailData } =
    useStateValue();

  const cleanHTML = DOMPurify.sanitize(mail?.snippet);

  const extractHtmlPart = (payload) => {
    // Recursive helper function
    const findHtmlPart = (parts) => {
      if (!parts || !Array.isArray(parts)) return null; // Guard clause to ensure parts is an array

      const htmlExists = parts?.some((part) => part?.mimeType === "text/html");

      for (const part of parts) {
        // If part has nested parts, recurse into them
        if (part?.parts) {
          const foundHtml = findHtmlPart(part?.parts);
          if (foundHtml) return foundHtml; // Return immediately if HTML part found
        }

        // If this part has mimeType 'text/html', return the data
        if (part?.mimeType === "text/html") {
          return part?.body?.data || null;
        }

        if (!htmlExists && part?.body?.size > 0) {
          return part?.body?.data;
        }
      }

      return null; // No 'text/html' part found
    };
    if (payload?.body?.size > 0) {
      return payload?.body?.data;
    }

    return findHtmlPart(payload?.parts) || null; // Start the search and return result
  };

  const handleClick = async () => {
    setActiveInboxItem(mail.id);
    if (mail?.id !== emailData?.id) {
      setMailLoader(true);
      onClick?.();

      try {
        const response = await getRequest({
          url: `/gmail/${activeEmail}/read-single-emails/${mail.id}`,
        });

        // checking if the email is read or unread
        const isUnread = response?.labelIds?.some(
          (label) => label.toLowerCase() === "unread"
        );
        setIsUnread(isUnread);

        const base64urlData = extractHtmlPart(response.payload);
        const body = base64urlData?.replace(/-/g, "+")?.replace(/_/g, "/");

        const threadData = response?.threadData?.messages?.map((thread) => {
          const html = extractHtmlPart(thread?.payload);

          const body = atob(html?.replace(/-/g, "+")?.replace(/_/g, "/"));

          return {
            from: thread?.payload?.headers?.filter(
              (item) => item.name === "From"
            )?.[0]?.value,
            to: thread?.payload?.headers?.filter(
              (item) => item.name === "To"
            )?.[0]?.value,
            date: thread?.payload?.headers?.filter(
              (item) => item.name === "Date"
            )?.[0]?.value,
            body,
          };
        });

        const details = {
          from: response?.emailMetadata?.from,
          to: response?.emailMetadata?.to?.split(","),
          subject: response?.emailMetadata?.subject,
          date: response?.emailMetadata?.date,
          body: atob(body),
          threadData,
          id: response?.threadId,
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
  }, [mail.id]);

  return (
    <Card
      className={`mailCard cursor-pointer ${
        activeInboxItem === mail.id
          ? "border !border-[#108ee9] !text-[#108ee9]"
          : "border !border-[#f0f0f0]"
      } ${!isUnread ? "!text-gray-500" : "text-black"} ${
        mailLoader ? "pointer-events-none opacity-30" : "pointer-events-auto"
      }`}
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
      <p>{parse(cleanHTML)}</p>
      <span>{moment(mail.headers.date).format("DD-MMM-YYYY")}</span>
    </Card>
  );
};

export default EmailCard;
