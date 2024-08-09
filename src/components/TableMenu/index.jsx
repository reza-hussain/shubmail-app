import { Dropdown, Space } from "antd";
import React from "react";

const TableMenu = ({ data }) => {
  console.log({ data });

  const menuItems = [
    {
      label: "Delete Email",
      onClick: () => alert("hello"),
    },
    {
      label: "Edit Email",
      onClick: () => alert("hello"),
    },
  ];

  return (
    <Dropdown
      className="cursor-pointer"
      menu={{
        items: menuItems,
      }}
      trigger={["click"]}
    >
      <Space>...</Space>
    </Dropdown>
  );
};

export default TableMenu;
