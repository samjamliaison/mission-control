const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const pages = [
    { name: 'tasks', url: 'http://localhost:3000' },
    { name: 'pipeline', url: 'http://localhost:3000/pipeline' },
    { name: 'calendar', url: 'http://localhost:3000/calendar' },
    { name: 'memory', url: 'http://localhost:3000/memory' },
    { name: 'team', url: 'http://localhost:3000/team' },
    { name: 'office', url: 'http://localhost:3000/office' }
  ];

  for (const pageInfo of pages) {
    try {
      console.log(`Taking screenshot of ${pageInfo.name}...`);
      await page.goto(pageInfo.url, { waitUntil: 'networkidle2' });
      
      // Wait a bit for animations to settle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const screenshotPath = path.join(screenshotsDir, `${pageInfo.name}.png`);
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true
      });
      
      console.log(`Screenshot saved: ${screenshotPath}`);
    } catch (error) {
      console.error(`Error taking screenshot of ${pageInfo.name}:`, error);
    }
  }

  await browser.close();
  console.log('All screenshots completed!');
}

takeScreenshots().catch(console.error);