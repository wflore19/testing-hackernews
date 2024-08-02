const { test, expect } = require("@playwright/test");
const { sortHackerNewsArticles } = require("../index");

test("Latest Articles", async () => {
	let articles;
	await test.step("Extracting Articles", async () => {
		const data = await sortHackerNewsArticles();
		articles = data.articles;
	});

	await test.step("Checking not null", async () => {
		await expect(articles).not.toBeNull();
	});

	await test.step("Checking number of articles (100)", async () => {
		await expect(articles).toHaveLength(100); // Returns 100 articles
	});

	await test.step("Checking Articles object...", async () => {
		await expect(articles[0]).toHaveProperty("datePosted"); // Contains 'date' property
	});

	await test.step("Checking if sorted by latest", async () => {
		for (let i = 0; i < articles.length - 1; i++) {
			await expect(articles[i].datePosted).toBeGreaterThanOrEqual(
				articles[i + 1].datePosted
			);
		}
	});
});
