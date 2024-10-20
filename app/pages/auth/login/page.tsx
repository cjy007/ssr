"use client"

import Logger from "@/common/Logger";
import { useState } from "react";


export default function Page() {

  const [telNumber, setTelNumber] = useState<string>("");
  const handleTelNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Logger.info("handleTelNumberChange", event.target.value);
    setTelNumber(event.target.value); // 更新状态为输入值
  };

  const [pwd, setPwd] = useState<string>("");
  const handlePwdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Logger.info("handlePwdChange", event.target.value)
    setPwd(event.target.value); // 更新状态为输入值
  };


  const handleSubmit = async () => {
    console.log("Submitted", telNumber, pwd);

    // todo cjy 2023-11-29 21:41:42


  }

  return (
    <section>
      {/* Container */}
      <div className="grid gap-0 md:h-screen md:grid-cols-2">
        {/* Component */}
        <div className="flex items-center justify-center bg-gray-100">
          <div className="mx-auto max-w-md px-5 py-16 md:px-10 md:py-20">
            <div className="mb-5 flex h-14 w-14 flex-col items-center justify-center bg-white md:mb-6 lg:mb-8">
              <img
                src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a949eade6cf7d_Vector-2.svg"
                alt=""
                className="inline-block"
              />
            </div>
            <p className="mb-8 text-sm sm:text-base md:mb-12 lg:mb-16 text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
              aliquam, purus sit amet luctus venenatis, lectus magna fringilla
              urna, porttitor rhoncus dolor purus non enim.
            </p>
            <p className="text-sm font-bold sm:text-base">John Robert</p>
            <p className="text-sm sm:text-sm text-gray-500">
              Senior Webflow Developer
            </p>
          </div>
        </div>
        {/* Component */}
        <div className="flex items-center justify-center px-5 py-16 md:px-10 md:py-20">
          <div className="max-w-md text-center">
            <h2 className="mb-8 text-3xl font-bold md:mb-12 md:text-5xl lg:mb-16">
              Sign in
            </h2>
            {/* Form */}
            <div className="mx-auto mb-4 max-w-sm pb-4">
              <form name="wf-form-password">
                <div className="relative">
                  <img
                    alt=""
                    src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a9455fae6cf89_EnvelopeSimple.svg"
                    className="absolute left-5 top-3 inline-block"
                  />
                  <input
                    type="text"
                    className="mb-4 block h-9 w-full rounded-md border border-solid border-black px-3 py-6 pl-14 text-sm text-black placeholder:text-black"
                    placeholder="手机号"
                    value={telNumber}
                    onChange={handleTelNumberChange}
                    required={true}
                  />
                </div>
                <div className="relative">
                  <img
                  />
                </div>
                <div className="relative mb-4">
                  <img
                    alt=""
                    src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a946794e6cf8a_Lock-2.svg"
                    className="absolute left-5 top-3 inline-block"
                  />
                  <input
                    type="password"
                    className="mb-4 block h-9 w-full rounded-md border border-solid border-black px-3 py-6 pl-14 text-sm text-black placeholder:text-black"
                    placeholder="密码"
                    value={pwd}
                    onChange={handlePwdChange}
                    required={true}
                  />
                </div>
                <label className="mb-6 flex items-center justify-start pb-12 pl-5 font-medium md:mb-10 lg:mb-1">
                  <input
                    type="checkbox"
                    name="checkbox"
                    className="float-left mt-1"
                  />
                  <span
                    className="ml-4 inline-block cursor-pointer text-sm"
                    htmlFor="checkbox"
                  >
                    I agree with the
                    <a href="#" className="font-bold text-black">
                      Terms &amp; Conditions
                    </a>
                  </span>
                </label>
                <input
                  type="button"
                  onClick={handleSubmit}
                  value="登录"
                  className="inline-block w-full cursor-pointer items-center bg-black px-6 py-3 text-center font-semibold text-white"
                />
              </form>
            </div>
            <p className="text-sm text-gray-500 sm:text-sm">
              Already have an account?
              <a href="#" className="font-bold text-black">
                <span> </span> Login now
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}