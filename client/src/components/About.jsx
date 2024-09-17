import Link from "next/link";
import { AiOutlineMail } from "react-icons/ai";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function About() {
  return (
    <div>
      <div
        id="about"
        className="w-full md:h-screen p-2 flex items-center py-16"
      >
        <div className="max-w-[1240px] m-auto md:grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <p className="uppercase text-xl tracking-widest font-bold text-[#161366]">
              {" "}
              About us
            </p>
            <h2 className="py-4 text-4xl">Who we are?</h2>
            <p className="py-2 text-3xl font-bold text-gray-600 ">Team RAYS</p>
            <p className="py-2 text-lg text-gray-600 ">
              We, Team Rays, comprised of Rabin, Aasha, Yubraj, and Supriya, are
              BICTE students specializing in web application development.{" "}
            </p>
            <p className="py-2 text-lg text-gray-600 ">
              We possess expertise in both front-end and back-end technologies,
              integrating user-friendly designs with robust server-side
              solutions. Focused on educational technology, we aim to innovate
              and create scalable, efficient web applications that enhance
              online learning and resource management. With a strong foundation
              in project management and collaboration, we strive to lead in the
              intersection of web development and digital education,
              continuously advancing our skills through practical experience and
              community engagement.{" "}
            </p>{" "}
            <p className="py-2 text-gray-600 "></p>
          </div>
          <div className="w-full h-auto m-auto shadow-2xl shadow-gray-400 flex items-center justify-center p-4 hover:scale-105 case-in duration-300">
            <img src="/assets/Rays.jpeg" className="rounded-xl" />
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] m-auto md:grid grid-cols-4 gap-20 mt-[-7%]">
        <div className="col-span-1 m-10 hover:scale-105 case-in duration-300">
          <img src="assets/Rabin.jpg" className="size-52 rounded-full " />
          <p className="font-bold text-xl flex justify-center">Rabin Ale</p>
          <p className=" flex justify-center">Full Stack Developer</p>
          <br />
          <div className="md:grid grid-cols-3 gap-4">
            <a
              href="https://www.linkedin.com/in/rabin-ale-07650a1a3/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="col-span-1 rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100 flex justify-center">
                <FaLinkedinIn />
              </div>
            </a>
            <a
              href="https://github.com/labinale45"
              target="_blank"
              rel="noreferrer"
            >
              <div className="col-span-1  rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100 flex justify-center">
                <FaGithub />
              </div>
            </a>
            <Link href="https://www.instagram.com/rabinale45/?hl=en">
              <div className="col-span-1 rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100 flex justify-center">
                <FaInstagram />
              </div>
            </Link>
          </div>
          <div></div>
        </div>
        <div className="col-span-1 m-10 ">
          <img src="assets/Aasha.jpg" className="size-52 rounded-full" />
          <p className="font-bold text-xl flex justify-center">
            Aasha Shrestha
          </p>
          <p className=" flex justify-center">Front End Developer</p>
          <br />
          <div className="md:grid grid-cols-3 gap-4">
            <a
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="col-span-1 rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100 flex justify-center">
                <FaLinkedinIn />
              </div>
            </a>
            <a
              href="https://github.com/AashaShrestha2058"
              target="_blank"
              rel="noreferrer"
            >
              <div className="col-span-1  rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100 flex justify-center">
                <FaGithub />
              </div>
            </a>
            <Link href="https://www.instagram.com/aashaa_shrestha/?hl=en">
              <div className="col-span-1 rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100 flex justify-center">
                <FaInstagram />
              </div>
            </Link>
          </div>
        </div>
        <div className="col-span-1 m-10 ">
          <img src="assets/Yubraj.jpg" className="size-52 rounded-full" />
          <p className="font-bold text-xl flex justify-center">
            Yubraj Dauliya
          </p>
          <p className=" flex justify-center">Full Stack Developer</p>
          <br />
          <div className="md:grid grid-cols-3 gap-4">
            <a
              href="https://www.linkedin.com/in/yubraj-dauliya-49178921b/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="col-span-1 rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100 flex justify-center">
                <FaLinkedinIn />
              </div>
            </a>
            <a
              href="https://github.com/Yubraj0127"
              target="_blank"
              rel="noreferrer"
            >
              <div className="col-span-1  rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100 flex justify-center">
                <FaGithub />
              </div>
            </a>
            <Link href="https://www.instagram.com/yubrajdauliya/?hl=en">
              <div className="col-span-1 rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100 flex justify-center">
                <FaInstagram />
              </div>
            </Link>
          </div>
        </div>
        <div className="col-span-1 m-10 hover:scale-105 case-in duration-300">
          <img src="assets/Supriya.jpg" className="size-52 rounded-full" />
          <p className="font-bold text-xl flex justify-center">
            Supriya Shrestha
          </p>
          <p className=" flex justify-center">Front End Developer</p>
          <br />
          <div className="md:grid grid-cols-3 gap-4">
            <a
              href="https://www.linkedin.com/in/supriya-shrestha-ab04ab285/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="col-span-1 rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100 flex justify-center">
                <FaLinkedinIn />
              </div>
            </a>
            <a
              href="https://github.com/supriyastha"
              target="_blank"
              rel="noreferrer"
            >
              <div className="col-span-1  rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100 flex justify-center">
                <FaGithub />
              </div>
            </a>
            <Link href="https://www.instagram.com/annoying__cactus/?hl=en">
              <div className="col-span-1 rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100 flex justify-center">
                <FaInstagram />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
