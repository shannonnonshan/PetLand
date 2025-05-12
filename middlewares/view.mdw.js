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
          price_number(value) {
            return numeral(value).format('0,0')
            },
          countByKey: function(array, key) {
            const counts = array.reduce((acc, item) => {
              const value = item[key];
              acc[value] = (acc[value] || 0) + 1;
              return acc;
            }, {});
            return counts;
          },
          getCount: function(countObj, key) {
            return countObj[key] || 0;
          },
          countStatusIf: function(array, condition) {
            let count = 0;
            // Duyệt qua mảng và đếm phần tử thỏa mãn điều kiện
            array.forEach(item => {
              if (item.status === condition) { // Giả sử điều kiện là status
                count++;
              }
            });
            return count;
          },
          section: hbs_sections(),
          formatDate: function (date) {
              return moment(date).format('YYYY-MM-DD HH:mm'); // Định dạng ngày theo YYYY-MM-DD
          }, 
          formatDay: function (date) {
              return moment(date).format('YYYY-MM-DD'); 
          }, 
          truncate: function (text, length) {
            if (text && text.length > length) {
                return text.substring(0, length) + '...'; // Thêm dấu ba chấm sau khi cắt
            }
            return text;
         },  
        
          starRating: function (rate) {
            const filled = '★'.repeat(rate);
            const empty = '☆'.repeat(5 - rate);
            return filled + empty;
          },
          eq: function (a, b) {
            return a === b;
          }, 
          or: function (a, b) {
            return a || b;
          },    
      }
  }));
  app.set('view engine', 'hbs');
  app.set('views', './views');
}