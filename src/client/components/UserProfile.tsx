export const UserProfile = () => {
  return (
    <div className="h-2/6 flex flex-row border-dashed border-4 border-sky-500 rounded-lg mx-2">
      <div className="w-2/5 flex justify-center items-center">
        <div className="w-full aspect-square mx-1 flex justify-center items-center">
          <div className="rounded-full border-2 border-black w-full h-full aspect-square overflow-hidden">
            <img className="object-cover w-full h-full" src={logo} alt="logo" />
          </div>
        </div>
      </div>
      <div className="w-3/5 flex flex-col justify-center items-center p-4 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">sanghan</h1>
        <h2 className="text-2xl text-gray-700 mb-1">1승 15패</h2>
        <h3 className="text-xl text-gray-600">1295점</h3>
      </div>
    </div>
  );
};
