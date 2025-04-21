// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Include all necessary file types
//   theme: {
//     extend: {}, // Customize your theme here
//   },
//   plugins: [], // Add Tailwind plugins if needed
// };
// tailwind.config.js
export default {
  content: [
    "./index.html",  // Make sure this is included
    "./src/**/*.{js,jsx,ts,tsx}", // This should cover your React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
