// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function extractArticles(page) {
	const ARTICLES_LIMIT = 100;
	const articles = new Array();

	while (articles.length < 100) {
		const ids = await page.locator("span.rank").allTextContents();

		const titles = await page
			.locator("span.titleline > a")
			.allTextContents();

		const elements = await page.locator("span.age[title]").all();
		const dates = await Promise.all(
			elements.map((element) => {
				return element.getAttribute("title");
			})
		);

		const sincePosted = await page
			.locator("span.age[title] > a[href^='item']")
			.allTextContents();

		const authors = await page
			.locator("a[href^='user'].hnuser")
			.allTextContents();

		// populate articles array
		let i = 0;
		while (i < ids.length && articles.length < ARTICLES_LIMIT) {
			const article = new Object({
				id: ids[i],
				title: titles[i],
				author: authors[i],
				datePosted: new Date(dates[i]).getTime(),
				sincePosted: sincePosted[i],
			});
			articles.push(article);
			i += 1;
		}
		await page.waitForTimeout(2500); // `chromium` required a 2.5 second buffer
		await page.locator("a.morelink[rel='next']").click(); // next page
	}

	return articles;
}

async function sortHackerNewsArticles() {
	// launch browser
	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();
	const page = await context.newPage();

	// go to Hacker News
	await page.goto("https://news.ycombinator.com/newest");

	// wait for the full list to finish loading before calling locator.all()
	await page.waitForTimeout(1000);

	// extracts the first 100 articles from hackernews
	const articles = await extractArticles(page);

	await browser.close();

	return {
		articles,
	};
}

module.exports = {
	sortHackerNewsArticles,
};
