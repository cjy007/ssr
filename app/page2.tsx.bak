'use client'
import React, { useState, useEffect } from 'react';

// import { useState } from "react"
import Image from "next/image";

export default function Home() {
  try {
    const [data, setData] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        let response = await fetch('https://dummyjson.com/users?limit=2');
        let result = await response.json();
        setData(result);
      };

      fetchData();
    }, []);

    console.log(data)

    if (!data) return <div>Loading...</div>

    return <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <ul>
            {data.users.map((user) => (
              <li key={user.id}>{user.username}:
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
