/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{svelte,js,ts}'], // сканируем все svelte/js/ts
    theme: { extend: {} },
    darkMode: 'class', // опционально: переключаем тему через класс 'dark'
    plugins: []
};
