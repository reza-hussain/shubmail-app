import React, { useState } from "react";
import parse from "html-react-parser";

import { Input } from "antd";
import Close from "@ant-design/icons/CloseOutlined";
import Editor from "../Editor";
import "react-quill/dist/quill.snow.css";
import EmailInput from "../EmailInput";

const MessageBox = ({
  setMessageOpen,
  emailsToSend,
  setEmailsToSend,
  body,
  mailSubject,
  setEditorState,
  editorState,
  ccEmails,
  bccEmails,
  setBccEmails,
  setCcEmails,
}) => {
  const [inputVal, setInputVal] = useState("");
  const [ccVal, setCcVal] = useState("");
  const [bccVal, setBccVal] = useState("");

  const [bccExpanded, setBccExpanded] = useState(false);
  const [ccExpanded, setCcExpanded] = useState(false);

  const [subject, setSubject] = useState("");

  return (
    <div
      className={`w-full max-h-full h-full overflow-auto z-[200] relative flex flex-col justify-start items-start rounded-xl border-solid border-[rgba(5,5,5,0.06)] p-4`}
    >
      <div className="absolute right-5 top-5 cursor-pointer z-50 flex justify-center items-center gap-2">
        <span
          className={`text-sm hover:text-blue-600 ${
            ccExpanded ? "text-blue-600" : ""
          }`}
          onClick={() => {
            setCcExpanded(!ccExpanded);
          }}
        >
          CC
        </span>
        <span
          className={`text-sm hover:text-blue-600 ${
            bccExpanded ? "text-blue-600" : ""
          }`}
          onClick={() => setBccExpanded(!bccExpanded)}
        >
          BCC
        </span>
        <span className="ml-5" onClick={() => setMessageOpen(false)}>
          <Close />
        </span>
      </div>
      <div className="w-full h-full relative flex flex-col justify-start items-start gap-x-1 gap-y-4 pt-12">
        <EmailInput
          items={emailsToSend}
          setItems={setEmailsToSend}
          value={inputVal}
          setValue={setInputVal}
          title="To"
        />

        {(ccEmails?.length > 0 || ccExpanded) && (
          <EmailInput
            items={ccEmails}
            setItems={setCcEmails}
            value={ccVal}
            setValue={setCcVal}
            title="CC"
          />
        )}

        {(bccEmails?.length > 0 || bccExpanded) && (
          <EmailInput
            items={bccEmails}
            setItems={setBccEmails}
            value={bccVal}
            setValue={setBccVal}
            title="BCC"
          />
        )}

        <Input
          className="hidden"
          placeholder="Enter subject"
          value={mailSubject ?? subject}
          disabled={mailSubject}
          onChange={(e) => setSubject(e.target.value)}
        />

        {body ? (
          <div className="w-full max-h-full ">{parse(body)}</div>
        ) : (
          <Editor value={editorState} setValue={setEditorState} />
        )}
      </div>
    </div>
  );
};

export default MessageBox;
