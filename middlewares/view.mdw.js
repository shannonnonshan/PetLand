import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections';
import numeral from 'numeral';
import moment from 'moment';
export default function (app) {
  
  app.engine('hbs', engine({
      extname: 'hbs',
      defaultLayout: 'main',
      helpers: {
          format_number(value) {
              return numeral(value).format('0,0') + ' đ'
          },
  
          section: hbs_sections(),
          formatDate: function (date) {
              return moment(date).format('YYYY-MM-DD HH:mm:ss'); // Định dạng ngày theo YYYY-MM-DD
          },
  
          skipFirst(array) {
              if (Array.isArray(array)) {
                  return array.slice(1); // Bỏ phần tử đầu tiên
              }
              return []; // Nếu không phải mảng, trả về mảng rỗng
          },
  
          getFirstItem(array) {
              if (Array.isArray(array) && array.length > 0) {
                  return array[0];
              }
              return null; // Nếu không có phần tử
          },
  
          getRoleIcon(roleName) {
              // Trả về icon HTML tương ứng với roleName
              switch (roleName) {
                  case 'administrator':
                      return '<i class="bi bi-shield-lock"></i>'; // Icon cho Administrator
                  case 'editor':
                      return '<i class="bi bi-pencil-square"></i>'; // Icon cho Editor
                  case 'subscriber':
                      return '<i class="bi bi-person"></i>'; // Icon cho Subscriber
                  case 'writer':
                      return '<i class="bi bi-vector-pen"></i>'; // Icon cho Subscriber
                  default:
                      return '<i class="bi bi-person-fill"></i>'; // Icon mặc định
              }
          },
  
          getStatusColor(status) {
              switch (status) {
                  case 'Đang chờ':
                      return 'gray'; // Màu xám
                  case 'Đã đăng':
                      return 'green'; // Màu xanh
                  case 'Đã xóa':
                      return 'red'; // Màu đỏ
                  case 'Đã nhận xét':
                      return 'orange'; // Màu vàng
                  case 'Đã chỉnh sửa':
                      return 'purple'; // Màu vàng
                  case 'Đã duyệt':
                      return 'yellow'; // Màu vàng
                  case 'Đã từ chối':
                      return 'blue'; // Màu vàng
                  default:
                      return 'black'; // Màu mặc định
              }
          },
  
          eq: function (a, b) {
              return a === b;
          },
  
          json: function (context) {
              return JSON.stringify(context);
          }, 
  
          or: function (...args) {
              args.pop(); // Xóa `options` của Handlebars
              return args.some(Boolean); // Trả về `true` nếu bất kỳ giá trị nào trong args là `true`
          },
  
          eq: function (a, b) {
              return a === b;  // So sánh a và b, trả về true nếu bằng nhau
          },
  
          gt: function (a, b) {
              return a > b;
          },
            
          lt: function (a, b) {
              return a < b;
          },
            
          // Helper: Phép cộng và trừ
          add: function (a, b) {
              return a + b;
          },
            
          sub: function (a, b) {
              return a - b;
          },
  
          range: function (start, end) {
              let result = [];
              for (let i = start; i <= end; i++) {
                result.push(i);
              }
              return result;
          },
  
          limit: function (array, limit) {
              if (!Array.isArray(array)) {
                  return [];
              }
              return array.slice(0, limit);
          },
  
          skip: function(arr, n) {
              return arr.slice(n); // Sử dụng slice để cắt bỏ n phần tử đầu tiên
          },
      }
  }));
  app.set('view engine', 'hbs');
  app.set('views', './views');
}