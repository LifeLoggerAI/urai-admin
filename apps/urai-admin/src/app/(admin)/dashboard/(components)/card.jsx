import React from "react";
var Card = function (_a) {
    var title = _a.title, value = _a.value;
    return (<div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>);
};
export default Card;
