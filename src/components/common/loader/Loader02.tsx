import "../../../styles/loaderStyles.scss";

const Loader02 = () => {
  const bodyLoaderStyle = {
    height: `100%`,
    zIndex: 999999999,
  };
  return (
    <>
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
    </>
  );
};
export default Loader02;
