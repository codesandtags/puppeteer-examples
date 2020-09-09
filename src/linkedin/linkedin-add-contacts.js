const puppeteer = require("puppeteer");

const { ENTER_KEY } = require('../constants/keys');
const { PUPPETEER_CONFIGURATION } = require('../constants/puppeteer-config');
const LINKEDIN_URL = 'https://www.linkedin.com/';

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

        await page.waitFor('.search-filters-bar button.artdeco-button--2');
        const peopleButton = await page.$('.search-filters-bar button.artdeco-button--2');

        peopleButton && peopleButton.click();
    }

    await page.waitFor(4000);
}

const sendInvitations = async (page, keyword) => {
    const searchContainer = await page.$('.blended-srp-results-js');
    const searchResults = await searchContainer.$$('.search-result__wrapper');

    if (searchResults) {
        console.log(`🔎 Total results found in page ${searchResults.length}`);
        let invitationsSent = 0;
        for (const searchResult of searchResults) {
            const nameSelector = await searchResult.$('.name.actor-name');
            const buttonSelector = await searchResult.$('.search-result__action-button');
            const roleSelector = await searchResult.$('.search-result__info p');

            const contactName = await page.evaluate(element => element.textContent, nameSelector);
            const buttonText = buttonSelector && await page.evaluate(element => element.textContent, buttonSelector);
            const roleText = await page.evaluate(element => element.textContent, roleSelector);

            if (roleText.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 &&
                buttonText && buttonText.trim() === 'Conectar'
            ) {
                await buttonSelector.click();
                const buttonConfirmSelector = await page.$('[aria-label="Enviar ahora"]');

                if (buttonConfirmSelector) {
                    await buttonConfirmSelector.click();
                    await page.waitFor(500);
                }

                await page.waitFor(500);
                console.log(`👨🏻‍💻 Inviting contact  ${contactName.trim()} (${roleText.trim()})`);
                invitationsSent++;
            } else {
                console.log(`🤯 ${contactName.trim()}, contact not matches with role (${roleText.trim()})`);
            }
        }
        console.log(`📧 Total invitations sent in this page ${invitationsSent}`);
        return invitationsSent;
    }
}

const paginateAndSendInvitations = async (page, keyword) => {
    const nextButton = await page.$('.artdeco-pagination__button--next');
    let totalInvitationsSent = 0;

    for (let currentPage = 1; currentPage <= process.env.LINKEDIN_PAGES_TO_SEARCH; currentPage++) {
        console.log(`\n🔎 Searching in the page [${currentPage}]`);
        totalInvitationsSent += await sendInvitations(page, keyword);
        await nextButton.click();
        await page.waitFor(4000);
    }

    console.log(`\n👌🏼 Okay, I just sent [${totalInvitationsSent}] invitations for new contacts!.`);
}

const linkedinAddContacts = async () => {
    console.log('😎 LINKEDIN ADD CONTACTS v1.0.0');
    const browser = await puppeteer.launch(PUPPETEER_CONFIGURATION);
    const page = await browser.newPage();

    try {
        await openWebPage(page);
        await signInUser(page);
        await searchKeyword(page, process.env.LINKEDIN_SEARCH_KEYWORD);
        await paginateAndSendInvitations(page, process.env.LINKEDIN_SEARCH_KEYWORD);
    } catch (error) {
        console.log(`❌ Upssss there is an error with `, error);
        await page.close();
        await browser.close();
        return;
    }

    console.log(`💋 See you at the next opportunity!`);
    await page.close();
    await browser.close();
}

module.exports = {
    openWebPage,
    signInUser,
    searchKeyword,
    sendInvitations,
    linkedinAddContacts,
}