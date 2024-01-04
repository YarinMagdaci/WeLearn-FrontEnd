/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { redirect } from "next/navigation";
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";
import React, { FC, useEffect } from "react";
import Loader from "../../components/Loader";
import CourseAccessContent from "../../components/Course/CourseAccessContent";

type Props = {
  params: any;
};

const Page: FC<Props> = ({ params }) => {
  const id = params.id;
  const { isLoading, error, data } = useLoadUserQuery(undefined, {});
  useEffect(() => {
    console.log("data: ", data);
    if (data) {
      const isPurchased = data.user.courses.find(
        (item: any) => item._id === id
      );

      console.log("isPurchased: ", isPurchased);
      if (!isPurchased) {
        redirect("/");
      }
    }
    console.log("error: ", error);
    if (error) {
      redirect("/");
    }
  }, [data, error, id]);

  return (
    <>
      {isLoading || !data || !data.user ? (
        <Loader />
      ) : (
        <div>
          <CourseAccessContent id={id} user={data.user} />
        </div>
      )}
    </>
  );
};

export default Page;
