import { Dropdown, Space } from "antd";
import React from "react";

const TableMenu = ({ data, handleDelete, handleEdit }) => {
  const menuItems = [
    {
      label: "Delete Email",
      onClick: () => handleDelete(data.key),
    },
    {
      label: "Edit Email",
      onClick: () => handleEdit(),
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
