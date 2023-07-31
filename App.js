const puppeteer = require('puppeteer');
const axios = require('axios');
require('dotenv').config();

(async () => {
    // link Website
    const linkKabum = 'https://www.kabum.com.br/login?redirect_uri=https://www.kabum.com.br/minha-conta/favoritos'
    const email = process.env.USER_EMAIL
    const password = process.env.USER_PASSWORD

    // default for puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // go to website
    await page.goto(linkKabum)

    // login
    await page.type('.sc-iGgWBj.cnXDzr.inputForm input[type="text"]', email)
    await page.type('.sc-iGgWBj.cnXDzr.inputForm input[type="password"]', password)
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

        async function getDataFromJSONServer(id) {
            try {
                const response = await axios.get(`http://localhost:5000/products/${id + 1}`);
                let dado = response.data;
                return dado

            } catch (error) {
                console.error('Erro ao obter os dados do JSON-Server(GET):', error);
            }
        }

        // function to send products to db.json
        async function sendDataToJSONServer(data) {
            try {
                await axios.post('http://localhost:5000/products', data);

                console.log('Dados enviados com sucesso para o JSON-Server!');
            } catch (error) {
                console.error('Erro ao enviar os dados para o JSON-Server:', error);
            }
        }


        const productDb = await getDataFromJSONServer()

        // initiating the product array
        let readyProduct = []

        // loop over the quantity of products
        for (let i = 0; i < title.length; i++) {

            const productDb = await getDataFromJSONServer(i)
            // getDataFromJSONServer()
            // getting the value of h1 in product title div
            let productTitle = await title[i].evaluate(el => el.innerText);
            // transforming the data
            productTitle = (productTitle.slice(0, 30)).replace(',', '')
            // getting the value of h1 in product price div
            let productPrice = await price[i].evaluate(el => el.innerText)
            // transforming the data
            productPrice = parseFloat((productPrice.slice(3, 10)).replace(',', '.'))
            // organizing the data to send to db.json
            readyProduct = { id: i + 1, title: productTitle, price: productPrice }

            if (productPrice < productDb.price) {
                // sendDataToJSONServer(readyProduct);
                console.log(`O produto ${productDb.title} está R$ ${productDb.price - productPrice} mais barato.`)
            } else {
                console.log('Mesmos valores :(')
                // console.log(readyProduct)
                // console.log(dbPrice)
            }


        }



    }
    await browser.close()
})()