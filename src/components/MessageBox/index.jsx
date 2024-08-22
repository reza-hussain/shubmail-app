import React, { useState } from "react";
import parse from "html-react-parser";

import { Input, Tag } from "antd";
import Close from "@ant-design/icons/CloseOutlined";
import { v4 as uuidv4 } from "uuid";

const { TextArea } = Input;

const MessageBox = ({
  setMessageOpen,
  emailsToSend,
  setEmailsToSend,
  body,
  mailSubject,
}) => {
  const [inputVal, setInputVal] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState(false);

  const onEmailSubmit = (e) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    if (e.key === "Enter") {
      if (emailRegex.test(e.target.value)) {
        setEmailsToSend((prev) => [...prev, e.target.value]);

        setInputVal("");
        setError(false);
      } else {
        setError(true);
      }
    }
  };

  const handleTagRemove = (tagId) => {
    const updatedEmails = emailsToSend?.filter((email) => email.id !== tagId);

    setEmailsToSend(updatedEmails);
  };

  return (
    <div
      className={`w-full relative flex flex-col justify-start items-start border-solid border-[rgba(5,5,5,0.06)] p-4`}
    >
      <span
        className="absolute right-5 top-5 cursor-pointer z-50"
        onClick={() => setMessageOpen(false)}
      >
        <Close />
      </span>
      <div className="w-full relative flex flex-wrap justify-start items-center gap-x-1 gap-y-4">
        <div className="basis-full">To</div>
        {emailsToSend?.map((email) => (
          <Tag closeIcon onClose={() => handleTagRemove(email)}>
            {email}
          </Tag>
        ))}
        <Input
          onKeyDown={onEmailSubmit}
          placeholder="Add email"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          status={error ? "error" : ""}
        />

        <Input
          placeholder="Enter subject"
          value={mailSubject ?? subject}
          disabled={mailSubject}
          onChange={(e) => setSubject(e.target.value)}
        />
        {body ? (
          <div className="w-full overflow-auto max-h-[250px] ">
            <p className="w-full p-4 text-center">
              ------------------------------ Forwarded message
              ------------------------------
            </p>
            {parse(body)}
          </div>
        ) : (
          <TextArea placeholder="Enter message" style={{ height: 250 }} />
        )}
      </div>
    </div>
  );
};

export default MessageBox;
