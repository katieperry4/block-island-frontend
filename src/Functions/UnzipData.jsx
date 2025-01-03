import { useFetchData } from "./FetchData";
import pako from 'pako';
import { useState, useEffect } from "react";

export const useUnzipData = () => {
    const {loading, data: compressedData , error} = useFetchData();
    const {uncompressedData, setUncompressedData} = useState(null);

    useEffect(() => {
        if(compressedData) {
            try {
                //const decompressed = pako.inflate(compressedData, {to : 'string'});
                //const decompressed = pako.ungzip(compressedData);
                //const jsonData = JSON.parse(decompressed);
                //const jsonData = JSON.parse(new TextDecoder('UTF-8').decode(decompressed));
                //setUncompressedData(jsonData);
                setUncompressedData(compressedData);
            } catch (err) {
                console.error("Error compressing data: ", err);
            }
        }
    }, [compressedData])
    return {loading, data: compressedData, error};
}