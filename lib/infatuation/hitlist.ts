import chromium from 'chrome-aws-lambda';
import hash from 'object-hash';

const scrape = async (callback: (error: null, result?: null | undefined | Record<string,any>) => any) => {
  let result = { venues: null, hash: null };
  let browser = null as any;

  const URL = "https://www.theinfatuation.com/new-york/guides/best-new-new-york-restaurants-hit-list"

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    })

    if (!browser) {
      throw new Error('Failed to launch browser');
    }

    let page = await browser.newPage();

    await page.goto(URL, { waitUntil: 'networkidle0' });
    

    // scrape all the restaurants
    const restaurants = await page.evaluate(() => {
      // scape by the data-test-id
      const restaurants = document.querySelectorAll('[data-testid="venue-venueCard"]');
      const restaurantArray = Array.from(restaurants);
      const restaurantData = restaurantArray.map((restaurant) => {
        const link = restaurant.querySelector('[data-testid="venue-venueLink"]').getAttribute('href');
        const name = restaurant.querySelector('[data-testid="venue-venueLink"] h2').textContent;
        const tags = restaurant.querySelectorAll('[data-testid="tag-tagLink"]')
        const tagArray = Array.from(tags);
        const tagData = tagArray.map((tag) => {
          return tag.textContent;
        })
        const links = restaurant.querySelectorAll('.chakra-stack a');
        const linkArray = Array.from(links);
        const linkData = linkArray.map((link) => {
          const href = link.getAttribute('href');
          const text = link.textContent;
          return { href, text };
        })

        
        return {
          link,
          name,
          tags: tagData,
          linkData
        }
      })
      return restaurantData;
    })


    console.log('result', restaurants);
    result = { venues: restaurants, hash: hash(restaurants) };
    
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, result);
};

export default scrape;