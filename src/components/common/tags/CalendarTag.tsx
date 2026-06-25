import React, { useEffect, useRef, useState } from "react";
import { Circle } from "react-feather";
import { formatNamesCmnFun } from "../../../common/commonFunctions";

interface CalendarTagProps {
  color: string;
  label: string;
  count: number | string;
  purpose: string;
}
const CalendarTag: React.FC<CalendarTagProps> = ({
  color,
  label,
  count,
  purpose,
}) => {
  const tagRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(true);
  const [maxWidth, setMaxWidth] = useState("100px");

  useEffect(() => {
    const updateScreenSize = () => {
      setIsOverflow(window.innerWidth > 768);
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  useEffect(() => {
    const updateMaxWidth = () => {
      setMaxWidth(window.innerWidth <= 1400 ? "50px" : "100px");
    };

    updateMaxWidth(); // Set initial state
    window.addEventListener("resize", updateMaxWidth);

    return () => window.removeEventListener("resize", updateMaxWidth);
  }, []);

  return (
    <div className="d-flex align-items-center mx-0 mx-md-2 calenderTag">
      {" "}
      <Circle
        strokeWidth={20}
        className="rounded-circle me-1"
        size={6}
        color={color}
      />
      {(purpose === "tag" || isOverflow) && (
        <span
          className={`calenderTagName font-weight-medium font-size-5  my-2 my-md-0 text-nowrap pt-1 ${
            purpose === "tag" && "mx-2"
          }`}
          style={{
            color: color,
            display: "block",
            maxWidth: purpose != "tag" ? maxWidth : 150,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {count} {formatNamesCmnFun(label)}
        </span>
      )}
    </div>
  );
};

export default CalendarTag;
