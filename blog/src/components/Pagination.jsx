export default function Pagination(props) {
  let { articlesCount, articlesPerPage, currentPageIndex, updatePageIndex } =
    props;
  let pageArray = [];
  let pages = Math.ceil(articlesCount / articlesPerPage);
  for (let i = 1; i <= pages; i++) {
    pageArray.push(i);
  }
  return (
    <ul className="flex flex-wrap justify-center p-6">
      <li
        className={`m-1 flex h-10 w-20 
        cursor-pointer items-center justify-center rounded-sm 
        border-2 border-solid 
        border-orange-400 hover:bg-orange-300`}
        onClick={() =>
          updatePageIndex(currentPageIndex <= 1 ? 1 : currentPageIndex - 1)
        }
      >
        Prev
      </li>
      {pageArray.map((page) => (
        <li
          key={page}
          className={`m-1 flex h-10 w-10 
          cursor-pointer items-center justify-center rounded-sm border-2
           border-solid border-orange-400 hover:bg-orange-300 
        ${currentPageIndex === page && "bg-orange-400"}`}
          onClick={() => updatePageIndex(page)}
        >
          {page}
        </li>
      ))}
      <li
        className={`m-1 flex h-10 w-20 
        cursor-pointer items-center justify-center rounded-sm 
        border-2 border-solid 
        border-orange-400 hover:bg-orange-300`}
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
