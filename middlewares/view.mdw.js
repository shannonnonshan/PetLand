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
          section: hbs_sections(),
          formatDate: function (date) {
              return moment(date).format('YYYY-MM-DD HH:mm:ss'); // Định dạng ngày theo YYYY-MM-DD
          }      }
  }));
  app.set('view engine', 'hbs');
  app.set('views', './views');
}