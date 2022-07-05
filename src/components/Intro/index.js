const Intro = () => (
  <div className="container">
    <div className="flex flex-col lg:flex-row justify-center lg:justify-between w-full items-center lg:px-8 gap-4">
      <div className="w-full flex flex-col items-center lg:items-start min-h-full justify-end lg:justify-start">
        <h1 className="text-4xl font-bold sm:text-6xl text-right md:text-7xl md:font-semibold my-6 selection:bg-slate-500 selection:text-slate-900">
          響け！
        </h1>
        <span className="text-pink-500 text-4xl font-bold sm:text-6xl md:text-7xl selection:bg-pink-500 selection:text-pink-900">
          ユーフォニアム
        </span>
      </div>
      <div className="w-full items-center h-full flex justify-center lg:justify-evenly selection:bg-amber-700">
        <img
          src="/img/my-wife-asuka.webp"
          width="485px"
          height="485px"
          alt="Istri Saya"
        />
      </div>
    </div>
  </div>
);

export default Intro;
