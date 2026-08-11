const axios = require("axios");
const cheerio = require("cheerio");

axios
  .get("https://kusonime.com/genres/action/page/1")
  .then((res) => {
    const $ = cheerio.load(res.data);
    console.log("Next:", $('link[rel="next"]').attr("href"));
    console.log("Prev:", $('link[rel="prev"]').attr("href"));
    console.log("Pagenavi:", $(".wp-pagenavi").html());
    console.log("Pagination class:", $(".pagination").html());
  })
  .catch(console.error);
