import React from "react";

function Marksentry({ onClose }) {
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
            <Image
              src="/assets/Addstudentorteacher.png"
              className="h-12 w-12 mr-2"
              width={12}
              height={12}
              alt="Addstudentorteacher"
            />
            <h1 className="text-[#253553] underline text-2xl font-bold">
              __Mark entry
            </h1>
          </div>

          <form className="flex-col gap-2">
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

        <div className="w-1/3">
          <label for="photo-upload" class="cursor-pointer"></label>

          <input type="file" id="photo-upload" class="hidden" />
        </div>
        <Image width={500} height={500} className="rounded-3xl" src="/assets/popup.png" alt="" />
      </div>
    </div>
  );
}

export default Marksentry;
