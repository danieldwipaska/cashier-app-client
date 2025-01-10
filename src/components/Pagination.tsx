import IPage from 'interfaces/Pagination';
import { PiArrowFatLeftFill } from 'react-icons/pi';
import { PiArrowFatRightFill } from 'react-icons/pi';

const Pagination = ({ setPage, pageMetaData }: IPage) => {
  const increasePage = () => {
    if (pageMetaData?.hasNextPage) return setPage((prev) => prev + 1);
  };

  const decreasePage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className={`flex justify-between items-center w-full my-5 ${(pageMetaData?.totalPages ?? 0) <= 1 ? 'hidden' : null}`}>
      <div className="flex items-center gap-2">
        <button onClick={() => decreasePage()} className={`${pageMetaData?.hasPrevPage ? null : 'hidden'}`}>
          <PiArrowFatLeftFill size={30} className="text-green-700" />
        </button>
        <p className={`text-sm ${pageMetaData?.hasPrevPage ? null : 'hidden'}`}>Previous</p>
      </div>
      <div className="flex items-center gap-2">
        <p className={`text-sm ${pageMetaData?.hasNextPage ? null : 'hidden'}`}>Next</p>
        <button onClick={() => increasePage()}>
          <PiArrowFatRightFill size={30} className={`text-green-700 ${pageMetaData?.hasNextPage ? null : 'hidden'}`} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
