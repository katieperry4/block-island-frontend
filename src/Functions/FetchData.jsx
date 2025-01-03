import { useEffect, useState, useRef } from "react";
import axios from 'axios';

//here we fetch the data, this function is called from the unzip data function

export const useFetchData = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const apiUrl = "https://7cqup4uc5a.execute-api.us-east-1.amazonaws.com/get_block_island_data_from_s3";
    
    const hasFetched = useRef(false);
    const getData = async () => {
        try {
             const response = await axios.get(apiUrl, {
                responseType : "arraybuffer",
                headers: {
                  'Content-Type' : 'application/json',
                  
                },
              })
              //const compressedData = new Uint8Array(response.data);
              const base64Data = response.data;
              //console.log(response.data);
              //const binaryData = Uint8Array.from(atob(base64Data), char => char.charCodeAt(0));
              const binaryData = new Uint8Array(response.data);
              //console.log("the first few byes of the array are: ", binaryData.slice(0,10));
              console.log("fetching data");
              setData(response.data);
        } catch(error) {
            console.log(error);
            setError(error.message)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if(!hasFetched.current)
        {
            hasFetched.current = true;
            getData();
        }
    }, []);
    return{loading, data, error}
}