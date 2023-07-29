const puppeteer = require('puppeteer');
const axios = require('axios');

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

            // // waiting the products div - using class
            // const divP = '.sc-tagGq.fJAWRj'
            // await frame.waitForSelector('.sc-tagGq.fJAWRj');
            // const dentDiv = await frame.$$(divP + ' > div')
            // console.log(dentDiv.length)

            // await frame.waitForSelector('.sc-jsJBEP.gWKkHv.productInfo > h1');
            // let productTitle = await frame.$eval('.sc-jsJBEP.gWKkHv.productInfo > h1', el => el.innerText);
            // console.log(productTitle);

            await frame.waitForSelector('xpath/' + '//div[@class="sc-jsJBEP gWKkHv productInfo"]/h1')
            const title = await frame.$$('xpath/' + '//div[@class="sc-jsJBEP gWKkHv productInfo"]/h1')
            const price = await frame.$$('xpath/' + '//div[@class="sc-eeDRCY cJyymn productPrice"]/h1')

            const readyProducts = []

            for (let i = 0; i < title.length; i++) {
                let productTitle = await title[i].evaluate(el => el.innerText);
                productTitle = productTitle.slice(0, 30)
                let productPrice = await price[i].evaluate(el => el.innerText)


                readyProducts.push({ id: i++, title: productTitle, price: productPrice })
            }
            console.log(readyProducts);

            const jsonReadyProducts = JSON.stringify(readyProducts)


            async function sendDataToJSONServer(data) {
                try {
                    await axios.post('http://localhost:5000/products', data);

                    console.log('Dados enviados com sucesso para o JSON-Server!');
                } catch (error) {
                    console.error('Erro ao enviar os dados para o JSON-Server:', error);
                }
            }
            sendDataToJSONServer(jsonReadyProducts)

        }

    })()