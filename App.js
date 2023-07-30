const puppeteer = require('puppeteer');
const axios = require('axios');
require('dotenv').config();

(async () => {
    // link Website
    const linkKabum = 'https://www.kabum.com.br/login?redirect_uri=https://www.kabum.com.br/minha-conta/favoritos'

    // default for puppeteer
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // go to website
    await page.goto(linkKabum)

    // login
    await page.type('.sc-iGgWBj.cnXDzr.inputForm input[type="text"]', process.env.USER_EMAIL)
    await page.type('.sc-iGgWBj.cnXDzr.inputForm input[type="password"]', process.env.USER_PASSWORD)
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    // waiting for Page title
    const fav = await page.waitForXPath('//*[@id="__next"]/main/div/button/h1')

    // conditional to know if page load
    if (fav) {
        // getting frames page
        const frames = page.frames();
        const frame = frames[0];

        // // waiting the products div - USING CLASS
        // const divP = '.sc-tagGq.fJAWRj'
        // await frame.waitForSelector('.sc-tagGq.fJAWRj');
        // const dentDiv = await frame.$$(divP + ' > div')
        // console.log(dentDiv.length)

        // await frame.waitForSelector('.sc-jsJBEP.gWKkHv.productInfo > h1');
        // let productTitle = await frame.$eval('.sc-jsJBEP.gWKkHv.productInfo > h1', el => el.innerText);
        // console.log(productTitle);

        // waiting the product div/h1
        await frame.waitForSelector('xpath/' + '//div[@class="sc-jsJBEP gWKkHv productInfo"]/h1')
        // getting the all value of fav products title
        const title = await frame.$$('xpath/' + '//div[@class="sc-jsJBEP gWKkHv productInfo"]/h1')
        // getting the all value of fav products price
        const price = await frame.$$('xpath/' + '//div[@class="sc-eeDRCY cJyymn productPrice"]/h1')

        // initiating the product array
        let readyProducts = []

        // function to send products to db.json
        async function sendDataToJSONServer(data) {
            try {
                await axios.post('http://localhost:5000/products', data);

                console.log('Dados enviados com sucesso para o JSON-Server!');
            } catch (error) {
                console.error('Erro ao enviar os dados para o JSON-Server:', error);
            }
        }

        // loop over the quantity of products
        for (let i = 0; i < title.length; i++) {
            // getting the value of h1 in product title div
            let productTitle = await title[i].evaluate(el => el.innerText);
            // transforming the data
            productTitle = (productTitle.slice(0, 30)).replace(',','')
            // getting the value of h1 in product price div
            let productPrice = await price[i].evaluate(el => el.innerText)
            // transforming the data
            productPrice = parseFloat((productPrice.slice(3, 10)).replace(',', '.'))

            // organizing the data to send to db.json
            readyProducts = { id: i + 1, title: productTitle, price: productPrice }

            sendDataToJSONServer(readyProducts);
        }

    }

})()