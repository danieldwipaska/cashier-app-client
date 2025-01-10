export default interface IPage {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageMetaData?: {
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}
