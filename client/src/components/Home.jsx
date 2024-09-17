import React from "react";

function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-10 h-10 bg-gradient-to-r from-blue-50 to-blue-950 rounded-full animate-fly1"></div>

      <div
        className="absolute top-0 left-0 w-0 h-0
                      border-l-[25px] border-l-transparent
                      border-b-[50px] border-b-blue-200
                      border-r-[25px] border-r-transparent
                      animate-fly2"
      ></div>

      <div className="absolute top-0 left-0 w-10 h-10 bg-gradient-to-r from-blue-50 to-blue-950 triangle-full animate-fly3"></div>
      <main className="flex flex-col items-center justify-center min-h-screen py-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 p-1">
          <div className="h-[90%]">
            <img
              src="/assets/Ellipse1.png"
              className="h-[100%] w-[100%] z-40"
            />
            <img src="/assets/Cloud 1.png" className="mt-[-40%]" />
          </div>
          <div className="h-[90%]">
            <h1 className="text-center mt-36 text-2xl font-bold">
              This is Result aayo
            </h1>
            <img
              src="/assets/Girl.png"
              className="animate-[bounce_10] mt-[60%]"
            />
          </div>
          <div className="h-[90%]">
            <img src="/assets/Ellipse2.png" className="h-[100%] z-40" />
            <img src="/assets/Cloud 2.png" className="mt-[-6%] ml-40" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
