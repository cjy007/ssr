


function Page() {
  console.log("aaaaa");

  const search = () => {
    console.log("search")
  };

  return (
    <section>
      {/* Header */}
      <header className=" mx-auto py-5 px-10 md:px-20 flex flex-col md:flex-row items-center justify-between border-b border-gray-300">
        <div className="absolute top-0 w-full left-1/2  -translate-x-1/2 ">
          <div className="w-full flex flex-col items-center bg-white border-b-2 border-black p-4 md:px-8 md:py-3 md:flex-row md:justify-between">
            <form
              name="email-form"
              method="get"
              className="relative mt-10 w-full md:mt-0 flex flex-col md:flex-row items-center gap-3 justify-center md:justify-end"
            >
              <input
                type="email"
                className="w-full rounded-md border border-solid border-gray-300 px-3 py-[10px] text-sm text-black placeholder:text-black"
                placeholder="url"
              />
              <input
                type="submit"
                value="Subscribe"
                className="w-full md:w-auto cursor-pointer rounded-md bg-black px-6 py-2 text-center font-semibold text-white"
              />
            </form>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="mx-auto w-full  pb-10">
        <div className="px-10 md:px-20">
          <div className="rounded-lg border-dashed border-gray-400 flex items-center justify-center text-gray-400 h-40 md:h-80 lg:h-[642px]">
            <p>Product List</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page