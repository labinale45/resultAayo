import React from "react";

export default function Createexam({ onClose }) {
  return (
    <div>
      <div className="bg-white flex rounded-3xl shadow-2xl max-w-5xl p-3 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl font-bold"
        >
          &times;
        </button>

        <div className="flex w-full">
          <div className="w-2/3 px-4">
            <div className="flex items-center mt-4">
              <img
                src="/assets/Addstudentorteacher.png"
                className="h-12 w-12 mr-2"
              />
              <h1 className="text-[#253553] underline text-2xl font-bold">
                Create Exam
              </h1>
            </div>

            <form className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <label htmlFor="examType" className="block mb-2">
                  Exam Type:
                </label>
                <input
                  className="txt p-2 rounded-xl border w-full h-10 shadow-xl"
                  type="text"
                  id="examType"
                  placeholder="Exam Type"
                />
              </div>

              <div>
                <label htmlFor="deadlineDate" className="block mb-2">
                  Deadline date for Teacher:
                </label>
                <input
                  className="txt p-2 rounded-xl w-full h-10 border shadow-xl"
                  type="date"
                  id="deadlineDate"
                  placeholder="Deadline Date"
                />
              </div>

              <div>
                <label htmlFor="deadlineTime" className="block mb-2">
                  Deadline time for Teacher:
                </label>
                <input
                  className="txt p-2 rounded-xl w-full h-10 border shadow-xl"
                  type="time"
                  id="deadlineTime"
                  placeholder="Deadline Time"
                />
              </div>

              <div>
                <label htmlFor="resultDate" className="block mb-2">
                  Result Date:
                </label>
                <input
                  className="txt p-2 rounded-xl w-full h-10 border shadow-xl"
                  type="date"
                  id="resultDate"
                  placeholder="Result Date"
                />
              </div>

              <div>
                <label htmlFor="resultTime" className="block mb-2">
                  Result Time:
                </label>
                <input
                  className="txt p-2 rounded-xl w-full h-10 border shadow-xl"
                  type="time"
                  id="resultTime"
                  placeholder="Result Time"
                />
              </div>

              <div className="col-span-2 mt-6">
                <button className="text-white shadow-xl font-bold bg-[#8AA4D6] w-80 p-3 mt-6 rounded-xl hover:bg-[#253553] duration-300">
                  {" "}
                  A D D
                </button>
              </div>
            </form>
          </div>

          <div className="w-1/3">
            <img
              className="rounded-3xl w-full h-full object-cover"
              src="/assets/popup.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
