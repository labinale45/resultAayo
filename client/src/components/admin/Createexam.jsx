"use client";
import { IoPersonAddSharp } from "react-icons/io5";
import React,{useState,  useEffect} from "react";

export default function Createexam({ onClose }) {
const [examType, setExamType] = useState("");
const [ddate, setDdate] = useState("");
const [dtime, setDtime] = useState("");
const [rdate, setRdate] = useState("");
const [rtime, setRtime] = useState("");
const [successMessage, setSuccessMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  try{
    const responseExam = await fetch("http://localhost:4000/api/auth/create-exam",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        examType,
        ddate,
        dtime,
        rdate,
        rtime,
      }),
    });
    if (!responseExam.ok){
      const error = await responseExam.json();
      throw new Error(error.message || "Failed to create Exam");
    }
    if(responseExam.ok){
      const data = await responseExam.json();
      alert(data.message);
      setExamType("");
      setDdate("");
      setDtime("");
      setRdate("");
      setRtime("");
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  }
  catch (error){
    console.error(error);
  }
};


  return (
    <div>
      <div className="bg-white dark:bg-[#253553] dark:text-white  flex rounded-3xl shadow-2xl max-w-5xl p-3 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl font-bold"
        >
          &times;
        </button>

        <div className="flex w-full">
          <div className="w-2/3 px-4">
            <div className="flex items-center mt-4">
              <IoPersonAddSharp className="h-7 w-12 mr-2  " />
              <h1 className=" underline text-2xl font-bold">_C r e a t e _E x a m</h1>
            </div>
            
            <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="examType" className="block mb-2">
                  Exam Type:
                </label>
                <input
                  className="txt p-2 rounded-xl border w-full h-10 shadow-xl text-black"
                  type="text"
                  value={examType}
                  placeholder="Exam Type"
                  onChange={(e) => setExamType(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="deadlineDate" className="block mb-2">
                  Deadline date for Teacher:
                </label>
                <input
                  className="txt p-2 rounded-xl w-full h-10 border shadow-xl text-black"
                  type="date"
                 value={ddate}
                  placeholder="Deadline Date"
                  onChange={(e) => setDdate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="deadlineTime" className="block mb-2">
                  Deadline time for Teacher:
                </label>
                <input
                  className="txt p-2 rounded-xl w-full h-10 border shadow-xl text-black"
                  type="time"
                 value={dtime}
                  placeholder="Deadline Time"
                  onChange={(e) => setDtime(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="resultDate" className="block mb-2">
                  Result Date:
                </label>
                <input
                  className="txt p-2 rounded-xl w-full h-10 border shadow-xl text-black"
                  type="date"
                  value={rdate}
                  placeholder="Result Date"
                  onChange={(e) => setRdate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="resultTime" className="block mb-2">
                  Result Time:
                </label>
                <input
                  className="txt p-2 rounded-xl w-full h-10 border shadow-xl text-black"
                  type="time"
                  value={rtime}
                  placeholder="Result Time"
                  onChange={(e) => setRtime(e.target.value)}
                  required
                />
              </div>
              <div>
              <button
              type="submit" 
               className="w-32 ml-16 p-3 mt-6 rounded-xl bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center  shadow-xl font-bold ">
                  
                  C R E A T E
                </button>
                </div>

             
            </form>
          </div>

          <div className="w-1/3">
            <Image
              className="rounded-3xl  h-full "
              width={full}
              height={full}
              src="/assets/popup.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
