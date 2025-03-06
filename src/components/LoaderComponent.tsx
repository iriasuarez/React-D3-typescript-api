import { PacmanLoader } from "react-spinners";

const LoaderComponent = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh", // Set this to 100vh to take the full height of the screen (or adjust as needed)
      position: "absolute", // Optional: If you want it to stay centered even when the layout changes
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 1000, // Ensure it appears above other content
    }}
  >
    <PacmanLoader size={50} color="#36d7b7" />
  </div>
);

export default LoaderComponent;
