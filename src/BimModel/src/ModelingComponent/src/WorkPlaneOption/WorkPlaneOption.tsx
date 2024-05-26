import React, {memo} from "react";

const WorkPlaneOption = () => {
  return (
    <div className="relative h-full flex justify-center items-center mr-[20px]">
      <div className="h-[80%] w-[1px] dark:bg-white bg-black  my-auto"></div>

      <div className="h-[80%] w-[1px] dark:bg-white bg-black  my-auto"></div>
    </div>
  );
};

export default memo(WorkPlaneOption);
