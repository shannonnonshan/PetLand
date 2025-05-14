export default {
    content: [
      './views/**/*.hbs',  // Đường dẫn tới các tệp .hbs
      './src/**/*.{js,ts}', // Đường dẫn đến các file JS hoặc TS nếu cần
      './views/layouts/component/**/*.hbs',
      './views/layouts/**/*.hbs',
    ],
    theme: {
      extend: {},
    },
    plugins: [ require('@tailwindcss/line-clamp'),],
    prefix: 'tw-',
    important: true,
    corePlugins: {
      preflight: false,
    },
   
    darkMode: 'class', 
  }