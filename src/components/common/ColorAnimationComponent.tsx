import React from "react";
import "../../styles/colorAnimationStyles.scss";
import colorOne from "../../assets/images/blue.png";
import colorTwo from "../../assets/images/pink.png";

interface ColorAnimationComponentProps {
  layoutHeight: string;
}

const ColorAnimationComponent: React.FC<ColorAnimationComponentProps> = ({
  layoutHeight,
}) => {
  return (
    <div
      style={{ overflowX: "hidden", height: layoutHeight }}
      className="colorAnimationContainer"
    >
      <div className="colorOne"></div>
      <div className="colorTwo"></div>
      {/* <img className="colorOne" src={colorOne} alt="color 01" />
      <img className="colorTwo" src={colorTwo} alt="color 02" /> */}
    </div>
  );
};

export default ColorAnimationComponent;
