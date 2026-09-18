export type PrintCategory = 'kitchen' | 'bar' | 'all';

export type PrintableItem = {
  name: string;
  qty: number;
  price: number;
  category?: string;
  note?: string;
};

// Deteksi apakah item masuk kategori Minuman / Bar
export function isBarItem(category?: string, name?: string): boolean {
  const barKeywords = ['minuman', 'drink', 'beverage', 'kopi', 'coffee', 'tea', 'teh', 'juice', 'jus', 'bar'];
  const cat = (category || '').toLowerCase();
  const itemName = (name || '').toLowerCase();
  return barKeywords.some(kw => cat.includes(kw) || itemName.includes(kw));
}

// Pisahkan item berdasarkan tujuan cetak
export function routeOrderItems(items: PrintableItem[]) {
  const barItems: PrintableItem[] = [];
  const kitchenItems: PrintableItem[] = [];

  items.forEach(item => {
    if (isBarItem(item.category, item.name)) {
      barItems.push(item);
    } else {
      kitchenItems.push(item);
    }
  });

  return {
    barItems,
    kitchenItems,
    hasBar: barItems.length > 0,
    hasKitchen: kitchenItems.length > 0,
  };
}