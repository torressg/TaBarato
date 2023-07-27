const puppeteer = require('puppeteer');


(async () => {
    // link Website
    const linkKabum = 'https://www.kabum.com.br/login?redirect_uri=https://www.kabum.com.br/minha-conta/favoritos'

    // default for puppeteer
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // go to website
    await page.goto(linkKabum)

    // login
    await page.type('.sc-iGgWBj.cnXDzr.inputForm input[type="text"]', 'hankdzn@gmail.com')
    await page.type('.sc-iGgWBj.cnXDzr.inputForm input[type="password"]', 'hamachi21')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    // waiting for Page title
    const fav = await page.waitForXPath('//*[@id="__next"]/main/div/button/h1')

    // conditional to know if page load
    if (fav) {
        // getting frames page
        const frames = page.frames();
        const frame = frames[0];

        const divP = '.sc-tagGq.fJAWRj'
        await frame.waitForSelector('.sc-tagGq.fJAWRj');
        const dentDiv = await frame.$$(divP + ' > div')
        console.log(dentDiv.length)

        // // waiting the products div - using class
        // await frame.waitForSelector('.sc-jsJBEP.gWKkHv.productInfo > h1');
        // let productTitle = await frame.$eval('.sc-jsJBEP.gWKkHv.productInfo > h1', el => el.innerText);
        // console.log(productTitle);

        await frame.waitForSelector('xpath/' + '//div[@class="sc-jsJBEP gWKkHv productInfo"]/h1')
        const products = await frame.$$('xpath/' + '//div[@class="sc-jsJBEP gWKkHv productInfo"]/h1')

        let productTitle = await products[0].evaluate(el => el.innerText);
        console.log(productTitle);

    }

})()