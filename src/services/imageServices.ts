// services/imageService.ts
import axios from "axios";
const API_KEY = 'nSkkfQPl0idJTfa1LpufCcy2HEUbJniSyJsRp1xJ8W4zFgJgu2DySLB5';
const BASE_URL = 'https://api.pexels.com/v1/search';
export const fetchImages = async (query: string, perPage: number = 15) => {
    try {
        const response = await axios.get(BASE_URL, {
            headers: {
                Authorization: API_KEY,
            },
            params: {
                query,
                per_page: perPage,
            },
        });

        return response.data.photos.map((photo: any) => ({
            id: photo.id,
            url: photo.src.medium, // Use original for full-size images
        }));
    } catch (error) {
        console.error("Error fetching images from Pexels API:", error);
        throw new Error("Unable to fetch images. Please try again later.");
    }
};