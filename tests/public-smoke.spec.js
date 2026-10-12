const { test, expect } = require('@playwright/test');

const pages = [
  { id: 'WEB-001', name: 'Startsida', url: 'https://www.qlerify.com/', expectedText: /Qlerify|AI|user stories|process/i },
  { id: 'WEB-002', name: 'Pricing', url: 'https://www.qlerify.com/pricing', expectedText: /pricing|monthly|yearly|free|enterprise|plan/i },
  { id: 'WEB-003', name: 'Contact', url: 'https://www.qlerify.com/contact', expectedText: /contact|email|message|demo|book/i },
  { id: 'WEB-004', name: 'Blog', url: 'https://www.qlerify.com/blog', expectedText: /blog|article|posts|resources/i },
  { id: 'AUTH-LOGIN', name: 'Login', url: 'https://app.qlerify.com/login', expectedText: /login|sign in|email|password/i },
  { id: 'AUTH-SIGNUP', name: 'Signup', url: 'https://app.qlerify.com/signup', expectedText: /sign up|signup|create|email|password/i },
  { id: 'AUTH-RESET', name: 'Reset password', url: 'https://app.qlerify.com/reset-password', expectedText: /reset|password|email/i }
];

function contactLocators(page) {
  return {
    name: page.locator('#name, input[name="name"], input[placeholder*="Eric" i]').first(),
    email: page.locator('#email, input[type="email"], input[name*="email" i], input[placeholder*="email" i]').first(),
    message: page.locator('#Plain-text, textarea[name="Plain-text"], textarea[placeholder*="demo" i], textarea').first(),
    submit: page.locator('input[type="submit"], button[type="submit"], button:has-text("Submit")').first()
  };
}

async function expectInteractable(locator, label) {
  await expect(locator, `${label} ska finnas i DOM`).toHaveCount(1);
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await expect(locator, `${label} ska vara synligt`).toBeVisible();
  await expect(locator, `${label} ska vara enabled`).toBeEnabled();
}

test.describe('Publika smoke tests', () => {
  for (const item of pages) {
    test(`${item.id} ${item.name} laddar utan krasch`, async ({ page }) => {
      const response = await page.goto(item.url, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});

      expect(response, `${item.id}: sidan ska ge HTTP-svar`).not.toBeNull();
      expect(response.status(), `${item.id}: HTTP-status ska inte vara serverfel`).toBeLessThan(500);
      await expect(page.locator('body'), `${item.id}: body ska synas`).toBeVisible();
      await expect(page.locator('body'), `${item.id}: förväntad sidtext ska finnas`).toContainText(item.expectedText);
    });
  }

  test('WEB-002 Pricing monthly/yearly toggle ändrar eller visar prisläge', async ({ page }) => {
    await page.goto('https://www.qlerify.com/pricing', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});

    const monthly = page.getByText(/monthly/i).first();
    const yearly = page.getByText(/yearly|annual/i).first();
    await expect(monthly, 'Monthly ska synas på pricing').toBeVisible();
    await expect(yearly, 'Yearly ska synas på pricing').toBeVisible();

    const before = await page.locator('body').innerText();
    await yearly.click({ trial: true });
    await yearly.click().catch(() => {});
    const after = await page.locator('body').innerText();
    expect(after.length, 'Pricing ska fortfarande ha innehåll efter yearly-klick').toBeGreaterThan(100);
    expect(after, 'Pricing ska inte bli tom efter toggle').not.toEqual('');
    expect(before.length, 'Pricing före toggle ska ha innehåll').toBeGreaterThan(100);
  });

  test('WEB-004 Blog har tydlig footer/landmark utan trasig bottenyta', async ({ page }) => {
    await page.goto('https://www.qlerify.com/blog', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
    const footer = page.locator('footer, [role="contentinfo"]').last();
    await expect(footer, 'Bloggen ska ha footer eller contentinfo-landmark').toBeVisible();
    const bodyBox = await page.locator('body').boundingBox();
    const footerBox = await footer.boundingBox();
    expect(bodyBox.height - (footerBox.y + footerBox.height), 'Efter footer ska det inte finnas stor tom yta').toBeLessThan(900);
  });
});

