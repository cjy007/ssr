"use client"
import React, { useState, useEffect } from 'react';

import Image from "next/image";


interface Result {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * 基本类型：
 *  number：表示数字，如整数和浮点数。
 *  string：表示字符串。
 *  boolean：表示布尔值（true 或 false）。
 *  null：表示空值。
 *  undefined：表示未定义值。
 * 特殊类型：
 *  symbol：表示唯一的标识符。
 *  bigint：表示大整数。
 * 对象类型：
 *  数组：number[]、string[]等。
 *  元组：[string, number]等。
 *  函数：(param: string) => void等。
 *  类实例：如 new Date() 的实例。
 * 字面量类型：
 *  const 字面量：'hello'、42 等具体值类型
 */
interface User {
  id: number;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  hair: Hair;
}

interface Hair {
  color: string;
  type: string;
}


export default function Home() {
  const [data, setData] = useState<Result | undefined>(undefined);
  try {
    // let ret = await fetch('https://dummyjson.com/users?limit=10', {
    //   method: 'GET',
    //   headers: {

    //   },
    //   body: null,
    // }).then(resp => resp.json())
    // let posts = await resp.json()
    // console.log("ret => ", ret)

    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch('https://dummyjson.com/users?limit=20');
        const result: Result = await response.json();
        console.log(result)
        setData(result);
      };

      fetchData();
    }, []);

    // if (!data) {
    //   return <div>数据加载中</div>;
    // }

    return <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <ul>
            {data?.users.map((user) => (
              <li key={user.id}>{JSON.stringify(user)}:
                <Image
                  src={user.image}
                  alt="Picture of the author"
                  width={50}
                  height={50}
                />
              </li>
            ))}
          </ul>
        </div>
      </main>;
  } catch (error) {
    console.error('Fetch error:', error);
    return <div>数据加载失败</div>;
  }
}
