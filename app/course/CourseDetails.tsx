import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Ratings from "../utils/Ratings";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CoursePlayer from "../utils/CoursePlayer";
import Link from "next/link";
import { styles } from "../styles/style";
import CourseContentList from "./CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "../components/Payment/CheckOutForm";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";
import Image from "next/image";
import noProfileAvatar from "../../public/assets/avatar.jpg";
import { VscVerifiedFilled } from "react-icons/vsc";
type Props = {
  data: any;
  clientSecret: any;
  stripePromise: any;
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};

const CourseDetails: FC<Props> = ({
  data,
  clientSecret,
  stripePromise,
  setRoute,
  setOpen: openAuthModal,
}) => {
  // const { user } = useSelector((state: any) => state.auth);
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState(false);
  const discountPercentage =
    ((data?.estimatedPrice - data.price) / data?.estimatedPrice) * 100;
  const discountPercentagePrice = discountPercentage.toFixed(0);
  const isPurchased =
    user && user?.courses?.find((item: any) => item._id === data._id);
  const handleOrder = (e: any) => {
    if (user) {
      setOpen(true);
    } else {
      setRoute("Login");
      openAuthModal(true);
    }
  };

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data.ratings} />
                <h5 className="text-black dark:text-white">
                  {data.reviews?.length} Reviews
                </h5>
              </div>
              <h5 className="text-blacak dark:text-white">
                {data.purchased} Students
              </h5>
            </div>
            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What will you learn from this Course?
            </h1>
            <div>
              {data.benefits?.map((item: any, index: number) => (
                <div
                  className="w-full flex 800px:items-center py-2"
                  key={index}
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What are the prerequisites for starting this course?
            </h1>
            {data.prerequisites?.map((item: any, index: number) => (
              <div className="w-full flex 800px:items-center py-2" key={index}>
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline
                    size={20}
                    className="text-black dark:text-white"
                  />
                </div>
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
            <br />
            <br />
            <div>
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Overview
              </h1>
              {/* CourseContentList Component */}
              <CourseContentList data={data?.courseData} isDemo={true} />
            </div>
            <br />
            <br />
            {/* Course description */}
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Details
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data.description}
              </p>
            </div>
            <br />
            <br />
            <div className="w-full">
              <div className="800px:flex items-center">
                <Ratings rating={data?.ratings} />
                <div className="mb-2 800px:mb-[unset]" />
                <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                  {Number.isInteger(data?.ratings)
                    ? data?.ratings.toFixed(1)
                    : data?.ratings.toFixed(2)}{" "}
                  Course Rating &#x2022; {data?.reviews?.length} Reviews
                </h5>
              </div>
              <br />
              {(data?.reviews && [...data.reviews].reverse()).map(
                (item: any, index: number) => (
                  <div className="w-full pb-4" key={index}>
                    <div className="flex">
                      <div className="w-[50px] h-[50px]">
                        {/* <div className="w-[50px] h-[50px] bg-slate-600 rounded-[50px] flex items-center justify-center cursor-pointer">
                          <h1 className="uppercase text-[18px] text-black dark:text-white">
                            {item.user.name.slice(0, 2)}
                          </h1>
                        </div> */}
                        <div>
                          <Image
                            src={
                              item?.user.avatar
                                ? item?.user.avatar.url
                                : noProfileAvatar
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="hidden 800px:block pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[18px] pr-2 text-black dark:text-white">
                            {item.user.name}
                          </h5>
                          <Ratings rating={item.rating} />
                        </div>
                        <p className="text-black dark:text-white">
                          {item.comment}
                        </p>
                        <small className="text-[#000000d1] dark:text-[#ffffff83]">
                          {format(item.createdAt)} &#x2022;
                        </small>
                      </div>
                      <div className="pl-2 flex 800px:hidden items-center">
                        <h5 className="text-[18px] pr-2 text-black dark:text-white">
                          {item.user.name}
                        </h5>
                        <Ratings rating={item.rating} />
                      </div>
                    </div>
                    {item.commentReplies.map((cReply: any, index: number) => (
                      <div
                        key={cReply._id}
                        className="w-full flex 800px:ml-16 my-5"
                      >
                        <div className="w-[50px] h-[50px]">
                          <Image
                            src={
                              cReply?.user.avatar
                                ? cReply?.user.avatar.url
                                : noProfileAvatar
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                        <div className="pl-2">
                          <div className="flex items-center">
                            <h5 className="text-[20px]">{cReply.user.name}</h5>
                            <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                          </div>
                          <p>{cReply.comment}</p>
                          <small className="dark:text-[#ffffff83] text-black">
                            {format(cReply.createdAt)} &#x2022;
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="w-full 800px:w-[35%] relative">
            <div className="top-[100px] left-0 z-50 w-full">
              <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px] text-black dark:text-white">
                  {data.price === 0 ? "Free" : data.price + "$"}
                </h1>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
                  {data.estimatedPrice}$
                </h5>
                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                  {discountPercentagePrice}% Off
                </h4>
              </div>
              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    href={`/course-access/${data._id}`}
                  >
                    Enter to Course
                  </Link>
                ) : (
                  <div
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    onClick={handleOrder}
                  >
                    Buy Now {data.price}$
                  </div>
                )}
              </div>
              <br />
              <p className="pb-1">&#x2022; Source code included</p>
              <p className="pb-1">&#x2022; Full access</p>
              <p className="pb-1">&#x2022; Certificate of completion</p>
              <p className="pb-3 800px:pb-1">&#x2022; Premium Support</p>
            </div>
          </div>
        </div>
      </div>
      <>
        {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="w-full">
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckOutForm setOpen={setOpen} data={data} user={user} />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default CourseDetails;
