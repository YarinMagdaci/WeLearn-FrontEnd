import toast from "react-hot-toast";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "../../../../redux/features/layout/layoutApi";
import { styles } from "../../../styles/style";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import Loader from "../../Loader";

type Props = {};

const EditHero: FC<Props> = (props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();
  const [refetechingRendering, setRefetchingRendering] = useState(false);
  useEffect(() => {
    if (data) {
      setTitle(data.layout?.banner.title);
      setSubTitle(data.layout?.banner.subTitle);
      setImage(data.layout?.banner?.image?.url);
    }
    if (isSuccess && !refetechingRendering) {
      toast.success("Hero updated successfully!");
      setRefetchingRendering(true);
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
    return () => setRefetchingRendering(false);
  }, [data, isSuccess, error]); // maybe need to remove 'refetch'

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEdit = async () => {
    await editLayout({ type: "Banner", image, title, subTitle });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="w-full 1000px:flex items-center justify-between">
        <div
          className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:h-[500px] 1100px:w-[500px] h-[50vh] w-[50vh] hero_animation rounded-[50%] 1100px:left[18-rem] 1500px:left[21-rem] mt-[1000px] ml-8 overflow-hidden"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* <div className="relative inset-0 flex items-center justify-end"> */}
          <input
            type="file"
            name=""
            id="banner"
            accept="image/*"
            onChange={handleUpdate}
            className="hidden"
          />
          <label
            htmlFor="banner"
            className="absolute top-[50%] left-[50%] transform-translate-[-50%, -50%]"
          >
            <AiOutlineCamera
              size={40}
              className="dark:text-black text-black text-[18px] cursor-pointer"
            />
          </label>
          {/* </div> */}
        </div>
      </div>
      <div className="mt-[20%] ml-[1000px] flex flex-col">
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={4}
          // className="w-[300px] h-[150px] p-2 border border-gray-300 rounded-md"
          className="dark:text-white resize-none text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[60px] 1500px:text-[70px] font-[600]"
        />
        <textarea
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          rows={4}
          // className="mt-4 w-[300px] h-[150px] p-2 border border-gray-300 rounded-md"
          className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[74%] bg-transparent"
        />
      </div>
      <br />
      <br />
      <br />
      <div
        className={`${
          styles.button
        } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
          data?.layout?.banner?.title !== title ||
          data?.layout?.banner?.subTitle !== subTitle ||
          data?.layout?.banner?.image?.url !== image
            ? "!cursor-pointer !bg-[#42d383]"
            : "!cursor-not-allowed"
        } !rounded absolute bottom-12 right-12`}
        onClick={
          data?.layout?.banner?.title !== title ||
          data?.layout?.banner?.subTitle !== subTitle ||
          data?.layout?.banner?.image?.url !== image
            ? handleEdit
            : () => null
        }
      >
        Save
      </div>
    </>
  );
};

export default EditHero;
