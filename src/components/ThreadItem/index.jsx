import React, { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

const ThreadItem = ({ data, isLastItem }) => {
  const ref = useRef(null);

  const [isExpanded, setIsExpanded] = useState(isLastItem);

  useEffect(() => {
    if (isLastItem) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLastItem, isExpanded]);

  const cleanHTML = DOMPurify.sanitize(data?.body);

  return (
    <div
      ref={ref}
      className={`w-full py-4 flex flex-col justify-start items-start border-0 border-solid border-b border-gray-300 gap-5 ${
        isExpanded ? "!border-gray-500" : ""
      }`}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex flex-col justify-start gap-2 items-start cursor-pointer"
      >
        <p>{data?.date}</p>
        <h3>From: {data?.from}</h3>
        <h4 className="text-gray-600 font-medium">To: {data?.to}</h4>
      </div>

      {isExpanded ? parse(cleanHTML ?? "") : <></>}
    </div>
  );
};

export default ThreadItem;
