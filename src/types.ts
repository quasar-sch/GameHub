export interface Game {
  id: string;
  title: string;
  description: string;
  category: string; // Category.id matching
  link: string; // Game link (e.g. https://example.com)
  iconType: 'emoji' | 'image';
  iconValue: string; // Emoji character or Hotlink image URL
}

export interface Category {
  id: string;
  name: string;
  colorClass: string; // CSS bg-color / text-color class combination
}
