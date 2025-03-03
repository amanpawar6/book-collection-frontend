import axios from 'axios';
import ENV from "../config/env";

export const getAxiosCall = async (endpoint, headers = {}) => {
    try {
        // console.log(JSON.stringify(headers));
        const res = await axios.get(`${ENV.BASE_URL}${endpoint}`, headers);
        return res?.data?.data;
    } catch (error) {
        throw Error(JSON.stringify(error?.response));
    }
}

export const postAxiosCall = async (endpoint, body, headers) => {
    try {
        const res = await axios.post(`${ENV.BASE_URL}${endpoint}`, body, headers);
        console.log(res?.data);
        return res?.data;
    } catch (error) {
        throw Error(JSON.stringify(error?.response));
    }
}