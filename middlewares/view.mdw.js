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
          truncate: function (text, length) {
            if (text && text.length > length) {
                return text.substring(0, length) + '...'; // Thêm dấu ba chấm sau khi cắt
            }
            return text;
         }   
        }
  }));
  app.set('view engine', 'hbs');
  app.set('views', './views');
}