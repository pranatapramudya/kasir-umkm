# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\rental-travel-properti-qa.spec.ts >> Rental/Travel/Properti - Public Booking Form Tests >> Vehicle rental page loads without error
- Location: tests\rental-travel-properti-qa.spec.ts:224:7

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
  129 |   test('Filter tabs work', async ({ page }) => {
  130 |     const filters = ['Semua', 'Menunggu', 'Sedang Disewa', 'Berjalan', 'Selesai'];
  131 |     for (const filter of filters) {
  132 |       const btn = page.locator(`button:has-text("${filter}")`).first();
  133 |       if (await btn.count() > 0) {
  134 |         await btn.click();
  135 |         await page.waitForTimeout(300);
  136 |       }
  137 |     }
  138 |   });
  139 | 
  140 |   test('Can create rental product (property)', async ({ page }) => {
  141 |     await page.goto(`${BASE_URL}/admin/products`);
  142 |     await page.waitForLoadState('networkidle');
  143 |     
  144 |     const addBtn = page.locator('button:has-text("Tambah Produk"), button:has-text("Tambah")').first();
  145 |     if (await addBtn.count() > 0) {
  146 |       await addBtn.click();
  147 |       await page.waitForLoadState('networkidle');
  148 |       
  149 |       await page.fill('input[name="name"], input[id="name"]', 'Test Villa Rental');
  150 |       await page.fill('input[name="hargaJual"], input[id="hargaJual"]', '500000');
  151 |       
  152 |       const categorySelect = page.locator('select[name="category"], select[id="category"]').first();
  153 |       if (await categorySelect.count() > 0) {
  154 |         await categorySelect.selectOption({ label: 'Rental' });
  155 |       }
  156 |       
  157 |       await page.click('button:has-text("Simpan"), button[type="submit"]');
  158 |       await expect(page.locator('text=Test Villa Rental')).toBeVisible({ timeout: 5000 });
  159 |     }
  160 |   });
  161 | 
  162 |   test('Can create rental product (vehicle)', async ({ page }) => {
  163 |     await page.goto(`${BASE_URL}/admin/products`);
  164 |     await page.waitForLoadState('networkidle');
  165 |     
  166 |     const addBtn = page.locator('button:has-text("Tambah Produk"), button:has-text("Tambah")').first();
  167 |     if (await addBtn.count() > 0) {
  168 |       await addBtn.click();
  169 |       await page.waitForLoadState('networkidle');
  170 |       
  171 |       await page.fill('input[name="name"], input[id="name"]', 'Test Avanza Rental');
  172 |       await page.fill('input[name="hargaJual"], input[id="hargaJual"]', '300000');
  173 |       
  174 |       const categorySelect = page.locator('select[name="category"], select[id="category"]').first();
  175 |       if (await categorySelect.count() > 0) {
  176 |         await categorySelect.selectOption({ label: 'Rental' });
  177 |       }
  178 |       
  179 |       await page.click('button:has-text("Simpan"), button[type="submit"]');
  180 |       await expect(page.locator('text=Test Avanza Rental')).toBeVisible({ timeout: 5000 });
  181 |     }
  182 |   });
  183 | 
  184 |   test('Owner can set slug in settings for rental', async ({ page }) => {
  185 |     await page.goto(`${BASE_URL}/admin/settings`);
  186 |     await page.waitForLoadState('networkidle');
  187 |     
  188 |     const slugInput = page.locator('input[name="slug"], input[id="slug"]').first();
  189 |     if (await slugInput.count() > 0) {
  190 |       await slugInput.fill(TEST_SLUG);
  191 |       await page.click('button:has-text("Simpan"), button[type="submit"]');
  192 |       await expect(page.locator('text=Berhasil, text=Disimpan, text=Sukses')).toBeVisible({ timeout: 5000 });
  193 |     }
  194 |   });
  195 | });
  196 | 
  197 | test.describe('Rental/Travel/Properti - Public Booking Form Tests', () => {
  198 |   
  199 |   test('Rental booking page loads without error', async ({ page }) => {
  200 |     await page.goto(`${BASE_URL}/book/${TEST_SLUG}`);
  201 |     await page.waitForLoadState('domcontentloaded');
  202 |     
  203 |     // Page should load (either form or error message)
  204 |     const title = await page.title();
  205 |     expect(title.length).toBeGreaterThan(0);
  206 |   });
  207 | 
  208 |   test('Hourly transit page loads without error', async ({ page }) => {
  209 |     await page.goto(`${BASE_URL}/book/${TEST_SLUG}`);
  210 |     await page.waitForLoadState('domcontentloaded');
  211 |     
  212 |     const title = await page.title();
  213 |     expect(title.length).toBeGreaterThan(0);
  214 |   });
  215 | 
  216 |   test('Daily rental page loads without error', async ({ page }) => {
  217 |     await page.goto(`${BASE_URL}/book/${TEST_SLUG}`);
  218 |     await page.waitForLoadState('domcontentloaded');
  219 |     
  220 |     const title = await page.title();
  221 |     expect(title.length).toBeGreaterThan(0);
  222 |   });
  223 | 
  224 |   test('Vehicle rental page loads without error', async ({ page }) => {
  225 |     await page.goto(`${BASE_URL}/book/${TEST_SLUG}`);
  226 |     await page.waitForLoadState('domcontentloaded');
  227 |     
  228 |     const title = await page.title();
> 229 |     expect(title.length).toBeGreaterThan(0);
      |                          ^ Error: expect(received).toBeGreaterThan(expected)
  230 |   });
  231 | });
  232 | 
  233 | test.describe('Rental/Travel/Properti - Responsive Design', () => {
  234 |   const viewports = [
  235 |     { name: 'Mobile', width: 375, height: 667 },
  236 |     { name: 'Tablet', width: 768, height: 1024 },
  237 |     { name: 'Desktop', width: 1280, height: 720 },
  238 |   ];
  239 | 
  240 |   for (const vp of viewports) {
  241 |     test(`Rental calendar responsive - ${vp.name}`, async ({ page }) => {
  242 |       await page.setViewportSize({ width: vp.width, height: vp.height });
  243 |       await page.goto(`${BASE_URL}/admin/rental-calendar`);
  244 |       await page.waitForLoadState('networkidle');
  245 |       
  246 |       // Check key elements visible - use proper Playwright locator syntax
  247 |       await expect(page.locator('h1').or(page.locator('text=Kalender Sewa')).first()).toBeVisible({ timeout: 5000 });
  248 |       
  249 |       // Calendar grid should be visible
  250 |       await expect(page.locator('text=Sen').or(page.locator('text=Sel')).or(page.locator('text=Rab')).first()).toBeVisible({ timeout: 5000 });
  251 |     });
  252 |   }
  253 | });
  254 | 
  255 | test.describe('Rental/Travel/Properti - Business Logic Tests', () => {
  256 |   
  257 |   test('Double booking prevention: same date range for same product', async ({ page }) => {
  258 |     const startDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  259 |     const endDate = new Date(Date.now() + 172800000).toISOString().split('T')[0];
  260 |     
  261 |     // First booking
  262 |     const response1 = await page.request.post(`${BASE_URL}/api/booking`, {
  263 |       data: {
  264 |         slug: TEST_SLUG,
  265 |         customerName: 'Customer 1',
  266 |         customerPhone: '08111111111',
  267 |         bookingDate: new Date(Date.now() + 86400000).toISOString(),
  268 |         startDate,
  269 |         endDate,
  270 |         productId: 1,
  271 |       },
  272 |     });
  273 |     
  274 |     // Second booking same range
  275 |     const response2 = await page.request.post(`${BASE_URL}/api/booking`, {
  276 |       data: {
  277 |         slug: TEST_SLUG,
  278 |         customerName: 'Customer 2',
  279 |         customerPhone: '08222222222',
  280 |         bookingDate: new Date(Date.now() + 86400000).toISOString(),
  281 |         startDate,
  282 |         endDate,
  283 |         productId: 1,
  284 |       },
  285 |     });
  286 |     
  287 |     if (response1.status() === 201) {
  288 |       expect(response2.status()).toBe(400);
  289 |       const body = await response2.json();
  290 |       expect(body.error).toContain('sudah disewa');
  291 |     }
  292 |   });
  293 | 
  294 |   test('Overlapping date ranges are rejected', async ({ page }) => {
  295 |     const startDate1 = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  296 |     const endDate1 = new Date(Date.now() + 259200000).toISOString().split('T')[0]; // 3 days
  297 |     const startDate2 = new Date(Date.now() + 172800000).toISOString().split('T')[0]; // overlaps
  298 |     const endDate2 = new Date(Date.now() + 345600000).toISOString().split('T')[0];
  299 |     
  300 |     const response1 = await page.request.post(`${BASE_URL}/api/booking`, {
  301 |       data: {
  302 |         slug: TEST_SLUG,
  303 |         customerName: 'Customer 1',
  304 |         customerPhone: '08111111111',
  305 |         bookingDate: new Date(Date.now() + 86400000).toISOString(),
  306 |         startDate: startDate1,
  307 |         endDate: endDate1,
  308 |         productId: 1,
  309 |       },
  310 |     });
  311 |     
  312 |     const response2 = await page.request.post(`${BASE_URL}/api/booking`, {
  313 |       data: {
  314 |         slug: TEST_SLUG,
  315 |         customerName: 'Customer 2',
  316 |         customerPhone: '08222222222',
  317 |         bookingDate: new Date(Date.now() + 172800000).toISOString(),
  318 |         startDate: startDate2,
  319 |         endDate: endDate2,
  320 |         productId: 1,
  321 |       },
  322 |     });
  323 |     
  324 |     if (response1.status() === 201) {
  325 |       expect(response2.status()).toBe(400);
  326 |     }
  327 |   });
  328 | });
```