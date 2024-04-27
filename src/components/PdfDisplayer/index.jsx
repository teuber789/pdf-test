import React, { useEffect, useState } from 'react';
import {
    Document,
    Page,
    pdfjs,
} from 'react-pdf';
import Spinner from '../Spinner';
import axios from 'axios';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.js',
    import.meta.url,
).toString();

const http = {
    getBlob: (route, accept) => axios.get(route, { responseType: 'arraybuffer', headers: { Accept: accept } }),
};

function PdfDisplayer({}) {
    const [fetching, setFetching] = useState(true);
    const [failed, setFailed] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    const [numberOfPages, setNumberOfPages] = useState();
    const onPdfLoadSuccess = ({ numPages }) => { setNumberOfPages(numPages); };

    useEffect(() => {
        if (pdfData) return;

        http.getBlob('https://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf', 'application/pdf')
            .then(async (response) => {
                const blob = new Blob([response.data], {
                    type: 'application/pdf',
                });
                setPdfData(blob);
                setFetching(false);
            })
            .catch((error) => {
                console.log(error);
                setFetching(false);
                setFailed(true);
            });
    });

    return (
        <>
            {
                fetching && <Spinner />
            }
            {
                !fetching && !failed && (
                    <Document
                        file={pdfData}
                        loading={() => ''}
                        onLoadSuccess={onPdfLoadSuccess}
                    >
                        {
                            Array.from(
                                new Array(numberOfPages),
                                (el, index) => (
                                    <Page
                                        key={`page_${index + 1}`}
                                        pageNumber={index + 1}
                                        loading={() => ''}
                                        scale={1.5}
                                        renderAnnotationLayer={false}
                                        renderTextLayer={false}
                                    />
                                ),
                            )
                        }
                    </Document>
                )
            }
            {
                !fetching && failed && (
                    <div>Request failed with an error.</div>
                )
            }
        </>
    );
}

PdfDisplayer.propTypes = {};

PdfDisplayer.defaultProps = {};

export default PdfDisplayer;
