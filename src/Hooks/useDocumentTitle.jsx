import { useEffect } from "react";

export const useDocumentTitle = (items = []) => {
  useEffect(() => {
    const baseTitle = "FEKRA";

    if (items.length === 0) {
      document.title = baseTitle;
      return;
    }
    const titleParts = [...items, baseTitle];
    document.title = titleParts.join(" - ");
  }, [items]);
};
