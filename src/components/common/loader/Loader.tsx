import "../../../styles/loaderStyles.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../slices/rootReducer";

const Loader = () => {
  const selectIsLoading = (state: RootState) => state.loader.isLoader;

  const isLoading = useSelector(selectIsLoading);

  // const pageHeight = document.documentElement.scrollHeight;

  const bodyLoaderStyle = {
    height: `100%`,
    zIndex: 999999999,
  };
  return (
    <>
      {isLoading && (
        <section className={"body_loader"} style={bodyLoaderStyle}>
          <div className={"loader-parent"}>
            <div className="loader">
              <div className="cell d-0"></div>
              <div className="cell d-1"></div>
              <div className="cell d-2"></div>

              <div className="cell d-1"></div>
              <div className="cell d-2"></div>

              <div className="cell d-2"></div>
              <div className="cell d-3"></div>

              <div className="cell d-3"></div>
              <div className="cell d-4"></div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
export default Loader;
