import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';


export default {
  plugins: [
    tailwindcss, // This is the fix. It should be 'tailwindcss', not 'tailwindcssPostcss'
    autoprefixer,
  ],
};