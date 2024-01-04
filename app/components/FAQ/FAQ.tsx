import { useGetHeroDataQuery } from "../../../redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { styles } from "../../styles/style";
import { HiMinus, HiPlus } from "react-icons/hi";

type Props = {};

interface IQuestion {
  question: string;
  answer: string;
  _id: string;
}

const FAQ = (props: Props) => {
  const { data } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQuestion = (id: string | null) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[80%] m-auto">
        <h1 className={`${styles.title} 800px:text-[40px]`}>
          Frequently Asked Questions
        </h1>
        <div className="mt-12">
          <dl className="space-y-8">
            {questions.map((currentQuestion) => (
              <div
                key={currentQuestion._id}
                className={`${
                  currentQuestion._id !== questions[0]?._id && "border-t"
                } border-gray-200 pt-6`}
              >
                <dt className="text-lg">
                  <button
                    className="flex items-start justify-between w-full text-left focus:outline-none"
                    onClick={() => toggleQuestion(currentQuestion._id)}
                  >
                    <span className="font-medium text-black dark:text-white">
                      {currentQuestion.question}
                    </span>
                    <span className="ml-6 flex-shrink-0">
                      {activeQuestion === currentQuestion._id ? (
                        <HiMinus className="h-6 w-6 text-black dark:text-white" />
                      ) : (
                        <HiPlus className="h-6 w-6 text-black dark:text-white" />
                      )}
                    </span>
                  </button>
                </dt>
                {activeQuestion === currentQuestion._id && (
                  <dd className="mt-2 pr-12">
                    <p className="text-base font-Poppins text-black dark:text-white">
                      {currentQuestion.answer}
                    </p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default FAQ;
