const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require("fs").promises;
require('dotenv').config();

(async () => {
    // link Website
    const linkKabum = 'https://www.kabum.com.br/minha-conta/favoritos'
    const email = process.env.USER_EMAIL
    const password = process.env.USER_PASSWORD

    // default for puppeteer
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const cookiesString = await fs.readFile("./cookies.json");
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);

    // go to website
    await page.goto(linkKabum, {
        waitUntil: "networkidle2",
    })

    // waiting for Page title
    const fav = await page.waitForXPath('//*[@id="__next"]/main/div/button/h1')

    // conditional to know if page load
    if (fav) {

        // waiting the product div/h1
        await page.waitForSelector('.sc-kUdmhA.jIQHKt.productInfo')
        // getting the all value of fav products title
        const title = await page.$$('.sc-kUdmhA.jIQHKt.productInfo')
        // getting the all value of fav products price
        const price = await page.$$('sc-hgRRfv.cCgonk.productPrice')

        const quantidadeDivs = await page.evaluate(() => {
            const divs = document.querySelectorAll('.sc-jwZKMi.deZitn .sc-bvgPty.jUfdHL');
            return divs.length;
        });

        // initiating the product array
        let readyProduct = []
        let nullDb = 0
        // loop over the quantity of products
        for (let i = 0; i < quantidadeDivs; i++) {
            // condition to DB null
            if (nullDb === 0) {
                // getting the value of h1 in product title div
                let productTitle = await title[i].evaluate(el => el.innerText);
                // transforming the data
                productTitle = (productTitle.slice(0, 30)).replace(',', '')
                // getting the value of h1 in product price div
                let productPrice = await price[i].evaluate(el => el.innerText)

                readyProduct = { id: i + 1, title: productTitle, price: productPrice }

                console.log(`O produto ${readyProduct.title} foi inserido com suscesso.`)
            } else {
                console.log('ou')
            }
        }
    }
    await browser.close()
})()