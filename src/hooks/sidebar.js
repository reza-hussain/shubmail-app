import { useEffect } from "react";
import { useStateValue } from "../context/StateProvider";
import { getRequest } from "../services/inbox";

export const useSidebarItems = (children) => {
  const {
    setInbox,
    setActiveEmail,
    currentPage,
    setInboxLoader,
    activeEmail,
    inboxLoader,
    setPagination,
    search,
    emailLoader,
  } = useStateValue();

  const fetchData = async (data, type) => {
    data && setActiveEmail(data);
    setInboxLoader(true);

    try {
      const response =
        (data || activeEmail) &&
        (await getRequest({
          url: `/gmail/${
            data ?? activeEmail
          }/read-all-emails?page=${currentPage}&pageSize=10&type=${
            type ?? "inbox"
          }${search ? `&search=${search}` : ""}`,
        }));
      setInbox(response?.messages);
      setPagination(response?.pagination);
    } catch (error) {
      throw new Error(error);
    } finally {
      setInboxLoader(false);
    }
  };

  const handleClick = async (data) => {
    if (data?.key !== activeEmail) await fetchData(data);

    localStorage.setItem("activeEmail", JSON.stringify(data.key));
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      const active = JSON.parse(localStorage.getItem("activeEmail"));
      fetchData(active ?? activeEmail);
      setActiveEmail(active);
    }, 1000);

    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [currentPage, search]);

  return {
    sidebarItems: [
      {
        key: `inbox`,
        label: emailLoader ? "Loading..." : "Inbox",

        children: children?.map((child) => {
          return {
            key: child?._id,
            label: child?.email,
            title: child?.email,
            onClick: handleClick,
            disabled: inboxLoader,
          };
        }),
      },
    ],
    fetchData,
  };
};
