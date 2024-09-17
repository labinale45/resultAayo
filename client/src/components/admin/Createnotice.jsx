import React from "react";

function Createnotice({ onClose }) {
  return (
    <div>
      <div className="bg-white flex rounded-3xl shadow-2xl max-w-3xl p-3 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl font-bold"
        >
          &times;
        </button>

        <div className="sm:w-1/2 px=15">
          <div className="flex items-center mt-4">
            <img
              src="/assets/Addstudentorteacher.png"
              className="h-12 w-12 mr-2"
            />
            <h1 className="text-[#253553] underline text-2xl font-bold">
              __C r e a t e _ N o t i c e
            </h1>
          </div>

          <form className="flex-col gap-4">
            <label className="">Title</label>
            <input
              className="txt p-2 mt-6 w-80 rounded-xl border shadow-xl "
              type="text"
              placeholder="     Title"
            />
            <label className="">Image</label>

            <input
              className="txt p-2 mt-6  w-80 rounded-xl border shadow-xl"
              type="File"
              placeholder=" Image "
            />

            <button className="text-white shadow-xl font-bold bg-[#8AA4D6] w-80 p-3 mt-10 rounded-xl hover:bg-[#253553] duration-300">
              C R E A T E N O T I C E
            </button>
          </form>
        </div>

        <img className="rounded-3xl" src="/assets/popup.png" alt="" />
      </div>
    </div>
  );
}

export default Createnotice;
