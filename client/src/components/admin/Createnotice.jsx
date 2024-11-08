import React,{useState} from "react";
import { IoPersonAddSharp } from "react-icons/io5";
function Createnotice({ onClose }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        let imageBase64 = '';
        if (image) {
            // Convert file to base64
            const reader = new FileReader();
            imageBase64 = await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(image);
            });
        }

        const responseExam = await fetch("http://localhost:4000/api/auth/create-notice",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            image: imageBase64,
          }),
        });
        if (!responseExam.ok){
          const error = await responseExam.json();
          throw new Error(error.message || "Failed to create Notice");
        }
        if(responseExam.ok){
          const data = await responseExam.json();
          alert(data.message);
          setTitle("");
          setDescription("");
          setImage("");
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium ">Title</label>
              <input
                className="txt p-2 w-80rem rounded-xl border shadow-xl text-black"
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                required
              />
               <label className="mb-2 text-sm font-medium ">Description</label>
              <input
                className="txt p-2 w-80rem rounded-xl border shadow-xl text-black"
                type="text"
                placeholder="Enter description.."
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium ">Image</label>
              <input
                className="txt p-2 w-80 rounded-xl border shadow-xl "
                type="file"
                accept="image/*"
                onChange={(e)=>setImage(e.target.files[0])}
              />
            </div>

            <button type="submit" className="w-40 ml-16 p-3 mt-3 rounded-xl bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center  shadow-xl font-bold ">
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
