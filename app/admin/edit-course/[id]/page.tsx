"use client";
import React from "react";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import Heading from "../../../../app/utils/Heading";
import EditCourse from "../../../components/Admin/Course/EditCourse";
import DashboardHeader from "../../../components/Admin/DashboardHeader";

type Props = {};

const Page = ({ params }: any) => {
  const id = params?.id;
  return (
    <div>
      <Heading
        title="WeLearn - Admin"
        description="WeLearn is a platform for people to learn and lecturers to teach"
        keywords="Programming, Marketing, Courses, Online-Courses"
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[84%]">
          <DashboardHeader />
          {/* <CreateCourse /> */}
          <EditCourse id={id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
