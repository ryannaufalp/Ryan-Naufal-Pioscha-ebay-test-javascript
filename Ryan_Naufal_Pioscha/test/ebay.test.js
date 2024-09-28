import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import 'chromedriver';
import chrome from 'selenium-webdriver/chrome.js'; 

describe('eBay Product Filtering and Search Test', function () {
  this.timeout(100000);
  let driver;

  before(async function () {
    let options = new chrome.Options();
    options.addArguments("--disable-blink-features=AutomationControlled");
    options.addArguments("--disable-infobars");
    options.addArguments("--disable-extensions");

    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    await driver.manage().window().maximize();
  });

  after(async function () {
    await driver.quit();
  });

  // Scenario 1: Access a Product via Category after Applying Multiple Filters
  it('should access a product via category and apply multiple filters', async function () {
    await driver.get('https://www.ebay.com');


    await driver.findElement(By.linkText('Electronics')).click();
    await driver.wait(until.elementLocated(By.linkText('Cell Phones, Smart Watches & Accessories')), 10000);
    await driver.findElement(By.linkText('Cell Phones, Smart Watches & Accessories')).click();

    await driver.wait(until.elementLocated(By.linkText('Cell Phones & Smartphones')), 10000);
    await driver.findElement(By.linkText('Cell Phones & Smartphones')).click();

    await driver.executeScript('window.scrollBy(0, 500);');

    await driver.wait(until.elementLocated(By.xpath('//*[ text() = "All Filters" ]')), 10000);
    await driver.findElement(By.xpath('//*[ text() = "All Filters" ]')).click();

    await driver.wait(until.elementLocated(By.xpath('//*[@data-aspecttitle="LH_ItemCondition"]')), 10000);
    await driver.findElement(By.xpath('//*[@data-aspecttitle="LH_ItemCondition"]')).click();

    let newConditionCheckbox = await driver.wait(until.elementLocated(By.id('c3-subPanel-LH_ItemCondition_New_cbx')), 10000);
    await newConditionCheckbox.click();

    await driver.wait(until.elementLocated(By.xpath('//*[@data-aspecttitle="price"]')), 10000);
    await driver.findElement(By.xpath('//*[@data-aspecttitle="price"]')).click();

    const minPrice = await driver.wait(until.elementLocated(By.xpath('//input[@aria-label="Minimum Value, US Dollar"]')), 10000);
    const maxPrice = await driver.wait(until.elementLocated(By.xpath('//input[@aria-label="Maximum Value, US Dollar"]')), 10000);

    await minPrice.clear();
    await minPrice.sendKeys('10000000');
    await maxPrice.clear();
    await maxPrice.sendKeys('100000000');
    
    await driver.wait(until.elementLocated(By.xpath('//*[@data-aspecttitle="location"]')), 10000);
    await driver.findElement(By.xpath('//*[@data-aspecttitle="location"]')).click();
    
    let newLocationCheckbox = await driver.wait(until.elementLocated(By.xpath('//input[@aria-label="US Only"]')), 80000);
    await newLocationCheckbox.click();
    
    
    await driver.findElement(By.xpath("//button[text()='Apply']")).click();

    // # Real Browser
    // let appliedFilter = await driver.wait(until.elementLocated(By.xpath('//button[span[contains(text(),"3 filters applied")]]')));
    // await appliedFilter.click();


    // await driver.wait(until.elementLocated(By.xpath("//span[contains(text()='Condition: New')]")), 10000);
    //await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Price: $10,000,000.00 to $100,000,000.00')]")), 10000);
    // await driver.wait(until.elementLocated(By.xpath("//span[contains(text()='Item Location: US Only')]")), 10000);

    //const conditionTag = await driver.findElement(By.xpath("//span[contains(text()='Condition: New')]")).isDisplayed();
    //const priceTag = await driver.findElement(By.xpath("//span[contains(text(), 'Price: $10,000,000.00 to $100,000,000.00')]")).isDisplayed();
    //const locationTag = await driver.findElement(By.xpath("//span[contains(text()='Item Location: US Only')]")).isDisplayed();

    // expect(conditionTag).to.be.true;
    // expect(priceTag).to.be.true;
    // expect(locationTag).to.be.true;

    // # Automated Browser
    await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'IDR10,000,000.00 and IDR100,000,000.00')]")), 10000);
    const priceTag = await driver.findElement(By.xpath("//span[contains(text(), 'IDR10,000,000.00 and IDR100,000,000.00')]")).isDisplayed();

    expect(priceTag).to.be.true;

  });

  // Scenario 2: Access a Product via Search
  it('should access a product via search and verify first result', async function () {
    await driver.get('https://www.ebay.com');

    const searchBar = await driver.wait(until.elementLocated(By.id('gh-ac')), 10000);
    await searchBar.clear();
    await searchBar.sendKeys('MacBook');

    const categoryDropdown = await driver.wait(until.elementLocated(By.id('gh-cat')), 10000);
    await categoryDropdown.sendKeys('Computers/Tablets & Networking');

    await driver.wait(until.elementLocated(By.id('gh-btn')), 10000).click();

    await driver.wait(until.titleContains('MacBook'), 10000);
    const pageTitle = await driver.getTitle();
    expect(pageTitle).to.include('MacBook');

    const firstResult = await driver.wait(until.elementLocated(By.css(".s-item__title > span > span")), 10000).getText();
    expect(firstResult.toLowerCase()).to.include('macbook');
  });
});
