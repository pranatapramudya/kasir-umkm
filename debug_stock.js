const XLSX = require('xlsx');
const workbook = XLSX.readFile('C:/Users/Pranata Pramudya/Downloads/template_import_retail (5).xlsx');
console.log('Sheet names:', workbook.SheetNames);
for (const sheetName of workbook.SheetNames) {
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  console.log('\n--- Sheet:', sheetName, '---');
  console.log('Headers:', Object.keys(rows[0] || {}));
  console.log('First row:', rows[0]);
}
