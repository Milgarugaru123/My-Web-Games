"use client";

import Btn from "@/src/Btn";
import Card from "@/src/cards/Card";
import { useState } from "react";

const Home = () => {
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const toggleBtn = () => {
    setIsBtnClicked((prev) => {
      return (prev = !prev);
    });
  };

  return (
    <>
      <div className={`mx-auto mt-5 mb-2`}>
        <Btn
          func={toggleBtn}
          desc={isBtnClicked ? `카드 목록 숨기기` : `카드 목록 보기`}
        />
      </div>
      <div className={`h-full`}>{isBtnClicked ? <Card /> : <></>}</div>
    </>
  );
};

export default Home;
