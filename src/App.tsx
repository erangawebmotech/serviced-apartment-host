import "./styles/commonStyles.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Routes from "./Routes/index";
import { ConfigProvider } from "antd";

function App() {
    // console.log("✅ VITE_API_URL:", import.meta.env.VITE_API_URL);

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#EF5A60",
          },
          components: {
            Button: {
              defaultBg: "#ffffff00",
              defaultBorderColor: "#EF5A60",
              defaultColor: "#EF5A60",
              defaultHoverBorderColor: "#EF5A60",
              defaultHoverColor: "#ffff",
              defaultActiveBorderColor: "#EF5A60",
              defaultActiveColor: "#fff",
              defaultActiveBg: "#EF5A60",
              defaultHoverBg: "#EF5A60",
              textTextColor: "#EF5A60",
              textTextHoverColor: "#EF5A60",
            },
          },
        }}
      >
        <Routes />
      </ConfigProvider>
    </>
  );
}

export default App;
