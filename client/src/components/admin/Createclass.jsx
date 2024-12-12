"use client"
import React from "react";
import { TagsInput } from "react-tag-input-component";
import { useState } from "react";
import { IoPersonAddSharp } from "react-icons/io5";
import Image from "next/image";

function Createclass({ onClose }) {
  const [className, setClassName] = useState("");
  const [sec, setSec] = useState("");
  const [subject, setSubjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseClass = await fetch("http://localhost:4000/api/auth/create-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ className, sec, subject }),
      });
      if (!responseClass.ok) {
        throw new Error("Failed to create class");
      }
      if (responseClass.ok) {
        const data = await responseClass.json();
        alert(data.message);
        setClassName("");
        setSec("");
        setSubjects([]);
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-white dark:bg-[#253553] dark:text-white  text-black  flex rounded-3xl shadow-2xl max-w-3xl p-3 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl font-bold"
      >
        &times;
      </button>

      <div className="sm:w-1/2 px=15">
        <div className="flex items-center mt-4">
          <IoPersonAddSharp className="h-7 w-12 mr-2  " />
          <h1 className=" underline text-2xl font-bold">_C r e a t e _C l a s s</h1>
        </div>
        <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2">Class:</label>
            <input
              className="txt p-2 w-80 rounded-xl border shadow-xl text-black"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter Class"
            />
          </div>
          <div>
            <label className="block mb-2">Section:</label>
            <input
              className="txt p-2 w-80 rounded-xl border shadow-xl text-black"
              type="text"
              value={sec}
              onChange={(e) => setSec(e.target.value)}
              placeholder="Enter section"
            />
          </div>

          <div>
            <label className="block mb-2">Subject:</label>
            <div className="w-80 h-24 overflow-y-auto border rounded-xl shadow-xl text-black">
              <TagsInput
                value={subject}
                onChange={setSubjects}
                name="Subjects"
                placeHolder="Enter Subjects"
                className="w-full h-full"
              />
            </div>
          </div>

          <button
          type="submit"
           className=" w-32 p-3 ml-24 mt-4 rounded-xl bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center  shadow-xl font-bold "
          >
            C R E A T E
          </button>
        </form>
      </div>

      <Image
        className="rounded-3xl sm:block w-full"
        width={500}
        height={500}
        src="/assets/popup.png"
        alt=""
      />
    </div>
  );
}

export default Createclass;
