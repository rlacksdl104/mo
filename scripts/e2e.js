const { chromium } = require('playwright');

async function clickAgreement(page, id) {
  await page.click(`label[for="${id}"]`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const base = 'http://localhost:3000';

  try {
    const password = 'TestPass123!';

    // User signup
    const userEmail = `e2e_user_${Date.now()}@example.com`;
    console.log('Signing up user:', userEmail);
    await page.goto(`${base}/signup`, { waitUntil: 'networkidle' });
    await page.fill('input[name="name"]', 'E2E User');
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await clickAgreement(page, 'terms');
    await clickAgreement(page, 'privacy');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForTimeout(1200);
    console.log('User signup completed, on', page.url());

    // Logout by clearing localStorage
    await page.evaluate(() => localStorage.clear());

    // Login
    console.log('Logging in user:', userEmail);
    await page.goto(`${base}/login`, { waitUntil: 'networkidle' });
    await page.fill('#email', userEmail);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForTimeout(1200);
    console.log('User login completed, on', page.url());

    // Go to buyer mypage and verify state
    await page.goto(`${base}/mypage`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const noOrdersCount = await page.locator('text=참여중인 공구가 없습니다.').count();
    console.log('MyPage no orders message count:', noOrdersCount);

    // Admin signup (new account)
    const adminEmail = `e2e_admin_${Date.now()}@example.com`;
    console.log('Signing up admin:', adminEmail);
    await page.goto(`${base}/signup`, { waitUntil: 'networkidle' });
    await page.click('button:has-text("판매자")');
    await page.fill('input[name="name"]', 'E2E Admin');
    await page.fill('input[name="email"]', adminEmail);
    await page.fill('input[name="farmName"]', 'E2E Farm');
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.fill('input[name="adminKey"]', 'moa-admin');
    await clickAgreement(page, 'terms');
    await clickAgreement(page, 'privacy');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForTimeout(1200);
    console.log('Admin signup completed, on', page.url());
    const adminStorage = await page.evaluate(() => ({
      accessToken: localStorage.getItem('accessToken'),
      accessExp: localStorage.getItem('accessExp'),
      refreshToken: localStorage.getItem('refreshToken'),
      isLoggedIn: !!localStorage.getItem('accessToken') && Date.now() < new Date(localStorage.getItem('accessExp')).getTime(),
    }))
    console.log('Admin localStorage tokens and login check:', adminStorage);

    // Visit seller page and verify seller UI
    await page.goto(`${base}/mypage`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const adminStorageAfter = await page.evaluate(() => ({
      accessToken: localStorage.getItem('accessToken'),
      accessExp: localStorage.getItem('accessExp'),
      refreshToken: localStorage.getItem('refreshToken'),
    }))
    console.log('Admin localStorage tokens before seller check:', adminStorageAfter);
    const sellerTitleCount = await page.locator('text=내 상품 목록').count();
    const emptyProductsCount = await page.locator('text=등록된 상품이 없습니다').count();
    console.log('Seller page title found count:', sellerTitleCount);
    console.log('Seller empty products message count:', emptyProductsCount);
    console.log('Seller page final URL:', page.url());

    if (sellerTitleCount === 0 && emptyProductsCount === 0) {
      throw new Error('Seller page did not display expected seller UI elements');
    }

    console.log('E2E script completed successfully');
  } catch (err) {
    console.error('E2E script error:', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
