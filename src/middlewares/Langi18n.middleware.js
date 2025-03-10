import { join,dirname } from 'path';
import i18n from 'i18n';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

i18n.configure({
  locales: ['en', 'hi'],
  directory: join(__dirname, "../jsons"),
  defaultLocale: 'en',
  queryParameter: 'lang',
  autoReload: true,
  syncFiles: true,
  objectNotation: true,
});

const langI18nMiddleware = (req, res, next) => {
  console.log("dir: ",join(__dirname, "../jsons"))
  let lang = req.query.lang || req.headers['accept-language'] || 'en';
  req.setLocale(lang);
  req.t = req.__.bind(req);
  next();
};

export default langI18nMiddleware;
