require('dotenv').config();
const { linkedinAddContacts } = require('./src/linkedin/linkedin-add-contacts');

(async () => {
    console.time('Puppeteer execution');
    await linkedinAddContacts();
    console.timeEnd('Puppeteer execution');
})();