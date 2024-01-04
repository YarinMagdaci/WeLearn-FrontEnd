import { HiMinus, HiPlus } from "react-icons/hi";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "../../../../redux/features/layout/layoutApi";
import { styles } from "../../../styles/style";
import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import uuid from "react-uuid";
import toast from "react-hot-toast";
import Loader from "../../Loader";
type Props = {};
interface IQuestion {
  question: string;
  answer: string;
  _id: string;
  active?: boolean;
}
const EditFaq = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
  const [refetechingRendering, setRefetchingRendering] = useState(false);

  useEffect(() => {
    if (data) {
      setQuestions([
        ...data.layout?.faq?.map((currentFaq: IQuestion) => ({
          ...currentFaq,
        })),
      ]);
    }
    if (isSuccess && !refetechingRendering) {
      toast.success("FAQ updated successfully!");
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
  }, [data, isSuccess, error]);

  const toggleQuestion = (id: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((currentQuestion: IQuestion) =>
        currentQuestion._id !== id
          ? currentQuestion
          : { ...currentQuestion, active: !currentQuestion.active }
      )
    );
  };

  const handleChange = (id: string, field: string, newValue: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((currentQuestion: IQuestion) =>
        currentQuestion._id !== id
          ? currentQuestion
          : { ...currentQuestion, [field]: newValue }
      )
    );
  };
  //  todo : check what happens with the _id here:
  const newFaqHandler = () => {
    const newId = uuid();
    setQuestions([
      ...questions,
      { question: "", answer: "", active: false, _id: newId },
    ]);
  };

  const isAnyQuestionEmpty = () => {
    return questions.some((q) => q.question === "" || q.answer === "");
  };

  const handleEdit = async () => {
    if (!areQuestionsUnChanged() && !isAnyQuestionEmpty()) {
      // const toBeSentQuestions = questions.map((q: IQuestion) => ({
      //   question: q.question,
      //   answer: q.answer,
      // }));
      await editLayout({ type: "FAQ", faq: questions });
    }
  };

  const areQuestionsUnChanged = () => {
    const qWeReceivedFromDB: {
      _id: string;
      question: string;
      answer: string;
    }[] = data?.layout?.faq?.map((currentQuestion: IQuestion) => ({
      _id: currentQuestion._id,
      question: currentQuestion.question,
      answer: currentQuestion.answer,
    }));
    const qState: { _id: string; question: string; answer: string }[] =
      questions.map((currentQuestion: IQuestion) => ({
        _id: currentQuestion._id,
        question: currentQuestion.question,
        answer: currentQuestion.answer,
      }));

    const itemsMatch =
      JSON.stringify(qWeReceivedFromDB) === JSON.stringify(qState);

    return itemsMatch;
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-[90%] 800px:w[80%] m-auto mt-[120px]">
          <div className="mt-12">
            <dl className="space-y-8">
              {questions.map((q: IQuestion) => (
                <div
                  key={q._id}
                  className={`${
                    q._id !== questions[0]._id && "border-t"
                  } border-gray-200 pt-6`}
                >
                  <dt className="text-lg">
                    <button
                      className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                      onClick={() => toggleQuestion(q._id)}
                    >
                      <label htmlFor={`question${q._id}`}>question:</label>
                      <input
                        className={`${styles.input} border-none`}
                        value={q.question}
                        id={`question${q._id}`}
                        onChange={(e: any) =>
                          handleChange(q._id, "question", e.target.value)
                        }
                      />
                      <span className="ml-6 flex-shrink-0">
                        {q.active ? (
                          <HiMinus className="h-6 w-6" />
                        ) : (
                          <HiPlus className="h-6 w-6" />
                        )}
                      </span>
                    </button>
                  </dt>
                  {q.active && (
                    <dd className="mt-2 pr-12">
                      <label htmlFor={`answer${q._id}`}>answer:</label>
                      <input
                        className={`${styles.input} border-none`}
                        value={q.answer}
                        id={`answer${q._id}`}
                        onChange={(e: any) =>
                          handleChange(q._id, "answer", e.target.value)
                        }
                      />
                      <span className="ml-6 flex-shrink-0">
                        <AiOutlineDelete
                          className="dark:text-white text-black text-[18px] cursor-pointer"
                          onClick={() => {
                            setQuestions((prevQuestions) =>
                              prevQuestions.filter((item) => item._id !== q._id)
                            );
                          }}
                        />
                      </span>
                    </dd>
                  )}
                </div>
              ))}
            </dl>
            <br />
            <br />
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newFaqHandler}
            />
          </div>
          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
              areQuestionsUnChanged() || isAnyQuestionEmpty()
                ? "!cursor-not-allowed"
                : "!cursor-pointer !bg-[#42d383]"
            } !rounded absolute bottom-12 right-12`}
            onClick={
              areQuestionsUnChanged() || isAnyQuestionEmpty()
                ? () => null
                : handleEdit
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditFaq;
