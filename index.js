const puppeteer = require("puppeteer");
require('dotenv').config();

const LINKEDIN_URL = 'https://www.linkedin.com/';
const PUPPETEER_CONFIGURATION = {
    headless: false,               // Browser headless flag
    slowMo: 50,                   // Delay for each command,
    defaultViewport: {
        width: 1080,
        height: 1920
    }
};
const ENTER_KEY = 'Enter';

const openWebPage = async (page) => {
    console.log(`🤞🏼 Open ${LINKEDIN_URL}`);
    await page.goto(LINKEDIN_URL);
};

const signInUser = async (page) => {
    console.log(`🔑 Login user ${process.env.LINKEDIN_USERNAME}`);
    const emailInput = await page.$("#session_key");
    const passwordInput = await page.$("#session_password");
    const submitButton = await page.$('button.sign-in-form__submit-button');

    await emailInput.focus();
    await page.keyboard.type(process.env.LINKEDIN_USERNAME);
    await passwordInput.focus();
    await page.keyboard.type(process.env.LINKEDIN_PASSWORD);
    await submitButton.click();
};

const searchKeyword = async (page, keyword) => {
    await page.waitFor('input.search-global-typeahead__input');
    const inputSearch = await page.$('input.search-global-typeahead__input');

    if (inputSearch) {
        console.log(`🔎 Search the keyword [${keyword}]`);
        await inputSearch.focus();
        await page.keyboard.type(keyword);
        await page.keyboard.press(ENTER_KEY);
    }

    await page.waitFor(5000);
}

const sendInvitations = async (page) => {
    console.log(`🔎 Sending invitations to ${20}`);
}

(async () => {
    console.log('😎 Welcome to my labs!');
    const browser = await puppeteer.launch(PUPPETEER_CONFIGURATION);
    const page = await browser.newPage();

    try {
        await openWebPage(page);
        await signInUser(page);
        await searchKeyword(page, 'Front End Developer');
        await sendInvitations(page)
    } catch (error) {
        console.log(`❌ Upssss there is an error with `, error);
        await page.close();
        await browser.close();
        return;
    }

    /*console.log('Waiting for network link');
    await page.waitFor('[data-alias=relationships]');
    const networkLink = await page.$('[data-alias=relationships]');

    await networkLink.click();

    await page.waitFor(5000);
    const cardList = await page.$$('li.discover-entity-card');

    if (cardList && cardList.length > 0) {
        for (const card of cardList) {
            const name = await card.$('.discover-person-card__name');
            if (name) {
                const nameText = await page.evaluate(element => element.textContent, name);
                const buttonInvite = await card.$('.artdeco-button--2')
                await buttonInvite.click();
                console.log(`\n 📧 Sending invite to [${nameText.trim()}]`);
                await page.waitFor(1000);
            }
        }
    }*/

    // console.log(connectButtons);
    // console.log(connectButtons.length);


    // Cerramos la página y el navegador.
    console.log(`💋 See you in a next opportunity. I was so happy doing something for you!`);
    await page.close();
    await browser.close();
})();