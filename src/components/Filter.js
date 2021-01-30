import React from "react";

const Filter = ({ state, onChange }) => {
  return (
    <div>
      filter shown with <input value={state} onChange={onChange} />
    </div>
  );
};

export default Filter;
