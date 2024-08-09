import { Input, Tag } from "antd";
import Close from "@ant-design/icons/CloseOutlined";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const { TextArea } = Input;

const MessageBox = ({ setMessageOpen }) => {
  const [emails, setEmails] = useState([
    {
      name: "shubham.more@gmail.com",
      id: "0",
    },
    {
      name: "alireza@gmail.com",
      id: "1",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState(false);

  const onEmailSubmit = (e) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (e.key === "Enter") {
      if (emailRegex.test(e.target.value)) {
        setEmails((prev) => [
          ...prev,
          {
            name: e.target.value,
            id: uuidv4(),
          },
        ]);

        setInputVal("");
        setError(false);
      } else {
        setError(true);
      }
    }
  };

  const handleTagRemove = (tagId) => {
    const updatedEmails = emails?.filter((email) => email.id !== tagId);

    setEmails(updatedEmails);
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
        {emails?.map((email) => (
          <Tag closeIcon onClose={() => handleTagRemove(email.id)}>
            {email.name}
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
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextArea placeholder="Enter message" style={{ height: 250 }} />
      </div>
    </div>
  );
};

export default MessageBox;
