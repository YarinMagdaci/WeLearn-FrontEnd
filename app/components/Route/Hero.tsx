import Image from "next/image";
import React, { FC, useState } from "react";
// import banner from "../../../public/assets/banner.jpg";
import avatar from "../../../public/assets/avatar.jpg";
import { BiSearch } from "react-icons/bi";
import Link from "next/link";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Loader from "../Loader";
import { useRouter } from "next/navigation";
type Props = {};

const Hero: FC<Props> = (props) => {
  const { data, isLoading } = useGetHeroDataQuery("Banner", {});
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search.length === 0) {
      return;
    }
    router.push(`/courses?title=${search}`);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full 1000px:flex items-center">
          {/* todo: fill the end of the className, maybe it's relative? */}
          <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:h-[600px] 1100px:w-[600px] h-[50vh] w-[50vh] hero_animation rounded-[50%] 1100px:left[18-rem] 1500px:left[21-rem] overflow-hidden"></div>
          <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10">
            <Image
              src={data?.layout?.banner?.image?.url}
              width={400}
              height={400}
              alt=""
              className="top-[50%] left-[50%] mr-[15%] object-contain 1100px:max-w-[80%] w-[80%] 1500px:max-w-[75%] h-[auto] z-[10]"
            />
          </div>
          <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]">
            {/* todo: fill the end of the className */}
            <h2 className="dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px] 1500:w-[60%]">
              {data?.layout?.banner?.title}
            </h2>
            <br />
            <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%]">
              {data?.layout?.banner?.subTitle}
            </p>
            <br />
            <br />
            <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px] bg-transparent relative">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Courses..."
                className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin"
              />
              <div
                className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]"
                onClick={handleSearch}
              >
                <BiSearch className="text-white" size={30} />
              </div>
            </div>
            <br />
            <br />
            {/* icons of already registered users: */}
            <div className="1500px:w[55%] 1100px:w-[78%] w-[90%] flex items-center">
              <Image src={avatar} alt="" className="rounded-full w-10 h-10" />
              <Image
                src={avatar}
                alt=""
                className="rounded-full w-10 h-10 ml-[-20px]"
              />
              <Image
                src={avatar}
                alt=""
                className="rounded-full w-10 h-10 ml-[-20px]"
              />
              <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600]">
                You all deserve the best courses!
                <Link
                  href="/courses"
                  className="dark:text-[#46e256] text-[crimson]"
                >
                  &nbsp;View Courses
                </Link>
              </p>
            </div>
            <br />
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
