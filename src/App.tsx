import React from "react";
import { usePdfReader } from "@nypl/web-reader";
import {  ReaderReturn, WebpubManifest } from "@nypl/web-reader/dist/esm/types";
import "./App.css";

const proxyUrl = "http://localhost:3001/?requestUrl=";
const pdfWorkerSrc =
  "https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js";
const webpubManifestUrl =
  "https://drb-files-qa.s3.amazonaws.com/manifests/doab/20.500.12854/71362.json";

// Get PDF manifest using the webpubmanifestURL, and return the reader state
const useMyPdfReader = (): ReaderReturn =>  {
  const [manifest, setManifest] = React.useState<WebpubManifest>();

  React.useEffect(() => {
    (async () => {
      const response = await fetch(webpubManifestUrl);
      if(!response.ok) throw new Error('Error fetching manifest from wepub manifest url');

      const json = await response.json();
      if (json) {
        setManifest(json);
      }
    })();
  }, []);

  const readerArguments = manifest
    ? {
        manifest,
        webpubManifestUrl,
        proxyUrl: proxyUrl,
        pdfWorkerSrc,
      }
    : undefined;

  const reader = usePdfReader(readerArguments);

  return reader;
};

function App() {
  const reader = useMyPdfReader();
  return (
    <>
      <header>
        <button onClick={reader?.navigator?.goBackward}>Previous</button>
        <button onClick={reader?.navigator?.goForward}>Next</button>
      </header>
      {reader?.content}
    </>
  );
}

export default App;
