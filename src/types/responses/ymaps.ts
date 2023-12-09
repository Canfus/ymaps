export interface GeocoderResponse {
    latitude: number;
    longitude: number;
    type: string;
    address: {
        country_code: string;
        formatted: string;
        postal_code: string;
        Components: {
            kind: string;
            name: string;
        }[];
    };
}