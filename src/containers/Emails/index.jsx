import { useState } from "react";
import { Button, Checkbox, Input, Layout, Table } from "antd";
import TableMenu from "../../components/TableMenu";
import AddEmail from "../../components/AddEmail";

const Emails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dataSource = [
    {
      key: "1",
      name: "shubham.more@gmail.com",
      menu: true,
    },
    {
      key: "2",
      name: "alireza@gmail.com",
      menu: true,
    },
  ];

  const columns = [
    {
      title: "",
      dataIndex: "checkbox",
      key: "checkbox",
      render: () => <Checkbox></Checkbox>,
      width: 10,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "",
      dataIndex: "menu",
      key: "menu",
      render: (_, data) => <TableMenu data={data} />,
      width: 10,
    },
  ];

  const handleButton = () => {
    setIsModalOpen(true);
  };

  return (
    <Layout className="w-full container bg-white !mt-5 flex flex-col justify-start items-center gap-4">
      <div className="w-full flex justify-between items-center gap-5">
        <Input
          placeholder={isModalOpen ? "Enter new email" : "Search emails"}
          className="w-full"
        />

        <Button
          onClick={handleButton}
          className="bg-white text-black hover:!bg-black hover:!text-white hover:!border-[#d9d9d9]"
        >
          Add New
        </Button>
      </div>

      <Table
        className="w-full"
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <AddEmail
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
      />
    </Layout>
  );
};

export default Emails;
