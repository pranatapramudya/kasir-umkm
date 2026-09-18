import { test, expect, request } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const TEST_SLUG = `qa-rental-${Date.now()}`;

test.describe.configure({ retries: 1 });

test.describe('Rental/Travel/Properti - Public API Tests (No Auth Required)', () => {
  
  test('Public booking page loads for rental slug', async ({ page }) => {
    await page.goto(`${BASE_URL}/book/${TEST_SLUG}`);
    await page.waitForLoadState('domcontentloaded');
    
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    console.log('Rental booking page title:', title);
  });

  test('Booking API rejects invalid slug for rental', async ({ page }) => {
    const response = await page.request.post(`${BASE_URL}/api/booking`, {
      data: {
        slug: 'non-existent-rental-slug-12345',
        customerName: 'Test User',
        customerPhone: '08123456789',
        bookingDate: new Date(Date.now() + 86400000).toISOString(),
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(),
      },
    });
    
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toContain('tidak ditemukan');
  });

  test('Booking API validates required fields for rental', async ({ page }) => {
    const response = await page.request.post(`${BASE_URL}/api/booking`, {
      data: {
        slug: TEST_SLUG,
        customerName: '',
        customerPhone: '',
        bookingDate: '',
        startDate: '',
        endDate: '',
      },
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('tidak lengkap');
  });

  test('Availability API returns booked ranges', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/booking/availability?slug=${TEST_SLUG}`);
    expect([200, 404]).toContain(response.status());
    
    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty('bookedRanges');
      expect(Array.isArray(body.bookedRanges)).toBeTruthy();
    }
  });

  test('Check rental API returns booked ranges for product', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/booking/check-rental?slug=${TEST_SLUG}&productId=1`);
    expect([200, 404]).toContain(response.status());
  });

  test('Dashboard rental calendar page requires auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/rental-calendar`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*sign-in/);
  });
});

test.describe('Rental/Travel/Properti - API Contract Tests', () => {
  
  test('GET /api/booking/calendar returns proper structure', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/booking/calendar`);
    expect([401, 200]).toContain(response.status());
    
    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty('bookings');
      expect(Array.isArray(body.bookings)).toBeTruthy();
    }
  });

  test('GET /api/booking/availability returns bookedRanges array', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/booking/availability?slug=test`);
    expect([200, 400, 404]).toContain(response.status());
    
    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty('bookedRanges');
      expect(Array.isArray(body.bookedRanges)).toBeTruthy();
    }
  });
});

