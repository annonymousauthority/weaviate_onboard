"use client";
import React, { useState } from "react";
import blackberry from "@/public/blackberry.png";
import durian from "@/public/durian-fruit.png";
import fruit from "@/public/fruit.png";
import orange from "@/public/orange.png";
import persimmon from "@/public/persimmon.png";
import strawberry from "@/public/strawberry.png";
import Image from "next/image";
import axios from "axios";
const fruitImages = {
  0: { src: strawberry, alt: "strawberry fruit", name: "strawberries" },
  1: { src: blackberry, alt: "blackberry fruit", name: "blackberries" },
  2: { src: fruit, alt: "banana fruit", name: "bananas" },
  3: { src: orange, alt: "orange fruit", name: "oranges" },
  4: { src: persimmon, alt: "persimmon fruit", name: "persimmons" },
  5: { src: durian, alt: "durian fruit", name: "durians" },
};
export default function MixerComponent() {
  const [fruitCounts, setFruitCounts] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [results, setResults] = useState([]);

  const incrementFruit = (fruitId) => {
    setFruitCounts((prevCounts) => ({
      ...prevCounts,
      [fruitId]: prevCounts[fruitId] + 1,
    }));
    mixFruit(fruitId);
  };
  const getSummary = () => {
    const summary = Object.keys(fruitCounts)
      .filter((key) => fruitCounts[key] > 0)
      .map(
        (key) => `${fruitCounts[key] * 100} grams of ${fruitImages[key].name}`
      )
      .join(", ");

    return summary ? `You've added ${summary}` : "No fruits added";
  };

  async function mixFruit(fruitId) {
    const resultsArray = [...results];
    try {
      const response = await axios.post(
        "https://8000-01hyx63njjxbnwr3yyf23mkzdw.cloudspaces.litng.ai/performsearch",
        { query: fruitImages[fruitId].name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        console.log(response.data);
        // Process the data as needed
      } else {
        console.log("Error:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
    }
    setResults(resultsArray);
  }
  return (
    <div className="h-screen flex flex-col items-center justify-start max-w-6xl mx-auto">
      <div className="mt-12 w-full bg-gray-600 h-[200px] rounded-2xl p-6 text-white">
        <h1>Fun Facts</h1>
      </div>

      <div className="flex flex-wrap justify-center items-center w-full mt-12 space-x-6">
        <div className="w-full lg:w-[32%] h-full rounded-2xl bg-gray-600 flex flex-col justify-between items-start p-3">
          <div>
            <h2 className="text-white font-extralight text-sm">
              Fruits are all in 100grams
            </h2>
            <div className=" w-full bg-gray-800 rounded-2xl p-2 flex flex-wrap gap-3 justify-start ">
              <button
                type="button"
                onClick={() => incrementFruit(parseInt(0))}
                className="bg-gray-300 rounded-xl p-2 hover:bg-gray-400 w-[50px] h-[50px] flex justify-center"
              >
                <Image
                  width={30}
                  height={30}
                  alt="strawberry fruit"
                  src={strawberry}
                />
              </button>
              <button
                type="button"
                onClick={() => incrementFruit(parseInt(1))}
                className="bg-gray-300 rounded-xl p-2 hover:bg-gray-400 w-[50px] h-[50px] flex justify-center"
              >
                <Image
                  width={30}
                  height={30}
                  alt="Blackberry fruit"
                  src={blackberry}
                />
              </button>
              <button
                type="button"
                onClick={() => incrementFruit(parseInt(2))}
                className="bg-gray-300 rounded-xl p-2 hover:bg-gray-400 w-[50px] h-[50px] flex justify-center"
              >
                <Image width={30} height={30} alt="fruit" src={fruit} />
              </button>
              <button
                onClick={() => incrementFruit(parseInt(3))}
                type="button"
                className="bg-gray-300 rounded-xl p-2 hover:bg-gray-400 w-[50px] h-[50px] flex justify-center"
              >
                <Image width={30} height={30} alt="orange fruit" src={orange} />
              </button>
              <button
                onClick={() => incrementFruit(parseInt(4))}
                type="button"
                className="bg-gray-300 rounded-xl p-2 hover:bg-gray-400 w-[50px] h-[50px] flex justify-center"
              >
                <Image
                  width={30}
                  height={30}
                  alt="persimmon fruit"
                  src={persimmon}
                />
              </button>
              <button
                onClick={() => incrementFruit(parseInt(5))}
                type="button"
                className="bg-gray-300 rounded-xl p-2 hover:bg-gray-400 w-[50px] h-[50px] flex justify-center"
              >
                <Image width={30} height={30} alt="durian fruit" src={durian} />
              </button>
            </div>
          </div>
          <div className="mt-12">
            {Object.keys(fruitCounts).map(
              (key) =>
                fruitCounts[key] > 0 && (
                  <div key={key} className="flex flex-col space-y-3">
                    <div className="flex space-x-2 justify-center items-center py-1">
                      <Image
                        width={30}
                        height={30}
                        alt={fruitImages[key].alt}
                        src={fruitImages[key].src}
                      />
                      <span className="text-white">x</span>
                      <span className="text-white">{fruitCounts[key]}</span>
                      <span className="text-white">==</span>
                      <span className="text-white">
                        {100 * fruitCounts[key]}
                      </span>
                    </div>
                  </div>
                )
            )}
          </div>
          <div className="mt-4 flex flex-col text-white space-y-2 w-full">
            <div className="w-full flex justify-between items-center">
              <span>Mix Summary</span>
              <button
                type="button"
                onClick={() => {
                  console.log(results);
                }}
                className="text-sm font-extralight text-blue-500 hover:text-blue-600 underline"
              >
                Mix Fruit
              </button>
            </div>
            <span className="text-sm font-extralight">{getSummary()}</span>
          </div>
        </div>
        <div className="w-full lg:w-[42%] h-[500px] rounded-2xl bg-gray-600 flex flex-col justify-center items-center"></div>
      </div>
    </div>
  );
}
