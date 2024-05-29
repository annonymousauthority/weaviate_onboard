"use client";
import React, { useEffect, useState } from "react";
import blackberry from "@/public/blackberry.png";
import durian from "@/public/durian-fruit.png";
import fruit from "@/public/fruit.png";
import orange from "@/public/orange.png";
import persimmon from "@/public/persimmon.png";
import strawberry from "@/public/strawberry.png";
import Image from "next/image";
import axios from "axios";
import LoaderSpinner from "./Loader-Comp";
const fruitImages = {
  0: { src: strawberry, alt: "strawberry fruit", name: "Strawberry" },
  1: { src: blackberry, alt: "blackberry fruit", name: "Blackberry" },
  2: { src: fruit, alt: "banana fruit", name: "Banana" },
  3: { src: orange, alt: "orange fruit", name: "Orange" },
  4: { src: persimmon, alt: "persimmon fruit", name: "Persimmon" },
  5: { src: durian, alt: "durian fruit", name: "Durian" },
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
  const [mixing, setMixing] = useState(false);
  const [typing, setTyping] = useState("");
  const [benefits, setBenefits] = useState("");
  const [funFact, setFunFact] = useState("");

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
    return summary ? `${summary}` : "No fruits added";
  };
  useEffect(() => {
    setResults([]);
  }, [benefits]);
  const formatText = (inputText) => {
    return inputText
      .replace(/\*\*(.*?)\*\*/g, "<h3>$1</h3>")
      .replace(/\n/g, "<br />");
  };
  const generatePrompt = async () => {
    if (getSummary() !== "No fruits added") {
      let PROMPT = `Provide the overal impact of freshly pressed: ${getSummary()}. Provide a short straight to the point summary only. Add 1 benefit and one drawback(if any) to drinking this`;
      setMixing(true);
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_LLAMAPROMPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: PROMPT }),
        });

        if (response.ok) {
          const data = await response.json();
          setBenefits(formatText(data[0].response));
          setMixing(false);
          generateFunFacts();
        } else {
          setMixing(false);
          console.log("Error:", response.status);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    } else {
      setBenefits("No Fruits Added");
    }
  };

  async function generateFunFacts() {
    let PROMPT = `Generate 1 fun fact about one of the fruits named in this text: ${getSummary()} return your answer in a string Don't add anything else to this object in your response. You can pick the fruit at random`;
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LLAMAPROMPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: PROMPT }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data[0].response);
        setFunFact(data[0].response);
      } else {
        console.log("Error:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async function mixFruit(fruitId) {
    const resultsArray = [...results];
    const existingEntry = resultsArray.find(
      (result) => result.fruit === fruitImages[fruitId].name
    );
    if (!existingEntry) {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_WEAVIATESEARCH_URL,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: fruitImages[fruitId].name }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          resultsArray.push({ fruit: fruitImages[fruitId].name, data: data });
          setResults(resultsArray);
        } else {
          console.log("Error:", response.status);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    }
  }
  return (
    <div className="h-screen flex flex-col items-center justify-start max-w-6xl mx-auto p-6">
      <div className="mt-12 w-full md:w-3/4 bg-gray-600 h-[150px] rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Fun Facts</h1>
        <span className="text-sm font-light">{funFact}</span>
      </div>

      <div className="flex flex-wrap justify-center items-center w-full mt-12 space-x-6">
        <div className="w-full md:w-[48%] lg:w-[32%] h-full rounded-2xl bg-gray-600 flex flex-col justify-between items-start p-3">
          <div>
            <div className="w-full flex justify-between items-center">
              <h2 className="text-white font-extralight text-sm">
                Fruits are all in 100grams
              </h2>
              <button
                type="button"
                onClick={() => {
                  setResults([]);
                  setBenefits("");
                }}
                className="underline text-red-500 text-sm"
              >
                Clear Mixture
              </button>
            </div>
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
                onClick={() => generatePrompt()}
                className="text-sm font-extralight text-blue-500 hover:text-blue-600 underline"
              >
                Mix Fruit
              </button>
            </div>
            <span className="text-sm font-extralight">{getSummary()}</span>
          </div>
        </div>
        <div className="w-full md:w-[48%] overflow-y-auto h-[500px] py-3 rounded-2xl bg-gray-600 flex flex-col justify-center items-center">
          {mixing ? (
            <LoaderSpinner />
          ) : (
            <div className="text-white text-left p-6 h-[450px] overflow-y-scroll">
              <span dangerouslySetInnerHTML={{ __html: benefits }}></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
