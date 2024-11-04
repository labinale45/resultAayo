import React from "react";
import { IoPersonAddSharp } from "react-icons/io5";
function Createnotice({ onClose }) {
  return (
    <div>
      <div className="bg-white dark:bg-[#253553] dark:text-white  text-black  flex rounded-3xl shadow-2xl max-w-3xl p-3 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl font-bold"
        >
          &times;
        </button>

        <div className="sm:w-1/2 px-15">
          <div className="flex items-center mt-4">
            <IoPersonAddSharp className="h-7 w-12 mr-2  " />
            <h1 className=" underline text-2xl font-bold">
              _C r e a t e _N o t i c e
            </h1>
          </div>

          <form className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium ">Title</label>
              <input
                className="txt p-2 w-80rem rounded-xl border shadow-xl text-black"
                type="text"
                placeholder="Enter title"
              />
               <label className="mb-2 text-sm font-medium ">Description</label>
              <input
                className="txt p-2 w-80rem rounded-xl border shadow-xl text-black"
                type="text"
                placeholder="Enter description.."
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium ">Image</label>
              <input
                className="txt p-2 w-80 rounded-xl border shadow-xl "
                type="file"
                accept="image/*"
              />
            </div>

            <button className="w-40 ml-16 p-3 mt-3 rounded-xl bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center  shadow-xl font-bold ">
              C R E A T E 
            </button>
          </form>
        </div>

        <img
          className="rounded-3xl sm:block hidden w-1/2"
          src="/assets/popup.png"
          alt=""
        />
      </div>
    </div>
  );
}

export default Createnotice;
