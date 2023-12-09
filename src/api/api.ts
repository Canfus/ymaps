import {GeocoderResponse} from "../types/responses/ymaps.ts";


const checkResponse = (res: Response) => {
    return res.ok ? res.json() : res.json().then((error) => Promise.reject(error));
}

export const getCoords = async (str: string): Promise<GeocoderResponse | null> => {
    if (!str) return null;

    return await fetch(`${import.meta.env.VITE_API_URL}/navigation/geocoder`, {
        method: 'POST',
        headers: {
            'Content-type': 'Application/json',
        },
        body: JSON.stringify({human_readable_address: str}),
    }).then(checkResponse).then((data: GeocoderResponse) => data);
}