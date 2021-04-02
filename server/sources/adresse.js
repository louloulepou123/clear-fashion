const axios = require('axios');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product_list .product-container')
    .filter((i, element) => {
      const link = $(element)
      .find('.product_img_link')
      .attr('href');
      if (link) {
        return true;
      } else {return false;}
    })
    .map((i, element) => {
      const link = $(element)
      .find('.product_img_link')
      .attr('href');

      const _id = uuidv5(link, uuidv5.URL);

      const name = $(element)
        .find('.product-name')
        .attr('title');
      const price = parseFloat(
        $(element)
          .find('.price.product-price')
          .text()
      );

      const image = $(element)
        .find('.replace-2x')
        .attr('data-original');

      return {_id, 'brand':'adresse', name, price, link, image};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};