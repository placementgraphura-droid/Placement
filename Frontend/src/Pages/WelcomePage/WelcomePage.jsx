import Navbar from './Navbar'; // Update path if needed

export default function WelcomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col relative"
      style={{ backgroundImage: "url('/v1_5.png')" }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Inserted section below navbar */}
      {/* <div className="relative w-full max-w-screen-xl h-44 mx-auto mt-100">
        <div className="absolute left-1/4 top-0 w-28 h-4 bg-cyan-700" />
        <div className="absolute left-1/4 top-4 w-3/4 h-36 bg-cyan-800" />
        <div className="absolute left-0 top-0 w-1/3 h-44 bg-gradient-to-b from-blue-400 to-cyan-700" />
        <div className="absolute left-10 top-6 w-28 h-1 rotate-90 outline outline-[5px] outline-offset-[-2px] outline-white" />
        <div className="absolute left-[30%] top-0 w-9 h-5 bg-blue-400" />

        <div className="absolute left-12 top-14 text-white text-5xl sm:text-6xl font-bold">
          100+
        </div>

        <div className="absolute left-48 top-16 text-white text-3xl sm:text-5xl font-semibold">
          Openings
        </div>
      </div>

      {/* Main content space */}
      {/* <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8"> */}
        {/* Add hero text/buttons later */}
      </div>
    // </div> */}
  );
}
