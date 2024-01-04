/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import FAQ from "../components/FAQ/FAQ";
import Footer from "../components/Footer";
type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");
  return (
    <div className="min-h-screen">
      <Heading
        title="FAQ - WeLearn"
        description="WeLearn is a learning management system for helping programmers."
        keywords="programming, learning, teaching"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        route={route}
        setRoute={setRoute}
      />
      <FAQ />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default Page;
