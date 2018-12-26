import React from "react";
import spinner from "./spinner.gif";

export default () => {
  return (
    <tr>
      <td>
        <img
          src={spinner}
          alt="Loading"
          style={{ width: "200px", margin: "auto", display: "block" }}
        />
      </td>
    </tr>
  );
};
