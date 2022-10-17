import chromium from 'chrome-aws-lambda';

const scrape = async (callback: (error: null, result?: null | undefined) => any) => {
  let result = null;
  let browser = null as any;

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

    await page.goto('https://google.com');

    result = await page.title();
    console.log('result', result);
    
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