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
        // getting frames page
        const frames = page.frames();
        const frame = frames[0];

        // waiting the product div/h1
        await frame.waitForSelector('xpath/' + '//div[@class="sc-jsJBEP gWKkHv productInfo"]/h1')
        // getting the all value of fav products title
        const title = await frame.$$('xpath/' + '//div[@class="sc-jsJBEP gWKkHv productInfo"]/h1')
        // getting the all value of fav products price
        const price = await frame.$$('xpath/' + '//div[@class="sc-eeDRCY cJyymn productPrice"]/h1')

        console.log(title)
        console.log(price)


        // function to get products from db.json
        // async function getDataFromJSONServer(id) {
        //     try {
        //         const response = await axios.get(`http://localhost:5000/products/${id + 1}`);
        //         let dados = response.data;
        //         return dados
        //     } catch (error) {
        //         console.error('Erro ao obter os dados do JSON-Server:', error);
        //     }
        // }
        // async function checkDataFromJSONServer(id) {
        //     try {
        //         const response = await axios.get(`http://localhost:5000/products`);
        //         let dados = response.data;
        //         return dados
        //     } catch (error) {
        //         console.error('Erro ao obter os dados do JSON-Server:', error);
        //     }
        // }

        // // function to send products to db.json
        // async function sendDataToJSONServer(data) {
        //     try {
        //         await axios.post('http://localhost:5000/products', data);
        //         console.log('Dados enviados com sucesso para o JSON-Server!');
        //     } catch (error) {
        //         console.error('Erro ao enviar os dados para o JSON-Server:', error);
        //     }
        // }

        // // function to DELETE product from db.json
        // async function deleteDataFromJSONServer(id) {
        //     try {
        //         await axios.delete(`http://localhost:5000/products/${id + 1}`);
        //         console.log('Dado deletado.');
        //     } catch (error) {
        //         console.error('Erro ao deletar o dado do JSON-Server(:', error);
        //     }
        // }

        // // initiating the product array
        // let readyProduct = []
        // let nullDb = await checkDataFromJSONServer()
        // // loop over the quantity of products
        // for (let i = 0; i < title.length; i++) {
        //     // condition to DB null
        //     if (nullDb.length === 0) {
        //         // getting the value of h1 in product title div
        //         let productTitle = await title[i].evaluate(el => el.innerText);
        //         // transforming the data
        //         productTitle = (productTitle.slice(0, 30)).replace(',', '')
        //         // getting the value of h1 in product price div
        //         let productPrice = await price[i].evaluate(el => el.innerText)
        //         // condition to thousand prices
        //         if (productPrice.length > 9) {
        //             // transforming the data
        //             productPrice = parseFloat(((productPrice.slice(3, 11)).replace(".", "")).replace(",", "."))
        //         } else {
        //             // transforming the data
        //             productPrice = parseFloat((productPrice.slice(3, 10)).replace(',', '.'))
        //         }
        //         // organizing the data to send to db.json
        //         readyProduct = { id: i + 1, title: productTitle, price: productPrice }
        //         await sendDataToJSONServer(readyProduct);
        //         console.log(`O produto ${readyProduct.title} foi inserido com suscesso.`)
        //     } else {
        //         const productDb = await getDataFromJSONServer(i)
        //         // getting the product value and attributing to const
        //         let productTitle = await title[i].evaluate(el => el.innerText);
        //         // transforming the data
        //         productTitle = (productTitle.slice(0, 30)).replace(',', '')
        //         // getting the value of h1 in product price div
        //         productPrice = await price[i].evaluate(el => el.innerText)
        //         // condition to thousand prices
        //         if (productPrice.length > 9) {
        //             // transforming the data
        //             productPrice = parseFloat(((productPrice.slice(3, 11)).replace(".", "")).replace(",", "."))
        //         } else {
        //             // transforming the data
        //             productPrice = parseFloat((productPrice.slice(3, 10)).replace(',', '.'))
        //         }
        //         // organizing the data to send to db.json
        //         readyProduct = { id: i + 1, title: productTitle, price: productPrice }
        //         // condition to compare Web Price and DB Price, IF Web Price lower than DB Price...
        //         if (productPrice < productDb.price) {
        //             console.log(`O produto ${productDb.title} está R$ ${productDb.price - productPrice} mais barato.`)
        //             // delete the product
        //             await deleteDataFromJSONServer(i)
        //             // send the new product price
        //             await sendDataToJSONServer(readyProduct);
        //         } else {
        //             console.log(`O produto ${productDb.title} não teve diferença no valor.`)
        //         }
        //     }
        // }
    }
    await browser.close()
})()