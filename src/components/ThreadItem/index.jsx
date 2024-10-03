import React, { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";

const ThreadItem = ({ data, isLastItem }) => {
  const ref = useRef(null);

  const [isExpanded, setIsExpanded] = useState(isLastItem);

  useEffect(() => {
    if (isLastItem) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLastItem]);

  return (
    <div
      ref={ref}
      className="w-full pb-2 flex flex-col justify-start items-start border-0 border-solid border-b border-gray-200"
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex flex-col justify-start gap-2 items-start cursor-pointer"
      >
        <p>{data?.date}</p>
        <h3>{data?.from}</h3>
        <p>{data?.to}</p>
      </div>

      {isExpanded ? parse(data?.body ?? "") : <></>}
    </div>
  );
};

export default ThreadItem;