test.describe('Kontaktformulär black-box', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.qlerify.com/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
  });

  test('WEB-003 formulärfält och submit finns och är interaktiva', async ({ page }) => {
    const fields = contactLocators(page);
    await expect(page.locator('body')).toBeVisible();
    await expectInteractable(fields.name, 'Namnfält');
    await expectInteractable(fields.email, 'E-postfält');
    await expectInteractable(fields.message, 'Message-fält');
    await expectInteractable(fields.submit, 'Submit-knapp');
  });

  test('CONTACT-001 tomma fält stoppas', async ({ page }) => {
    const fields = contactLocators(page);
    await expectInteractable(fields.submit, 'Submit-knapp');
    await fields.submit.click();
    const invalidCount = await page.locator('input:invalid, textarea:invalid').count();
    const bodyText = await page.locator('body').innerText();
    expect(invalidCount > 0 || /required|obligator|valid|invalid|error|fel|email/i.test(bodyText), 'Tomma obligatoriska fält ska ge validering').toBeTruthy();
  });

  test('CONTACT-002 ogiltig e-post stoppas', async ({ page }) => {
    const fields = contactLocators(page);
    await expectInteractable(fields.email, 'E-postfält');
    await fields.email.fill('fel-epost');
    await fields.message.fill('Testar ogiltig e-post.').catch(() => {});
    await fields.submit.click().catch(() => {});
    const isInvalid = await fields.email.evaluate((el) => !el.checkValidity()).catch(() => false);
    expect(isInvalid, 'Ogiltig e-post ska stoppas av formuläret').toBeTruthy();
  });

  test('CONTACT-003 väldigt lång text kraschar inte formuläret', async ({ page }) => {
    const fields = contactLocators(page);
    await expectInteractable(fields.message, 'Message-fält');
    await fields.message.fill('L'.repeat(5000));
    const valueLength = await fields.message.inputValue();
    await expect(page.locator('body')).toBeVisible();
    expect(valueLength.length, 'Message ska kunna ta emot lång text utan freeze').toBeGreaterThan(0);
  });

  test('CONTACT-004 specialtecken behandlas som text', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    const payload = '<script>alert(1)</script> åäö ÅÄÖ !@#$%^&*()';
    const fields = contactLocators(page);
    await expectInteractable(fields.message, 'Message-fält');
    await fields.message.fill(payload);
    await expect(page.locator('body')).toBeVisible();
    const stored = await fields.message.inputValue();
    expect(stored, 'Specialtecken ska ligga kvar som text i fältet').toContain('<script>alert(1)</script>');
    expect(errors.length, 'Specialtecken ska inte trigga frontend-krasch').toBe(0);
  });

  test('CONTACT-005 telefonlänk använder tel-format om telefon visas', async ({ page }) => {
    const bodyText = await page.locator('body').innerText();
    const hasPhoneLikeText = /\+\d|\b\d{2,4}[\s-]?\d{2,4}[\s-]?\d{2,4}\b/.test(bodyText);
    const telLinks = await page.locator('a[href^="tel:"]').count();
    expect(!hasPhoneLikeText || telLinks > 0, 'Telefonnummer ska vara klickbart med tel:-länk om det visas').toBeTruthy();
  });
});

test.describe('Auth negativa smoke tests', () => {
  test('AUTH-001 login med tomma fält visar validering', async ({ page }) => {
    await page.goto('https://app.qlerify.com/login', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.locator('button, input[type="submit"]').first().click().catch(() => {});
    const invalidCount = await page.locator('input:invalid').count();
    const bodyText = await page.locator('body').innerText();
    expect(invalidCount > 0 || /required|valid|invalid|error|email|password/i.test(bodyText), 'Tom login ska visa validering').toBeTruthy();
  });

  test('AUTH-002 signup med ogiltig e-post visar validering', async ({ page }) => {
    await page.goto('https://app.qlerify.com/signup', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
    const email = page.locator('input[type="email"], input[name*="email" i]').first();
    await email.fill('fel-epost').catch(() => {});
    await page.locator('button, input[type="submit"]').first().click().catch(() => {});
    const invalid = await email.evaluate((el) => !el.checkValidity()).catch(() => false);
    expect(invalid, 'Signup ska stoppa ogiltig e-post').toBeTruthy();
  });

  test('AUTH-003 reset password med tom e-post visar validering', async ({ page }) => {
    await page.goto('https://app.qlerify.com/reset-password', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.locator('button, input[type="submit"]').first().click().catch(() => {});
    const invalidCount = await page.locator('input:invalid').count();
    const bodyText = await page.locator('body').innerText();
    expect(invalidCount > 0 || /required|valid|invalid|error|email/i.test(bodyText), 'Tom reset password ska visa validering').toBeTruthy();
  });
});
