import IPage from 'interfaces/Pagination';
import { ReactComponent as ArrowTurnRightIcon } from "../assets/img/icons/arrow-turn-right.svg";
import { ReactComponent as ArrowTurnLeftIcon } from "../assets/img/icons/arrow-turn-left.svg";

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
          <ArrowTurnLeftIcon className="text-green-700 w-[30px]" />
        </button>
        <p className={`text-sm ${pageMetaData?.hasPrevPage ? null : 'hidden'}`}>Previous</p>
      </div>
      <div className="flex items-center gap-2">
        <p className={`text-sm ${pageMetaData?.hasNextPage ? null : 'hidden'}`}>Next</p>
        <button onClick={() => increasePage()} className={`${pageMetaData?.hasNextPage ? null : 'hidden'}`}>
          <ArrowTurnRightIcon className={`text-green-700 w-[30px]`} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
