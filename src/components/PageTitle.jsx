import React from "react";
import todo from "./images/todo-image01.png";

const PageTitle = ({ title }) => {
  return (
    <div className="m-10 flex items-center justify-center">
      <img
        className="object-scale-down h-12 w-12 md:h-16 md:w-16 mr-4"
        src={todo}
        alt="todo"
      />
      <p className="font-extrabold text-3xl md:text-5xl tracking-tight text-slate-700">
        {title}
      </p>
    </div>
  );
};

export default PageTitle;
