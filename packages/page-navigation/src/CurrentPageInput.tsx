/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from "react";
import { Store } from "@react-pdf-viewer/core";

import StoreProps from "./StoreProps";
import useCurrentPage from "./useCurrentPage";
import useNumberOfPages from "./useNumberOfPages";

const CurrentPageInput: React.FC<{
  store: Store<StoreProps>;
}> = ({ store }) => {
  const [pageTextboxFocused, setPageTextboxFocused] = React.useState(false);
  const [editingPage, setEditingPage] = React.useState(0);

  const { currentPage } = useCurrentPage(store);
  const { numberOfPages } = useNumberOfPages(store);

  const changePage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newPage = parseInt(e.target.value, 10);
    setEditingPage(newPage - 1);
  };

  const focusPageTextbox = (): void => {
    setPageTextboxFocused(true);
    setEditingPage(currentPage);
  };

  const blurPageTextbox = (): void => {
    setPageTextboxFocused(false);
  };

  const gotoNextPage = (): void => {
    const nextPage = currentPage + 1;
    if (nextPage < numberOfPages) {
      setEditingPage(nextPage);
      jumpTo(nextPage);
    }
  };

  const gotoPreviousPage = (): void => {
    const previousPage = currentPage - 1;
    if (previousPage >= 0) {
      setEditingPage(previousPage);
      jumpTo(previousPage);
    }
  };

  const jumpTo = (page: number): void => {
    if (page > 0 && page <= numberOfPages) {
      const jumpToPage = store.get("jumpToPage");
      jumpToPage?.call(page);
    }
  };

  const keydownPage = (e: React.KeyboardEvent): void => {
    switch (e.keyCode) {
      // Up key is pressed
      case 38:
        gotoPreviousPage();
        break;
      // Down key
      case 40:
        gotoNextPage();
        break;
      // Enter key
      case 13:
        jumpTo(editingPage);
        break;
      default:
        break;
    }
  };

  return (
    <input
      className="rpv-current-page-input"
      type="text"
      value={pageTextboxFocused ? editingPage + 1 : currentPage + 1}
      onChange={changePage}
      onFocus={focusPageTextbox}
      onBlur={blurPageTextbox}
      onKeyDown={keydownPage}
    />
  );
};

export default CurrentPageInput;
