export default function Pagination(props) {
  let { articlesCount, articlesPerPage, currentPageIndex, updatePageIndex } =
    props;
  let pageArray = [];
  let pages = Math.ceil(articlesCount / articlesPerPage);
  for (let i = 1; i <= pages; i++) {
    pageArray.push(i);
  }
  return (
    <ul className="flex flex-wrap p-6 justify-start ">
      <li
        className={`w-20 h-10 cursor-pointer flex 
        justify-center items-center m-1 border-2 
        border-solid border-orange-400 
        hover:bg-orange-300 rounded-sm`}
        onClick={() =>
          updatePageIndex(currentPageIndex <= 1 ? 1 : currentPageIndex - 1)
        }
      >
        Prev
      </li>
      {pageArray.map((page) => (
        <li
          key={page}
          className={`w-10 h-10 cursor-pointer flex 
          justify-center items-center m-1 border-2 border-solid
           border-orange-400 hover:bg-orange-300 rounded-sm 
        ${currentPageIndex === page ? "bg-orange-400" : ""}`}
          onClick={() => updatePageIndex(page)}
        >
          {page}
        </li>
      ))}
      <li
        className={`w-20 h-10 cursor-pointer flex 
        justify-center items-center m-1 border-2 
        border-solid border-orange-400 
        hover:bg-orange-300 rounded-sm`}
        onClick={() =>
          updatePageIndex(
            currentPageIndex < pages ? currentPageIndex + 1 : currentPageIndex
          )
        }
      >
        Next
      </li>
    </ul>
  );
}
