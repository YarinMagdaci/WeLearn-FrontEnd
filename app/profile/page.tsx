"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC, useState } from "react";
import { Protected } from "../hooks/useProtected";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
type Props = {};

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth);
  return (
    <div className="min-h-screen">
      <Protected>
        <Heading
          title={`${user.name} profile - WeLearn`}
          description="WeLearn is a platform for people to learn and lecturers to teach"
          keywords="Programming, Marketing, Courses, Online-Courses"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} />
        <Footer />
      </Protected>
    </div>
  );
};

export default Page;
