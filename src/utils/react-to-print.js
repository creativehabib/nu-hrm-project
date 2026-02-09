export const useReactToPrint = ({ content, documentTitle } = {}) => {
  return () => {
    const target = content?.();
    if (!target) {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.setAttribute("aria-hidden", "true");
    document.body.appendChild(iframe);

    const printDocument = iframe.contentWindow?.document;
    if (!printDocument) {
      document.body.removeChild(iframe);
      return;
    }

    const styleElements = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    );
    const stylesMarkup = styleElements
      .map((style) => style.outerHTML)
      .join("\n");

    printDocument.open();
    printDocument.write(`<!doctype html>
      <html>
        <head>
          <title>${documentTitle ?? document.title}</title>
          ${stylesMarkup}
        </head>
        <body>${target.outerHTML}</body>
      </html>`);
    printDocument.close();

    const afterPrint = () => {
      iframe.contentWindow?.removeEventListener("afterprint", afterPrint);
      document.body.removeChild(iframe);
    };

    iframe.contentWindow?.addEventListener("afterprint", afterPrint);
    iframe.contentWindow?.focus();

    setTimeout(() => {
      iframe.contentWindow?.print();
    }, 250);
  };
};
