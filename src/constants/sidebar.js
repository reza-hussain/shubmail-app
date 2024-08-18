import { v4 as uuidv4 } from "uuid";
import { useStateValue } from "../context/StateProvider";

export const useSidebarItems = (children) => {
  const { inbox, setInbox } = useStateValue();

  return [
    {
      key: `inbox`,
      label: "Inbox",
      children: children.map((child) => {
        const subKey = uuidv4();
        return {
          key: subKey,
          label: child.email,
        };
      }),
    },
    {
      key: "more",
      label: "More",
      children: [
        {
          key: "unread",
          label: "Unread Emails",
          style: {
            background: "#fff",
            border: "none",
          },
          onTitleClick: () => {
            setInbox();
          },
        },
        {
          key: "sent",
          label: "Sent Emails",
          style: {
            background: "#fff",
            border: "none",
          },
          onTitleClick: () => {
            setInbox();
          },
        },
      ],
    },
  ];
};