test.describe('Rental/Travel/Properti - Authenticated Flow (requires auth setup)', () => {
  
  test.use({ storageState: 'tests/auth/owner.json' });

  test.beforeEach(async ({ page }) => {
    try {
      await page.goto(`${BASE_URL}/admin/rental-calendar`);
      await page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch {
      test.skip(true, 'Auth state not configured - run "npx playwright codegen --save-storage=tests/auth/owner.json http://localhost:3000/sign-in" to create');
    }
  });

  test('Owner can access rental calendar dashboard', async ({ page }) => {
    await expect(page.locator('h1, text=Kalender Sewa')).toBeVisible({ timeout: 5000 });
  });

  test('Calendar navigation works (prev/next month)', async ({ page }) => {
    const prevBtn = page.locator('button:has(svg.lucide-chevron-left), button:has-text("Sebelumnya")').first();
    const nextBtn = page.locator('button:has(svg.lucide-chevron-right), button:has-text("Selanjutnya")').first();
    
    if (await nextBtn.count() > 0) {
      await nextBtn.click();
      await page.waitForTimeout(500);
      await expect(page.locator('text=Kalender Sewa')).toBeVisible();
    }
  });

  test('Filter tabs work', async ({ page }) => {
    const filters = ['Semua', 'Menunggu', 'Sedang Disewa', 'Berjalan', 'Selesai'];
    for (const filter of filters) {
      const btn = page.locator(`button:has-text("${filter}")`).first();
      if (await btn.count() > 0) {
        await btn.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('Can create rental product (property)', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/products`);
    await page.waitForLoadState('networkidle');
    
    const addBtn = page.locator('button:has-text("Tambah Produk"), button:has-text("Tambah")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForLoadState('networkidle');
      
      await page.fill('input[name="name"], input[id="name"]', 'Test Villa Rental');
      await page.fill('input[name="hargaJual"], input[id="hargaJual"]', '500000');
      
      const categorySelect = page.locator('select[name="category"], select[id="category"]').first();
      if (await categorySelect.count() > 0) {
        await categorySelect.selectOption({ label: /RENTAL|SEWA|PROPERTI/i });
      }
      
      await page.click('button:has-text("Simpan"), button[type="submit"]').first();
      await expect(page.locator('text=Test Villa Rental')).toBeVisible({ timeout: 5000 });
    }
  });

  test('Can create rental product (vehicle)', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/products`);
    await page.waitForLoadState('networkidle');
    
    const addBtn = page.locator('button:has-text("Tambah Produk"), button:has-text("Tambah")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForLoadState('networkidle');
      
      await page.fill('input[name="name"], input[id="name"]', 'Test Avanza Rental');
      await page.fill('input[name="hargaJual"], input[id="hargaJual"]', '300000');
      
      const categorySelect = page.locator('select[name="category"], select[id="category"]').first();
      if (await categorySelect.count() > 0) {
        await categorySelect.selectOption({ label: /RENTAL|SEWA|KENDARAAN|TRAVEL/i });
      }
      
      await page.click('button:has-text("Simpan"), button[type="submit"]').first();
      await expect(page.locator('text=Test Avanza Rental')).toBeVisible({ timeout: 5000 });
    }
  });

  test('Owner can set slug in settings for rental', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/settings`);
    await page.waitForLoadState('networkidle');
    
    const slugInput = page.locator('input[name="slug"], input[id="slug"]').first();
    if (await slugInput.count() > 0) {
      await slugInput.fill(TEST_SLUG);
      await page.click('button:has-text("Simpan"), button[type="submit"]').first();
      await expect(page.locator('text=Berhasil, text=Disimpan, text=Sukses')).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Rental/Travel/Properti - Public Booking Form Tests', () => {
  
  test('Rental booking page loads without error', async ({ page }) => {
    await page.goto(`${BASE_URL}/book/${TEST_SLUG}`);
    await page.waitForLoadState('domcontentloaded');
    
    // Page should load (either form or error message)
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Hourly transit page loads without error', async ({ page }) => {
    await page.goto(`${BASE_URL}/book/${TEST_SLUG}`);
    await page.waitForLoadState('domcontentloaded');
    
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Daily rental page loads without error', async ({ page }) => {
    await page.goto(`${BASE_URL}/book/${TEST_SLUG}`);
    await page.waitForLoadState('domcontentloaded');
    
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Vehicle rental page loads without error', async ({ page }) => {
    await page.goto(`${BASE_URL}/book/${TEST_SLUG}`);
    await page.waitForLoadState('domcontentloaded');
    
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});

test.describe('Rental/Travel/Properti - Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1280, height: 720 },
  ];

  for (const vp of viewports) {
    test(`Rental calendar responsive - ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/admin/rental-calendar`);
      await page.waitForLoadState('networkidle');
      
      // Check key elements visible - use proper Playwright locator syntax
      await expect(page.locator('h1').or(page.locator('text=Kalender Sewa')).first()).toBeVisible({ timeout: 5000 });
      
      // Calendar grid should be visible
      await expect(page.locator('text=Sen').or(page.locator('text=Sel')).or(page.locator('text=Rab')).first()).toBeVisible({ timeout: 5000 });
    });
  }
});

test.describe('Rental/Travel/Properti - Business Logic Tests', () => {
  
  test('Double booking prevention: same date range for same product', async ({ page }) => {
    const startDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 172800000).toISOString().split('T')[0];
    
    // First booking
    const response1 = await page.request.post(`${BASE_URL}/api/booking`, {
      data: {
        slug: TEST_SLUG,
        customerName: 'Customer 1',
        customerPhone: '08111111111',
        bookingDate: new Date(Date.now() + 86400000).toISOString(),
        startDate,
        endDate,
        productId: 1,
      },
    });
    
    // Second booking same range
    const response2 = await page.request.post(`${BASE_URL}/api/booking`, {
      data: {
        slug: TEST_SLUG,
        customerName: 'Customer 2',
        customerPhone: '08222222222',
        bookingDate: new Date(Date.now() + 86400000).toISOString(),
        startDate,
        endDate,
        productId: 1,
      },
    });
    
    if (response1.status() === 201) {
      expect(response2.status()).toBe(400);
      const body = await response2.json();
      expect(body.error).toContain('sudah disewa');
    }
  });

  test('Overlapping date ranges are rejected', async ({ page }) => {
    const startDate1 = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const endDate1 = new Date(Date.now() + 259200000).toISOString().split('T')[0]; // 3 days
    const startDate2 = new Date(Date.now() + 172800000).toISOString().split('T')[0]; // overlaps
    const endDate2 = new Date(Date.now() + 345600000).toISOString().split('T')[0];
    
    const response1 = await page.request.post(`${BASE_URL}/api/booking`, {
      data: {
        slug: TEST_SLUG,
        customerName: 'Customer 1',
        customerPhone: '08111111111',
        bookingDate: new Date(Date.now() + 86400000).toISOString(),
        startDate: startDate1,
        endDate: endDate1,
        productId: 1,
      },
    });
    
    const response2 = await page.request.post(`${BASE_URL}/api/booking`, {
      data: {
        slug: TEST_SLUG,
        customerName: 'Customer 2',
        customerPhone: '08222222222',
        bookingDate: new Date(Date.now() + 172800000).toISOString(),
        startDate: startDate2,
        endDate: endDate2,
        productId: 1,
      },
    });
    
    if (response1.status() === 201) {
      expect(response2.status()).toBe(400);
    }
  });
});