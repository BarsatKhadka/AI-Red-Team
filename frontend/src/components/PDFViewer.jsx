function PDFViewer({ pdfURL }) {
  if (!pdfURL) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <p className="text-lg">Select a message to generate a PDF proposal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <iframe
        src={pdfURL}
        className="w-full h-full border-none"
        title="PDF Viewer"
      />
    </div>
  );
}

export default PDFViewer;

