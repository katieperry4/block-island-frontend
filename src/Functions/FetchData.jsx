import { useEffect, useState } from "react";

//here we fetch the data, this function is called from the unzip data function

export const useFetchData = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const apiUrl = "https://7cqup4uc5a.execute-api.us-east-1.amazonaws.com/get_block_island_data_from_s3";
    const getData = async () => {
        try {
             const response = await axios.get(apiUrl, {
                responseType : "arraybuffer",
                headers: {
                  'Content-Type' : 'application/json'
                },
              })
              const compressedData = new Uint8Array(response.data);
              setData(compressedData);
        } catch(error) {
            console.log(error);
            setError(error.message)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getData();
    }, []);
    return{loading, data, error}
}