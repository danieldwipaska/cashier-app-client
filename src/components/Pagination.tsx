import IPage from 'interfaces/Pagination';
import { PiArrowFatLeftFill } from 'react-icons/pi';
import { PiArrowFatRightFill } from 'react-icons/pi';

const Pagination = ({ page, setPage, data }: IPage) => {
  const increasePage = () => {
    if (data?.length !== 0) return setPage((prev) => prev + 1);
  };

  const decreasePage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="flex justify-between items-center w-full my-5">
      <div className="flex items-center gap-2">
        <button onClick={() => decreasePage()} className={`${page === 1 ? 'hidden' : null}`}>
          <PiArrowFatLeftFill size={30} className="text-green-700" />
        </button>
        <p className={`text-sm ${page === 1 ? 'hidden' : null}`}>Previous</p>
      </div>
      <div className="flex items-center gap-2">
        <p className={`text-sm ${!data?.length ? 'hidden' : null}`}>Next</p>
        <button onClick={() => increasePage()}>
          <PiArrowFatRightFill size={30} className={`text-green-700 ${!data?.length ? 'hidden' : null}`} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
