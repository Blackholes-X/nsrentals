import MotionHoc from "./MotionHoc";
import App from "src/src_map/components/app";
const CalenderComponent = () => {
  return <App/>;
};

const Calender = MotionHoc(CalenderComponent);

export default Calender;
