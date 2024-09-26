"use client"
import React, { useState, useEffect } from 'react';

function Page() {
  const [inputValue, setInputValue] = useState(''); // 初始化状态
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // 更新状态为输入值
  };


  const [data, setData] = useState("等待查询");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);


  const search = async () => {
    console.log("查询url:", inputValue)
    if (inputValue == '') {
      return;
    }

    setLoading(true);
    setError(null); // 重置错误状态
    try {
      const response = await fetch('https://d1-worker-test.changjy0213.workers.dev/');
      console.log(response)
      if (!response.ok) {
        throw new Error('网络响应不正常');
      }
      const result = await response.json();
      setData(JSON.stringify(result));
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        console.log(err)
      }
    } finally {
      setLoading(false);
    }
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
                className="w-full rounded-md border border-solid border-gray-300 px-3 py-[10px] text-sm text-black placeholder:text-zinc-400"
                placeholder="请输入url"
                value={inputValue}
                onChange={handleChange} // 监听输入变化
              />
              {/* <input
                type="submit"
                value="Subscribe"
                className="w-full md:w-auto cursor-pointer rounded-md bg-black px-6 py-2 text-center font-semibold text-white"
              /> */}
              <button
                type="button"
                className="w-full md:w-auto cursor-pointer rounded-md bg-black px-6 py-2 text-center font-semibold text-white"
                onClick={search}
              >
                searh
              </button>
            </form>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="mx-auto w-full  pb-10">
        <div className="px-10 md:px-20">
          <div className="rounded-lg border-dashed border-gray-400 flex items-center justify-center text-gray-400 h-40 md:h-80 lg:h-[642px]">
            {data}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page