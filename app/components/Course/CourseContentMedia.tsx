import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import { styles } from "../../styles/style";
import CoursePlayer from "../../utils/CoursePlayer";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import noProfileAvatar from "../../../public/assets/avatar.jpg";
import toast from "react-hot-toast";
import {
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "../../../redux/features/courses/coursesApi";
import { format } from "timeago.js";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import Ratings from "../../utils/Ratings";

import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  data: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
  refetch: any;
};

const CourseContentMedia: FC<Props> = ({
  data,
  id,
  activeVideo,
  setActiveVideo,
  user,
  refetch,
}) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);
  const [replyToReview, setReplyToReview] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [
    addNewQuestion,
    {
      isSuccess: questionCreationIsSuccess,
      error: questionCreationIsError,
      isLoading: questionCreationIsLoading,
    },
  ] = useAddNewQuestionMutation();

  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(
    id,
    { refetchOnMountOrArgChange: true }
  );

  const course = courseData?.course;

  const [
    addAnswerInQuestion,
    {
      isSuccess: addAnswerIsSuccess,
      error: addAnswerIsErrror,
      isLoading: addAnswerIsLoading,
    },
  ] = useAddAnswerInQuestionMutation();

  const [
    addReviewInCourse,
    {
      isSuccess: addReviewIsSuccess,
      error: addReviewIsError,
      isLoading: addReviewIsLoading,
    },
  ] = useAddReviewInCourseMutation();

  const [
    addReplyInReview,
    {
      isSuccess: addReplyInReviewIsSuccess,
      error: addReplyInReviewIsErrror,
      isLoading: addReplyInReviewIsLoading,
    },
  ] = useAddReplyInReviewMutation();

  // reminder: data = course
  const isReviewExists = course?.reviews?.find(
    (rev: any) => rev.user._id === user._id
  );

  const handleQuestion = () => {
    if (question.length === 0) {
      toast.error("Question can't be empty!");
      return;
    }
    addNewQuestion({
      question,
      courseId: id,
      contentId: data[activeVideo]._id,
    });
  };

  useEffect(() => {
    // we need to refetch our data after adding question/s.
    if (questionCreationIsSuccess) {
      setQuestion("");
      refetch();
      toast.success("Question added successfully!");
      socketId.emit("notification", {
        title: `New Question Received`,
        message: `You have a new question in ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    if (addAnswerIsSuccess) {
      setAnswer("");
      refetch();
      toast.success("Answer added successfully!");
      if (user.role !== "admin") {
        socketId.emit("notification", {
          title: `New Question Reply Received`,
          message: `You have a new question reply in ${data[activeVideo].title}`,
          userId: user._id,
        });
      }
    }
    if (questionCreationIsError) {
      if ("data" in questionCreationIsError) {
        const errorMessage = questionCreationIsError.data as any;
        toast.error(errorMessage.message);
      }
    }
    if (addAnswerIsErrror) {
      if ("data" in addAnswerIsErrror) {
        const errorMessage = addAnswerIsErrror.data as any;
        toast.error(errorMessage.message);
      }
    }
    if (addReviewIsSuccess) {
      setReview("");
      setRating(1);
      // refetch();
      courseRefetch();
      toast.success("Review added successfully!");
      socketId.emit("notification", {
        title: `New Review Recieved`,
        message: `${user.name} has given a review in ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    if (addReviewIsError) {
      if ("data" in addReviewIsError) {
        const errorMessage = addReviewIsError.data as any;
        toast.error(errorMessage.message);
      }
    }
    if (addReplyInReviewIsSuccess) {
      setReplyToReview("");
      courseRefetch();
      toast.success("Reply added successfully!");
    }
    if (addReplyInReviewIsErrror) {
      if ("data" in addReplyInReviewIsErrror) {
        const errorMessage = addReplyInReviewIsErrror.data as any;
        toast.error(errorMessage.message);
      }
    }
  }, [
    addAnswerIsErrror,
    addAnswerIsSuccess,
    questionCreationIsError,
    questionCreationIsSuccess,
    addReviewIsSuccess,
    addReviewIsError,
    addReplyInReviewIsSuccess,
    addReplyInReviewIsErrror,
    refetch,
    courseRefetch,
  ]);

  const handleAnswerSubmit = () => {
    addAnswerInQuestion({
      answer,
      questionId,
      courseId: id,
      contentId: data[activeVideo]._id,
    });
    // console.log("handleAnswerSubmit was called");
  };

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Review can't be empty");
    } else {
      addReviewInCourse({ review, rating, courseId: id });
    }
  };

  const handleAddReplyToReview = () => {
    if (replyToReview.length === 0) {
      toast.error("Reply cannot be empty!");
      return;
    }
    addReplyInReview({ comment: replyToReview, courseId: id, reviewId });
  };

  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer
        title={data[activeVideo]?.title}
        videoUrl={data[activeVideo]?.videoUrl}
      />
      <div className="w-full flex items-center justify-between my-3">
        <div
          className={`${
            styles.button
          } dark:text-white !w-[unset] !min-h-[40px] !py-[unset] ${
            activeVideo === 0 && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft className="mr-2" />
          Prev Lesson
        </div>
        <div
          className={`${
            styles.button
          } dark:text-white !w-[unset] !min-h-[40px] !py-[unset] ${
            activeVideo === data.length - 1 && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data && activeVideo === data.length - 1
                ? activeVideo
                : activeVideo + 1
            )
          }
        >
          <AiOutlineArrowRight className="ml-2" />
          Next Lesson
        </div>
      </div>
      <h1 className="pt-2 text-[25px] font-[600] dark:text-white text-black ">
        {data[activeVideo].title}
      </h1>
      <br />
      {/* iterating over the array: */}
      <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <h5
            key={index}
            className={`800px:text-[20px cursor-pointer ${
              activeBar === index
                ? "text-red-500"
                : "dark:text-white text-black"
            }`}
            onClick={() => setActiveBar(index)}
          >
            {text}
          </h5>
        ))}
      </div>
      <br />
      {activeBar === 0 && (
        <p className="text-[18px] whitespace-pre-line mb-3 dark:text-white text-black">
          {data[activeVideo]?.description}
        </p>
      )}
      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links.map((item: any, index: number) => (
            <div key={index} className="mb-5">
              <h2 className="800px:text-[20px] 800px:inline-block dark:text-white text-black">
                {item.title && item.title + " :"}
              </h2>
              <a
                className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2"
                href={item.url}
              >
                {item.url}
              </a>
            </div>
          ))}
        </div>
      )}
      {activeBar === 2 && (
        <>
          <div className="flex w-full">
            <Image
              src={user.avatar ? user.avatar.url : noProfileAvatar}
              width={50}
              height={50}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <textarea
              name=""
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              id=""
              cols={40}
              rows={5}
              placeholder="Write your question..."
              className="dark:outline-none dark:bg-transparent ml-3 mb-2 border-slate-800 dark:text-white text-black dark:border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"
            ></textarea>
          </div>
          <div className="w-full flex justify-end">
            <div
              className={`${
                styles.button
              } !w-[120px] !h-[40px] text-[18px] mt-5${
                questionCreationIsLoading && "cursor-not-allowed"
              }`}
              onClick={questionCreationIsLoading ? () => {} : handleQuestion}
              // onClick={isLoading ? null : null}
            >
              Submit
            </div>
          </div>
          <br />
          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
          <div>
            {/* questionReply */}
            <CommentReply
              data={data}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              user={user}
              questionId={questionId}
              setQuestionId={setQuestionId}
              addAnswerIsLoading={addAnswerIsLoading}
            />
          </div>
        </>
      )}
      {activeBar === 3 && (
        <div className="w-full">
          <>
            {!isReviewExists && (
              <>
                <div className="flex w-full">
                  <Image
                    src={user.avatar ? user.avatar.url : noProfileAvatar}
                    width={50}
                    height={50}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                  <div className="w-full">
                    <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black">
                      Give a Rating <span className="text-red-500">*</span>
                    </h5>
                    <div className="flex w-full ml-2 pb-3">
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                    <textarea
                      name=""
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      id=""
                      cols={40}
                      rows={5}
                      placeholder="Write your review..."
                      className="outline-none bg-transparent 800px:ml-3 border dark:border-[#ffffff57] border-[#000] dark:text-white text-black w-[95%] 800px:w-full p-2 rounded text-[18px] font-Poppins"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <div
                    className={`${
                      styles.button
                    } !w-[120px] !h-[40px] text-[18px] mt-5 800px:mr-0 mr-2 ${
                      addReviewIsLoading && "cursor-no-drop"
                    }`}
                    onClick={addReviewIsLoading ? () => {} : handleReviewSubmit}
                  >
                    Submit
                  </div>
                </div>
              </>
            )}
            <br />
            <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
            {/* show all reviews */}
            <div className="w-full">
              {(course?.reviews && [...course.reviews].reverse()).map(
                (item: any, index: number) => (
                  <div key={item._id} className="w-full my-5">
                    <div className="w-full flex dark:text-white text-black">
                      {/* <div className="w-[50px] h-[50px]">
                        <div className="w-[50px] h-[50px] bg-slate-600 rounded-[50px] flex items-center justify-center cursor-pointer">
                          <h1 className="uppercase text-[18px]">
                            {item.user.name.slice(0, 2)}
                          </h1>
                        </div>
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
                      <div className="ml-2">
                        <h1 className="text-[18px]">{item?.user.name}</h1>
                        <Ratings rating={item.rating} />
                        <p>{item.comment}</p>
                        <small className="dark:text-[#ffffff83] text-black">
                          {format(item.createdAt)} &#x2022;
                        </small>
                      </div>
                    </div>
                    {user.role === "admin" &&
                      item.commentReplies.length === 0 && (
                        <span
                          className={`${styles.label} !ml-10 cursor-pointer`}
                          onClick={() => {
                            setIsReviewReply(!isReviewReply);
                            setReviewId(item._id);
                          }}
                        >
                          {isReviewReply && "Hide Add Reply"}
                          {!isReviewReply && "Add Reply"}
                        </span>
                      )}
                    {isReviewReply && reviewId === item._id && (
                      <div className="w-full flex relative">
                        <input
                          type="text"
                          placeholder="Enter your reply..."
                          value={replyToReview}
                          onChange={(e) => setReplyToReview(e.target.value)}
                          className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b dark:border-[#fff] border-[#000] dark:text-white text-black p-[5px] w-[95%]"
                        />
                        <button
                          type="submit"
                          className="absolute right-0 bottom-1 dark:text-white text-black"
                          onClick={handleAddReplyToReview}
                          disabled={addReplyInReviewIsLoading}
                          // onClick={isLoading ? null : handleReplyToReviewSubmit}
                          // disabled={isLoading}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                    {item.commentReplies.map((cReply: any, index: number) => (
                      <div
                        key={cReply._id}
                        className="w-full flex 800px:ml-16 my-5 text-black dark:text-white"
                      >
                        <div className="w-[50px] h-[50px]">
                          {/* <div className="w-[50px] h-[50px] bg-slate-600 rounded-[50px] flex items-center justify-center cursor-pointer">
                            <h1 className="uppercase text-[18px]">
                              {cReply.user.name.slice(0, 2)}
                            </h1>
                          </div> */}
                          <div>
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
                        </div>
                        <div className="pl-2">
                          <div className="flex items-center">
                            <h5 className="text-[20px]">{cReply?.user.name}</h5>
                            {cReply?.user.role === "admin" && (
                              <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                            )}
                          </div>{" "}
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
          </>
        </div>
      )}
    </div>
  );
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  questionId,
  setQuestionId,
  addAnswerIsLoading,
}: any) => {
  return (
    <>
      <div className="w-full my-3">
        {data[activeVideo].questions.map((question: any, index: number) => (
          <CommentItem
            key={question._id}
            question={question}
            answer={answer}
            setAnswer={setAnswer}
            setQuestionId={setQuestionId}
            handleAnswerSubmit={handleAnswerSubmit}
            questionId={questionId}
            addAnswerIsLoading={addAnswerIsLoading}
          />
        ))}
      </div>
    </>
  );
};

