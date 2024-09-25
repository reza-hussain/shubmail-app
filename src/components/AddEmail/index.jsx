import { useState } from "react";
import { Modal } from "antd";
import Outlook from "../../assets/outlook.svg";
import Gmail from "../../assets/Gmail.svg";
import { postRequest } from "../../services/inbox";

const AddEmail = ({ isModalOpen, handleCancel }) => {
  const [emailProvider, setEmailProvider] = useState("");
  // const [email, setEmail] = useState("");

  const handleOk = async () => {
    const response = await postRequest({
      url: "/gmail/auth",
    });

    window.location.href = response;

    console.log({ response });
  };

  return (
    <Modal
      title="Add Email"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className="addEmailModal"
      okText="Add Email"
    >
      <div className="w-full flex justify-center items-center gap-5">
        <button
          onClick={() => setEmailProvider("outlook")}
          className={`w-[50%] h-[80px] p-2 cursor-pointer flex justify gap-5 justify-center items-center  border-solid ${
            emailProvider === "outlook" ? "border-blue-500" : "border-[#d9d9d9]"
          } rounded-md`}
        >
          <img src={Outlook} alt="" className="w-[30%]" />
          <div className="flex flex-col justify-center items-center">
            <p className="text-gray-500">Sign in with</p>
            <p className="text-2xl font-medium">Outlook</p>
          </div>
        </button>
        <button
          onClick={() => setEmailProvider("gmail")}
          className={`w-[50%] h-[80px] p-2 cursor-pointer flex justify gap-5 justify-center items-center  border-solid ${
            emailProvider === "gmail" ? "border-blue-500" : "border-[#d9d9d9]"
          } rounded-md`}
        >
          <img src={Gmail} alt="" className="w-[30%]" />
          <div className="flex flex-col justify-center items-center">
            <p className="text-gray-500">Sign in with</p>
            <p className="text-2xl font-medium">Gmail</p>
          </div>
        </button>
      </div>

      {/* <Input
        placeholder="Enter email address"
        onChange={(e) => setEmail(e?.target?.value)}
        value={email}
      /> */}
    </Modal>
  );
};

export default AddEmail;
