---
title: Simple End-to-end Test for Log-in Flow with Puppeteer
date: "2019-07-30"
tags: ['puppeteer', 'login']
author: "Chih-Ching Chang"
path: "/login-puppeteer"
---

I'm trying to figure out how to build end-to-end test by [Puppeteer](https://pptr.dev/).
It is quite trivial to set up some basic tests by following its documentation.

```javascript
// from https://pptr.dev/
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({path: 'example.png'});

  await browser.close();
})();
```

I would like to extend the above example to create a simeple login flow test.

First, let's go to the page that we want to login.

```javascript{6}
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://github.com/login');
})();
```

Then, we would like to type-in account and password. We need to get the input fields first so that we can know where we could type in our account and password. Take github as an example, it uses input with `name="login"` for emails / account and input with `type="password"`.

```javascript{8-12}
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://github.com/login');

  await page.waitForSelector('input[name="login"]');
  await page.type('input[name="login"]', 'test_login');

  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', 'test_pwd');
})();
```

It is important to always wait for selector to find the element first so that we can trigger our action at the correct DOM element.

After that, we would like to click on the login button to submit information.

```javascript{14-15}
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://github.com/login');

  await page.waitForSelector('input[name="login"]');
  await page.type('input[name="login"]', 'test_login');

  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', 'test_pwd');

  await page.waitForSelector('input[type="submit"]');
  await page.click('input[type="submit"]');
})();
```

Finally, we would like to check if we successfully log in by checking if we are redirected to the correct page.
We could use `page.url()` to see if it is correct. If not, then `throw Error`.
When dealing with this part, in my case (not the github example), I encounter several url redirection and I might get the wrong url if not waiting long enough.
If log-in flow contains several url redirection, we could add [`waitForNavigation`](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagewaitfornavigationoptions) to wait until we reach our final destination. 

And don't forget to close your browser in the end.

```javascript{17-22}
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://github.com/login');

  await page.waitForSelector('input[name="login"]');
  await page.type('input[name="login"]', 'test_login');

  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', 'test_pwd');

  await page.waitForSelector('input[type="submit"]');
  await page.click('input[type="submit"]');

  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  if (page.url() !== 'https://github.com')
    throw new Error('Login fail!');

  await browser.close();
})();
```

Note, default mode for Puppeteer is headless. You could use `puppeteer.launch({ headless:false });` at the very beginning to actually see how every step works. :D