export default interface IPage {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    data: any[];
}