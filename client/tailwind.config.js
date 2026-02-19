/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                company: {
                    green: '#388E3C',
                    light: '#E8F5E9',
                    white: '#FFFFFF'
                }
            }
        },
    },
    plugins: [],
}
