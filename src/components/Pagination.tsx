import IPage from "interfaces/Pagination";
import { PiArrowFatLeftFill } from "react-icons/pi";
import { PiArrowFatRightFill } from "react-icons/pi";

const Pagination = ({ increasePage, decreasePage }: IPage) => {

  return (
    <div className="flex justify-between items-center w-full my-5">
        <div className="flex items-center gap-2">
            <button onClick={() => decreasePage()}>
                <PiArrowFatLeftFill size={30} className="text-green-700" />
            </button>
            <p className="text-sm">Previous</p>
        </div>
        <div className="flex items-center gap-2">
            <p className="text-sm">Next</p>
            <button onClick={() => increasePage()}>
                <PiArrowFatRightFill size={30} className="text-green-700" />
            </button>
        </div>
    </div>
  )
}

export default Pagination