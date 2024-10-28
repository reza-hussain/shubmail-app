import React, { useCallback, useEffect, useState } from "react";
import { Card, Checkbox } from "antd";
import parse from "html-react-parser";
import moment from "moment";
import { getRequest } from "../../services/inbox";
import { useStateValue } from "../../context/StateProvider";
import DOMPurify from "dompurify";
import {
  decodeAndCleanContent,
  fetchAttachment,
  processEmailContent,
} from "../../services/utils";

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

  const extractEmailContent = useCallback(
    async (payload) => {
      let htmlContent = null;
      const attachments = [];

      const findHtmlPart = async (parts) => {
        if (!parts || !Array.isArray(parts)) return null;

        const htmlExists = parts.some((part) => part?.mimeType === "text/html");

        for (const part of parts) {
          if (part?.parts) {
            const foundHtml = await findHtmlPart(part.parts);
            if (foundHtml) return foundHtml;
          }

          if (part?.mimeType === "text/html") {
            htmlContent = part.body?.data;
            return htmlContent;
          }

          if (!htmlExists && part?.body?.size > 0) {
            htmlContent = part.body?.data;
            return htmlContent;
          }
        }

        return null;
      };

      const processAttachments = async (parts) => {
        if (!parts || !Array.isArray(parts)) return;

        // Handle nested multipart/related content
        const relatedParts = parts.filter(
          (part) => part.mimeType === "multipart/related"
        );
        if (relatedParts.length > 0) {
          for (const relatedPart of relatedParts) {
            if (relatedPart.parts) {
              await processAttachments(relatedPart.parts);
            }
          }
          return;
        }

        // Process image attachments
        const imageParts = parts.filter(
          (part) =>
            part.mimeType?.startsWith("image/") && part.body?.attachmentId
        );

        for (const imagePart of imageParts) {
          const contentIdHeader = imagePart.headers?.find(
            (h) => h.name.toLowerCase() === "content-id"
          );

          if (contentIdHeader) {
            try {
              const attachmentData = await fetchAttachment(
                activeEmail,
                mail.id,
                imagePart.body.attachmentId
              );

              if (attachmentData) {
                attachments.push({
                  contentId: contentIdHeader.value.replace(/[<>]/g, ""),
                  mimeType: imagePart.mimeType,
                  data: attachmentData,
                });
              }
            } catch (error) {
              console.error(`Failed to fetch attachment: ${error.message}`);
            }
          }
        }
      };

      try {
        // Handle direct content in payload body
        if (payload?.body?.size > 0) {
          htmlContent = payload.body.data;
        } else {
          // Process HTML content and attachments concurrently
          await Promise.all([
            findHtmlPart(payload?.parts),
            processAttachments(payload?.parts),
          ]);
        }

        // Process the HTML content only after both operations are complete
        if (htmlContent) {
          const normalizedContent = htmlContent
            .replace(/-/g, "+")
            .replace(/_/g, "/");
          const decodedHtml = atob(normalizedContent);
          return await processEmailContent(
            decodedHtml,
            attachments,
            activeEmail
          );
        }

        return null;
      } catch (error) {
        console.error("Error processing email content:", error);
        return null;
      }
    },
    [activeEmail, mail.id]
  );

  const processThreadMessages = useCallback(
    async (messages) => {
      if (!messages?.length) return [];

      return Promise.all(
        messages.map(async (thread) => {
          const html = await extractEmailContent(thread?.payload);
          const processedThreadHtml = decodeAndCleanContent(html);

          return {
            from: thread?.payload?.headers?.find((h) => h.name === "From")
              ?.value,
            to: thread?.payload?.headers?.find((h) => h.name === "To")?.value,
            date: thread?.payload?.headers?.find((h) => h.name === "Date")
              ?.value,
            body: processedThreadHtml,
          };
        })
      );
    },
    [extractEmailContent]
  );

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

        const base64data = await extractEmailContent(response.payload);

        const processedHtml = decodeAndCleanContent(base64data);

        const threadData = await processThreadMessages(
          response?.threadData?.messages
        );

        const details = {
          from: response?.emailMetadata?.from,
          to: response?.emailMetadata?.to?.split(","),
          subject: response?.emailMetadata?.subject,
          date: response?.emailMetadata?.date,
          body: processedHtml,
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
