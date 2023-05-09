export const getEnvVariables = () => {
    return {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        VITE_APP_TITLE:import.meta.env.VITE_APP_TITLE
    }
}