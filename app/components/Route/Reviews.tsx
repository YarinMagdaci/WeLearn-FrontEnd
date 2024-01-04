import Image from "next/image";
import React from "react";
import reviewsImage from "../../../public/assets/reviewsImage.jpg";
import { styles } from "../../styles/style";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

export const reviews = [
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Student | Cambridge University",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem",
  },
  {
    name: "Jane Smith",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    profession: "Engineer | MIT",
    comment:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    name: "Bob Johnson",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    profession: "Developer | Stanford",
    comment:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Alice Williams",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    profession: "Designer | Harvard",
    comment:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    name: "Michael Brown",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    profession: "Researcher | Oxford",
    comment:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

const Reviews = (props: Props) => {
  return (
    <div className="w-[90%] 800px:w-[85%] ml-[190px]">
      <div className="w-full 800px:flex items-center">
        <div className="800px:w-[50%] w-full">
          <Image src={reviewsImage} alt="" width={600} height={400} />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Our Students Are <span className="text-gradient">Out Strength</span>{" "}
            <br /> See What they Say About Us
          </h3>
          <br />
          <p className={styles.label}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque unde
            volupatutm dignissimos, nulla perferendis dolorem voluptate nemo
            possimus magni deleniti natus accusamus officiis quasi nihil
            commodi, prasentium quidem, quis doloribus?
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-35px] mb-12 border-0 md:[&>*:nth-child(6)]:!mt-[-40px]">
        {reviews &&
          reviews.map((review, index) => (
            <ReviewCard review={review} key={index} />
          ))}
      </div>
    </div>
  );
};

export default Reviews;
