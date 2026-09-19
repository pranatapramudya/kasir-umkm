# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\rental-travel-properti-qa.spec.ts >> Rental/Travel/Properti - Public API Tests (No Auth Required) >> Public booking page loads for rental slug
- Location: tests\rental-travel-properti-qa.spec.ts:10:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]: Internal Server Error
```

# Test source

```ts
  1   | import { test, expect, request } from '@playwright/test';
  2   | 
  3   | const BASE_URL = 'http://localhost:3000';
  4   | const TEST_SLUG = `qa-rental-${Date.now()}`;
  5   | 
  6   | test.describe.configure({ retries: 1 });
  7   | 
  8   | test.describe('Rental/Travel/Properti - Public API Tests (No Auth Required)', () => {
  9   |   
  10  |   test('Public booking page loads for rental slug', async ({ page }) => {
  11  |     await page.goto(`${BASE_URL}/book/${TEST_SLUG}`);
  12  |     await page.waitForLoadState('domcontentloaded');
  13  |     
  14  |     const title = await page.title();
> 15  |     expect(title.length).toBeGreaterThan(0);
      |                          ^ Error: expect(received).toBeGreaterThan(expected)
  16  |     console.log('Rental booking page title:', title);
  17  |   });
  18  | 
  19  |   test('Booking API rejects invalid slug for rental', async ({ page }) => {
  20  |     const response = await page.request.post(`${BASE_URL}/api/booking`, {
  21  |       data: {
  22  |         slug: 'non-existent-rental-slug-12345',
  23  |         customerName: 'Test User',
  24  |         customerPhone: '08123456789',
  25  |         bookingDate: new Date(Date.now() + 86400000).toISOString(),
  26  |         startDate: new Date(Date.now() + 86400000).toISOString(),
  27  |         endDate: new Date(Date.now() + 172800000).toISOString(),
  28  |       },
  29  |     });
  30  |     
  31  |     expect(response.status()).toBe(404);
  32  |     const body = await response.json();
  33  |     expect(body.error).toContain('tidak ditemukan');
  34  |   });
  35  | 
  36  |   test('Booking API validates required fields for rental', async ({ page }) => {
  37  |     const response = await page.request.post(`${BASE_URL}/api/booking`, {
  38  |       data: {
  39  |         slug: TEST_SLUG,
  40  |         customerName: '',
  41  |         customerPhone: '',
  42  |         bookingDate: '',
  43  |         startDate: '',
  44  |         endDate: '',
  45  |       },
  46  |     });
  47  |     
  48  |     expect(response.status()).toBe(400);
  49  |     const body = await response.json();
  50  |     expect(body.error).toContain('tidak lengkap');
  51  |   });
  52  | 
  53  |   test('Availability API returns booked ranges', async ({ page }) => {
  54  |     const response = await page.request.get(`${BASE_URL}/api/booking/availability?slug=${TEST_SLUG}`);
  55  |     expect([200, 404]).toContain(response.status());
  56  |     
  57  |     if (response.status() === 200) {
  58  |       const body = await response.json();
  59  |       expect(body).toHaveProperty('bookedRanges');
  60  |       expect(Array.isArray(body.bookedRanges)).toBeTruthy();
  61  |     }
  62  |   });
  63  | 
  64  |   test('Check rental API returns booked ranges for product', async ({ page }) => {
  65  |     const response = await page.request.get(`${BASE_URL}/api/booking/check-rental?slug=${TEST_SLUG}&productId=1`);
  66  |     expect([200, 404]).toContain(response.status());
  67  |   });
  68  | 
  69  |   test('Dashboard rental calendar page requires auth', async ({ page }) => {
  70  |     await page.goto(`${BASE_URL}/admin/rental-calendar`);
  71  |     await page.waitForLoadState('networkidle');
  72  |     await expect(page).toHaveURL(/.*sign-in/);
  73  |   });
  74  | });
  75  | 
  76  | test.describe('Rental/Travel/Properti - API Contract Tests', () => {
  77  |   
  78  |   test('GET /api/booking/calendar returns proper structure', async ({ request }) => {
  79  |     const response = await request.get(`${BASE_URL}/api/booking/calendar`);
  80  |     expect([401, 200]).toContain(response.status());
  81  |     
  82  |     if (response.status() === 200) {
  83  |       const body = await response.json();
  84  |       expect(body).toHaveProperty('bookings');
  85  |       expect(Array.isArray(body.bookings)).toBeTruthy();
  86  |     }
  87  |   });
  88  | 
  89  |   test('GET /api/booking/availability returns bookedRanges array', async ({ request }) => {
  90  |     const response = await request.get(`${BASE_URL}/api/booking/availability?slug=test`);
  91  |     expect([200, 400, 404]).toContain(response.status());
  92  |     
  93  |     if (response.status() === 200) {
  94  |       const body = await response.json();
  95  |       expect(body).toHaveProperty('bookedRanges');
  96  |       expect(Array.isArray(body.bookedRanges)).toBeTruthy();
  97  |     }
  98  |   });
  99  | });
  100 | 
  101 | test.describe('Rental/Travel/Properti - Authenticated Flow (requires auth setup)', () => {
  102 |   
  103 |   test.use({ storageState: 'tests/auth/owner.json' });
  104 | 
  105 |   test.beforeEach(async ({ page }) => {
  106 |     try {
  107 |       await page.goto(`${BASE_URL}/admin/rental-calendar`);
  108 |       await page.waitForLoadState('networkidle', { timeout: 10000 });
  109 |     } catch {
  110 |       test.skip(true, 'Auth state not configured - run "npx playwright codegen --save-storage=tests/auth/owner.json http://localhost:3000/sign-in" to create');
  111 |     }
  112 |   });
  113 | 
  114 |   test('Owner can access rental calendar dashboard', async ({ page }) => {
  115 |     await expect(page.locator('h1, text=Kalender Sewa')).toBeVisible({ timeout: 5000 });
```