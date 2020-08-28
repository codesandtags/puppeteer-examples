const PUPPETEER_CONFIGURATION = {
    headless: false,               // Browser headless flag
    slowMo: 10,                   // Delay for each command,
    defaultViewport: {
        width: 1080,
        height: 1920
    }
};

module.exports = {
    PUPPETEER_CONFIGURATION
}