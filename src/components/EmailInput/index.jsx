import React, { useRef, useState } from "react";
import { Input, Tag } from "antd";
import { useDetectClickOutside } from "react-detect-click-outside";

const EmailInput = ({ items, setItems, value, setValue, title }) => {
  const [error, setError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const parentRef = useDetectClickOutside({
    onTriggered: () => setIsFocused(false),
  });
  const inputRef = useRef();

  const handleTagRemove = (tagId, type) => {
    const updatedEmails = items?.filter((email) => email !== tagId);

    setItems(updatedEmails);
  };

  const handleSubmit = (e) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    if (e.key === "Enter") {
      if (emailRegex.test(e.target.value)) {
        setItems((prev) => [...prev, e.target.value]);

        setValue("");
        setError(false);
      } else {
        setError(true);
      }
    }
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFocused(true);
        setError(false);
        inputRef?.current?.focus();
      }}
      ref={parentRef}
      className="w-full flex justify-start items-stretch gap-4 border-solid border-0 border-b-[1px] border-gray-200 pb-2"
    >
      <span className="w-full basis-[5%]">{title}</span>
      <div className="max-w-[80%] w-full scrollbar-hidden overflow-hidden flex justify-start items-start">
        {isFocused ? (
          <div className="w-full flex justify-start items-start gap-2 flex-wrap">
            {items?.map((email) => (
              <Tag closeIcon onClose={() => handleTagRemove(email, "to")}>
                {email?.includes("<")
                  ? email?.split("<")?.[1]?.split(">")?.[0]
                  : email}
              </Tag>
            ))}
            <Input
              ref={inputRef}
              onKeyDown={handleSubmit}
              placeholder="Add email"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              status={error ? "error" : ""}
              className="max-w-[175px] !p-0 text-sm border-0 leading-0 focus:shadow-none rounded-md"
            />
          </div>
        ) : (
          <div className="w-full flex justify-start items-center gap-2 cursor-pointer">
            {items?.slice(0, 3)?.map((email, idx) => (
              <p key={email}>{`${email?.split("<")[0]}${
                idx !== items?.length - 1 ? "," : ""
              }`}</p>
            ))}
            {items?.length > 3 && <Tag>{`${items?.length - 3} more`}</Tag>}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailInput;
