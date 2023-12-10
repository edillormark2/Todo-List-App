import React from "react";
import "../App.css"; // Import CSS file for additional styling

const PopupTitle = ({ title }) => {
  return (
    <div>
      <h5 className="mb-2 relative font-bold">
        {title}
        <span className="h5-after" style={{ backgroundColor: "#3498DB" }} />
      </h5>
    </div>
  );
};

export default PopupTitle;
