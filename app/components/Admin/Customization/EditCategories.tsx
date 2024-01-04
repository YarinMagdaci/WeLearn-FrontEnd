import React, { useEffect, useState } from "react";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "../../../../redux/features/layout/layoutApi";
import { styles } from "../../../styles/style";
import Loader from "../../Loader";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import uuid from "react-uuid";

type Props = {};

interface ICategory {
  title: string;
  _id: string;
}

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [refetechingRendering, setRefetchingRendering] = useState(false);

  useEffect(() => {
    if (data) {
      setCategories([
        ...data.layout.categories.map((category: ICategory) => ({
          ...category,
        })),
      ]);
    }
    if (isSuccess && !refetechingRendering) {
      toast.success("Categories updated successfully!");
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

  const handleCategoryChange = (id: string, value: string) => {
    setCategories((prevCategories) => [
      ...prevCategories.map((currentPrevCategory: ICategory) =>
        currentPrevCategory._id === id
          ? { ...currentPrevCategory, title: value }
          : currentPrevCategory
      ),
    ]);
  };

  const newCategoryHandler = () => {
    if (categories[categories.length - 1].title === "") {
      toast.error("Category title cannot be empty");
    } else {
      const newId = uuid();
      setCategories((prevCategories: ICategory[]) => [
        ...prevCategories,
        { title: "", _id: newId },
      ]);
    }
  };

  const areCategoriesUnchanged = () => {
    const cWeReceivedFromDB: {
      _id: string;
      title: string;
    }[] = data?.layout?.categories?.map((currentCategory: ICategory) => ({
      _id: currentCategory._id,
      title: currentCategory.title,
    }));
    const cState: { _id: string; title: string }[] = categories.map(
      (currentCategory: ICategory) => ({
        _id: currentCategory._id,
        title: currentCategory.title,
      })
    );

    const itemsMatch =
      JSON.stringify(cWeReceivedFromDB) === JSON.stringify(cState);

    return itemsMatch;
  };

  const isAnyCategoryTitleEmpty = () => {
    return categories.some(
      (currentCategory: ICategory) => currentCategory.title === ""
    );
  };

  const editCategoriesHandler = async () => {
    if (!isAnyCategoryTitleEmpty() && !areCategoriesUnchanged()) {
      await editLayout({ type: "Categories", categories });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories &&
            categories.map((category: ICategory, index: number) => {
              return (
                <div className="p-3" key={category._id || index}>
                  <div className="flex items-center w-full justify-center">
                    <input
                      className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                      value={category.title}
                      onChange={(e) =>
                        handleCategoryChange(category._id, e.target.value)
                      }
                      placeholder="<Category Name>"
                    />
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer"
                      onClick={() =>
                        setCategories((prevCategories: ICategory[]) => [
                          ...prevCategories.filter(
                            (currentPrevCategory: ICategory) =>
                              currentPrevCategory._id !== category._id
                          ),
                        ])
                      }
                    />
                  </div>
                </div>
              );
            })}
          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newCategoryHandler}
            />
          </div>
          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:Text-white text-black bg-[#cccccc34] ${
              areCategoriesUnchanged() || isAnyCategoryTitleEmpty()
                ? "!cursor-not-allowed"
                : "!cursor-pointer !bg-[#42d383]"
            } !rounded absolute bottom-12 right-12`}
            onClick={
              areCategoriesUnchanged() || isAnyCategoryTitleEmpty()
                ? () => null
                : editCategoriesHandler
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;
