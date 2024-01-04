import { useGetCourseContentQuery } from "../../../redux/features/courses/coursesApi";
import React, { FC, useState } from "react";
import Loader from "../Loader";
import Heading from "../../utils/Heading";
import Header from "../Header";
import CourseContentMedia from "./CourseContentMedia";
import Footer from "../Footer";
import CourseContentList from "../../course/CourseContentList";

type Props = {
  id: string;
  user: any;
};

const CourseAccessContent: FC<Props> = ({ id, user }) => {
  const {
    data: contentData,
    isLoading,
    refetch,
  } = useGetCourseContentQuery(id, { refetchOnMountOrArgChange: true });
  const data = contentData?.content;
  const [activeVideo, setActiveVideo] = useState(0);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            open={open}
            setOpen={setOpen}
            activeItem={1}
            setRoute={setRoute}
            route={route}
          />
          <div className="w-full grid 800px:grid-cols-10">
            <Heading
              title={data[activeVideo]?.title}
              description="WeLearn is a platform for people to learn and lecturers to teach"
              keywords={data[activeVideo]?.tags}
            />
            <div className="col-span-7">
              <CourseContentMedia
                data={data}
                id={id}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
                user={user}
                refetch={refetch}
              />
            </div>
            <div className="hidden 800px:block 800px:col-span-3">
              <CourseContentList
                setActiveVideo={setActiveVideo}
                data={data}
                activeVideo={activeVideo}
              />
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default CourseAccessContent;
