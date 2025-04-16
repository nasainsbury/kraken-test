# Kraken Tech Test

## Running the application

Ensure you have [Node 22](https://nodejs.org/en/blog/release/v22.11.0) installed, I recommend using [NVM](https://github.com/nvm-sh/nvm).

```
~/ $ git clone git@github.com:nasainsbury/kraken-test.git
~/kraken-test $ npm install
~/kraken-test $ npm start
```

## Testing the application

```
~/kraken-test $ npm test
```

I spent a bit of time trying to find an elegant solution and found I was overengineering it and second-guessing myself. I opted to start by creating an interface for a class that would retrieve and post information about outages etc, this could then be used to more easily refactor the code so long as whatever class still satisfied the interface.

To parse/validate data I opted for Zod to essentially have run-time types.

With respect to occasional 500 errors, I opted to make a simple retry fetch method, something I've never actual done before. It's likely over-engineered and something "off the shelf" would be better. However, it was fun to write and test it. I opted to only retry 500s rather than all errors. If I was being smarter with this, I'd potentially add in options such that certain other status codes could be retried (i.e 429 too many requests with longer wait intervals).

I decided to just make this a simple script where you run `npm start`, the `baseUrl` and `apiKey` are hard coded. I toyed with the idea of using [commander](https://www.npmjs.com/package/commander), or even making it a lambda with the [Serverless Framework](https://www.serverless.com/) and setting up triggers, either via CRON, HTTP or some other event. I opted to just [KISS](https://en.wikipedia.org/wiki/KISS_principle).

This is by no means a perfect example, and there are tests missing. For example, the business logic within the `main` function is completed untested. If I spent more time on this, I'd add these tests and likely refactor what I'd already done. There should be tests added to ascertain the transformations we do to the `outages` array along with the filtering.