const CommentItem = ({
  questionId,
  question,
  answer,
  setAnswer,
  setQuestionId,
  handleAnswerSubmit,
  addAnswerIsLoading,
}: any) => {
  const [replyActive, setReplyActive] = useState(false);
  return (
    <>
      <div className="my-4">
        <div className="flex mb-2">
          <div>
            <Image
              src={
                question?.user.avatar
                  ? question?.user.avatar.url
                  : noProfileAvatar
              }
              width={50}
              height={50}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </div>
          {/* <div className="w-[50px] h-[50px]">
            <div className="w-[50px] h-[50px] bg-slate-600 rounded-[50px] flex items-center justify-center cursor-pointer">
              <h1 className="upppercase text-[18px]">
                {question?.user.name.slice(0, 2)}
              </h1>
            </div>
          </div> */}
          <div className="pl-3 dark:text-white text-black">
            <h5 className="text-[20px]">{question?.user.name}</h5>
            <p>{question?.question}</p>
            <small className="dark:text-[#ffffff83] text-black">
              {question?.createdAt && format(question?.createdAt)} &#x2022;
            </small>
          </div>
        </div>
        <div className="w-full flex">
          <span
            className="800px:pl-16 text-black dark:text-[#ffffff83] cursor-pointer mr-2"
            onClick={() => {
              setReplyActive(!replyActive);
              setQuestionId(question?._id);
            }}
          >
            {!replyActive
              ? question?.questionReplies.length !== 0
                ? "All Replies"
                : "Add Replies"
              : "Hide Replies"}
          </span>
          <BiMessage
            size={20}
            className="cursor-pointer dark:text-[#ffffff83] text-[#000000b8]"
          />
          <span className="pl-4 mt-[-4px] cursor-pointer dark:text-[#ffffff83] text-[#000000b8]">
            {question?.questionReplies.length}
          </span>
        </div>
        {/* show question replies */}
        {replyActive && questionId === question._id && (
          <>
            {question?.questionReplies.map((questionReply: any) => (
              <div
                key={questionReply._id}
                className="w-full flex 800px:ml-16 my-5 text-black dark:text-white"
              >
                <div>
                  <Image
                    src={
                      questionReply?.user.avatar
                        ? questionReply?.user.avatar.url
                        : noProfileAvatar
                    }
                    width={50}
                    height={50}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                </div>
                <div className="pl-3">
                  <div className="flex items-center">
                    <h5 className="text-[20px]">{questionReply?.user.name}</h5>
                    {questionReply?.user.role === "admin" && (
                      <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                    )}
                  </div>
                  <p>{questionReply?.answer}</p>
                  <small className="dark:text-[#ffffff83] text-black">
                    {format(questionReply?.createdAt)} &#x2022;
                  </small>
                </div>
              </div>
            ))}
            <>
              <div className="w-full flex relative dark:text-white text-black">
                <input
                  type="text"
                  placeholder="Enter your answer..."
                  value={answer}
                  onChange={(e: any) => setAnswer(e.target.value)}
                  className={`block 800px:ml-12 m5-2 outline-none bg-transparent border-b border-[#00000027] dark:border-[#fff] p-[5px] w-[95%] ${
                    answer === "" ||
                    (addAnswerIsLoading && "cursor-not-allowed")
                  }`}
                />
                <button
                  type="submit"
                  className="absolute right-0 bottom-1 "
                  onClick={handleAnswerSubmit}
                  disabled={answer.length === 0 || addAnswerIsLoading}
                >
                  Submit
                </button>
              </div>
              <br />
            </>
          </>
        )}
      </div>
    </>
  );
};

export default CourseContentMedia;
