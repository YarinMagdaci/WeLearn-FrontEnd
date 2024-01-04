import React from "react";
import { styles } from "../styles/style";

type Props = {};

const About = (props: Props) => {
  return (
    <div className="text-black dark:text-white w-full h-[610px]">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        What is <span className="text-gradient">WeLearn?</span>
      </h1>
      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto">
        <p className="text-[18px] font-Poppins">
          We are virtual school named WeLearn, we have staff roster of lecturers
          which acts as admins here
          <br />
          <br />
          We are going to give our best in teaching and educating you.
          <br />
          <br />
          We have YouTube Channel to give some &quot;previews&quot; about how
          lectures looks like in here. We have community of many students who
          already chose us that you can look at their reviews and be impressed
          with.
          <br />
          <br />
          So what are you waiting for? Join us:
        </p>
        <br />
      </div>
    </div>
  );
};

export default About;
