const i18n = require('i18n');

const locales = require('../locales/locale');

const i18nInit = (req, res, next) => {
  const cookie = 'lang';
  const queryParameter = 'lang';
  const header = 'accept-language';
  const defaultLocale = locales.en;
  i18n.configure({
    locales: Object.values(locales),
    defaultLocale,
    staticCatalog: {
      [locales.vi]: require('../locales/langs/vi'),
      [locales.en]: require('../locales/langs/en')
    }
  });
  const lang =
    req.query[queryParameter] || req.headers[header] || req.cookies[cookie] || defaultLocale;
  i18n.setLocale(lang);
  return i18n.init(req, res, next);
};

const translate = (phrase, ...replace) => {
  return i18n.__(phrase, ...replace);
};

global._t = translate;

module.exports = i18nInit;
