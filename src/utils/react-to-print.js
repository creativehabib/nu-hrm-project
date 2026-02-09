export const useReactToPrint = ({ content, documentTitle } = {}) => {
  return () => {
    const target = content?.();
    if (!target) {
      return;
    }

    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) {
      return;
    }

    printWindow.document.open();
    printWindow.document.title = documentTitle ?? document.title;

    const styleElements = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    );
    const stylesMarkup = styleElements
      .map((style) => style.outerHTML)
      .join("\n");

    printWindow.document.write(`<!doctype html>
      <html>
        <head>${stylesMarkup}</head>
        <body>${target.outerHTML}</body>
      </html>`);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };
};
