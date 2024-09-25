import { useEffect, useState } from "react";
import { Button, Input, Layout, Table } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

// components
import TableMenu from "../../components/TableMenu";
import AddEmail from "../../components/AddEmail";

// services
import { deleteRequest, getRequest, postRequest } from "../../services/inbox";
import useDebounce from "../../hooks/useDebounce";

const Emails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  const [params] = useSearchParams();
  const router = useNavigate();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "",
      dataIndex: "menu",
      key: "menu",
      render: (_, data) => (
        <TableMenu
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          data={data}
        />
      ),
      width: 10,
    },
  ];

  const handleButton = () => {
    setIsModalOpen(true);
  };

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await getRequest({
        url: `/gmail/get-emails?search=${search ?? ""}`,
      });

      const data = response?.map((item) => ({
        key: item?._id,
        name: item?.email,
        menu: true,
      }));

      setDataSource(data);
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (ids) => {
    setSelectedEmails(ids);
  };

  const handleDelete = async (email) => {
    try {
      await deleteRequest({
        url: `/gmail/delete-emails`,
        data: {
          emailIds: email ? [email] : selectedEmails,
        },
      });
    } catch (error) {
      throw new Error(error);
    } finally {
      fetchEmails();
    }
  };

  const handleEdit = async () => {};

  useDebounce(
    () => {
      fetchEmails();
    },
    [search],
    800
  );

  useEffect(() => {
    const code = params.get("code");
    console.log({ code });

    const url = window.location.pathname;

    if (code) {
      (async () => {
        await postRequest({
          url: "/gmail/oauth2callback",
          data: {
            code: code,
          },
        });
        router(url);
      })();
    }
    // eslint-disable-next-line
  }, [params]);

  return (
    <Layout className="w-full container bg-white !mt-5 flex flex-col justify-start items-center gap-4">
      <div className="w-full flex justify-between items-center gap-5">
        <Input
          placeholder={isModalOpen ? "Enter new email" : "Search emails"}
          className="w-full"
          onChange={(e) => setSearch(e?.target?.value)}
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
        loading={loading}
        rowSelection={{ type: "checkbox", onChange: handleSelect }}
      />
      {selectedEmails?.length > 0 && (
        <div className="w-full flex justify-end items-center gap-4 bg-white z-[100]">
          <Button onClick={handleEdit}>Edit</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      )}
      <AddEmail
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
      />
    </Layout>
  );
};

export default Emails;
