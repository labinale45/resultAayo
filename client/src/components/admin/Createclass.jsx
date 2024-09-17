import React from "react";
import { TagsInput } from "react-tag-input-component";

function Createclass({ onClose }) {
  // const [year, setYear] = useState("");
  // const [className, setClassName] = useState("");
  // const [section, setSection] = useState("");
  const [subjects, setSubjects] = useState([]);

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
              Create Class
            </h1>
          </div>
          <form className="flex flex-col gap-4 mt-6">
            <div>
              <label className="block mb-2">Class:</label>
              <input
                className="txt p-2 w-80 rounded-xl border shadow-xl"
                type="text"
                placeholder="Enter Class"
              />
            </div>
            <div>
              <label className="block mb-2">Section:</label>
              <input
                className="txt p-2 w-80 rounded-xl border shadow-xl"
                type="text"
                placeholder="Enter section"
              />
            </div>

            <div>
              <label className="block mb-2">Subject:</label>
              <TagsInput
                value={subjects}
                onChange={setSubjects}
                name="subjects"
                placeHolder="Enter subjects"
              />
            </div>

            <button className="text-white shadow-xl font-bold bg-[#8AA4D6] w-80 p-3 mt-6 rounded-xl hover:bg-[#253553] duration-300">
              Create
            </button>
          </form>
        </div>

        <img className="rounded-3xl" src="/assets/popup.png" alt="" />
      </div>
    </div>
  );
}

export default Createclass;
