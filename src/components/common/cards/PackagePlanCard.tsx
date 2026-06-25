import React from "react";
import { formatNamesCmnFun } from "../../../common/commonFunctions";
import sidePattern from '../../../assets/images/home/packages-side-pattern.png'


interface PackagePlanCardProps {
  index: number;
  matchingPlan: any;
  maxHeight: number;
  hoveredCard: number | null;
  onHover: (index: number | null) => void;
  onButtonClick: () => void;
}

const PackagePlanCard: React.FC<PackagePlanCardProps> = ({
  index,
  matchingPlan,
  maxHeight,
  hoveredCard,
  onHover,
  onButtonClick,
}) => {
  return (
    <div className="d-flex flex-column p-0 col-lg-6 col-xl-4">
      <div
        className="card-items-service mx-0 mx-lg-4 mx-xl-3 mx-xxl-5 my-4 gradient-border"
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
      >
        {/* <img src={sidePattern} alt="side pattern" className="card-item-pattern" /> */}
        <span className="d-flex align-items-center justify-content-between p-3">
          <div>
            <h2 className="m-0">{matchingPlan.name}</h2>
            <h6 className="m-0 mt-1 font-weight-normal">{matchingPlan.tagLine}</h6>
          </div>
          <img
            width={48}
            src={matchingPlan.image.href}
            alt={matchingPlan.image.alt}
          />
        </span>

        <div
          className="position-relative d-flex flex-column justify-content-between p-4 glass-container"
          style={{ height: `${maxHeight}px`, alignItems: "stretch" }}
        >
          <div className="m-0 p-0 d-flex justify-content-center justify-content-lg-start align-items-center">
            <hr />
            <ul className="text-start mt-2" style={{ width: "max-content" }}>
              {matchingPlan?.features.map((feature: string, i: number) => (
                <li key={i} className="mb-2 cardListFont">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ Button now calls parent handler */}
          <button
            className="font-size-3 start_hostingBtn"
            onClick={onButtonClick}
          >
            {matchingPlan?.buttonDetails?.label ||
              `Select ${formatNamesCmnFun(matchingPlan?.name)} Plan`}
          </button>

          <div
            className={`triangle-custom ${hoveredCard === index ? "triangle-expanded" : ""
              }`}
          >
            <div className="triangle-custom-inner"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePlanCard;
