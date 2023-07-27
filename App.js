const puppeteer = require('puppeteer');



(async () => {
    const linkKabum = 'https://www.kabum.com.br/login?redirect_uri=https://www.kabum.com.br/minha-conta/favoritos'

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(linkKabum)

    await page.type('.sc-iGgWBj.cnXDzr.inputForm input[type="text"]', 'hankdzn@gmail.com')
    await page.type('.sc-iGgWBj.cnXDzr.inputForm input[type="password"]', 'hamachi21')

    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    const fav = await page.waitForXPath('//*[@id="__next"]/main/div/button/h1')



        


})()