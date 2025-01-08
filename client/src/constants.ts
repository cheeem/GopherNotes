const vite: ImportMetaEnv = import.meta.env;

const in_production: boolean = vite.PROD;

export const base_api_url: string = in_production ? "https://gophernotes.com/api" : "http://localhost:3000";
export const uploads_path: string = "/public/uploads/";