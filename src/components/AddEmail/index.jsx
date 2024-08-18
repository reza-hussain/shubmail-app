import { Button, Input, Modal, Radio } from "antd";
import Outlook from "../../assets/outlook.svg";
import Gmail from "../../assets/Gmail.svg";
import { useState } from "react";

const AddEmail = ({ isModalOpen, handleOk, handleCancel }) => {
  const [emailProvider, setEmailProvider] = useState("");

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
        <div
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
        </div>
        <div
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
        </div>
      </div>

      <Input placeholder="Enter email address" />
    </Modal>
  );
};

export default AddEmail;
