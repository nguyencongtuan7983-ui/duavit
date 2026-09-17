import { Student, DuckAccessory } from '../types';

export const DUCK_COLORS = [
  '#FACC15', // Yellow (classic duck)
  '#FB923C', // Orange
  '#F472B6', // Pink
  '#38BDF8', // Sky Blue
  '#4ADE80', // Mint Green
  '#A78BFA', // Purple
  '#F87171', // Coral Red
  '#2DD4BF', // Teal
  '#FBBF24', // Amber Gold
  '#E879F9', // Orchid
  '#34D399', // Emerald
  '#60A5FA', // Dodger Blue
];

export const DUCK_ACCESSORIES: DuckAccessory[] = ['crown', 'sunglasses', 'cap', 'flower', 'bow', 'none'];

export const TARGET_CLASSES = ['10A2', '10A4', '10A5', '11A4', '11A5', '11A6', '11A7'] as const;

export const DEFAULT_CLASS_ROSTERS: Record<string, string[]> = {
  '10A2': [
    'Nguyễn Văn An',
    'Trần Thị Bích',
    'Lê Hoàng Long',
    'Phạm Minh Khôi',
    'Vũ Mai Phương',
    'Đặng Tuấn Kiệt',
    'Bùi Hải Đăng',
    'Hoàng Thùy Linh',
    'Đỗ Gia Huy',
    'Ngô Bảo Châu',
    'Dương Trọng Tấn',
    'Phan Khánh Vy',
    'Lý Quốc Hưng',
    'Trịnh Phương Anh',
    'Võ Minh Quân',
  ],
  '10A4': [
    'Bùi Đức Anh',
    'Chu Ngọc Diệp',
    'Đoàn Gia Bảo',
    'Hà Minh Trang',
    'Lâm Tuấn Hưng',
    'Mai Phương Thảo',
    'Nguyễn Quốc Bảo',
    'Phan Thanh Hằng',
    'Tạ Quang Khải',
    'Vũ Yến Nhi',
    'Lê Trọng Phúc',
    'Trần Hải Yến',
  ],
  '10A5': [
    'Cao Tiến Đạt',
    'Đào Thu Uyên',
    'Dương Đình Trí',
    'Hoàng Nhật Minh',
    'Lưu Bảo Ngọc',
    'Nguyễn Hữu Thắng',
    'Phạm Thùy Chi',
    'Trần Tuấn Dũng',
    'Võ Thảo Linh',
    'Đỗ Quốc Trung',
    'Lê Thu Trang',
    'Bùi Minh Hiếu',
  ],
  '11A4': [
    'Nguyễn Đăng Quang',
    'Trần Mỹ Duyên',
    'Lê Thành Nam',
    'Phạm Ngọc Trâm',
    'Vũ Hữu Phước',
    'Đặng Kim Ngân',
    'Bùi Hoàng Nam',
    'Hoàng Thanh Trúc',
    'Đinh Tiến Dũng',
    'Nguyễn Mai Anh',
    'Trịnh Đức Thắng',
    'Lâm Ánh Tuyết',
  ],
  '11A5': [
    'Tạ Hữu Kiên',
    'Võ Quỳnh Nga',
    'Phan Đình Diệu',
    'Nguyễn Diệu Linh',
    'Trần Việt Hoàng',
    'Đỗ Thu Hà',
    'Lê Văn Phát',
    'Phạm Minh Thư',
    'Bùi Tuấn Phong',
    'Hồ Ngọc Hà',
    'Dương Văn Khoa',
    'Vũ Trà My',
  ],
  '11A6': [
    'Trần Quang Huy',
    'Nguyễn Thu Ngân',
    'Lê Đình Trọng',
    'Phạm Hồng Hạnh',
    'Võ Đăng Khoa',
    'Đặng Thúy Nga',
    'Bùi Anh Tuấn',
    'Hoàng Như Quỳnh',
    'Đỗ Mạnh Cường',
    'Ngô Bích Thảo',
    'Mai Trọng Hiệp',
    'Chu Kim Liên',
  ],
  '11A7': [
    'Nguyễn Thành Long',
    'Trần Cẩm Tú',
    'Lê Nhật Ánh',
    'Phạm Đức Toàn',
    'Vũ Diễm My',
    'Đặng Thế Anh',
    'Bùi Thục Quyên',
    'Hoàng Văn Phúc',
    'Đinh Ngọc Ánh',
    'Nguyễn Huy Hoàng',
    'Trương Mỹ Linh',
    'Lý Bá Thông',
  ],
};

export const SAMPLE_STUDENTS: Student[] = [
  { id: '1', name: 'Nguyễn Văn An', color: '#FACC15', accessory: 'crown', isActive: true, isEliminated: false, winsCount: 0 },
  { id: '2', name: 'Trần Thị Bích', color: '#F472B6', accessory: 'bow', isActive: true, isEliminated: false, winsCount: 0 },
  { id: '3', name: 'Lê Hoàng Long', color: '#38BDF8', accessory: 'sunglasses', isActive: true, isEliminated: false, winsCount: 0 },
  { id: '4', name: 'Phạm Minh Khôi', color: '#4ADE80', accessory: 'cap', isActive: true, isEliminated: false, winsCount: 0 },
  { id: '5', name: 'Vũ Mai Phương', color: '#FB923C', accessory: 'flower', isActive: true, isEliminated: false, winsCount: 0 },
  { id: '6', name: 'Đặng Tuấn Kiệt', color: '#A78BFA', accessory: 'sunglasses', isActive: true, isEliminated: false, winsCount: 0 },
  { id: '7', name: 'Bùi Hải Đăng', color: '#2DD4BF', accessory: 'cap', isActive: true, isEliminated: false, winsCount: 0 },
  { id: '8', name: 'Hoàng Thùy Linh', color: '#F87171', accessory: 'crown', isActive: true, isEliminated: false, winsCount: 0 },
  { id: '9', name: 'Đỗ Gia Huy', color: '#FBBF24', accessory: 'bow', isActive: true, isEliminated: false, winsCount: 0 },
  { id: '10', name: 'Ngô Bảo Châu', color: '#E879F9', accessory: 'sunglasses', isActive: true, isEliminated: false, winsCount: 0 },
  { id: '11', name: 'Dương Trọng Tấn', color: '#34D399', accessory: 'none', isActive: true, isEliminated: false, winsCount: 0 },
  { id: '12', name: 'Phan Khánh Vy', color: '#60A5FA', accessory: 'flower', isActive: true, isEliminated: false, winsCount: 0 },
];

export const PRESET_CLASSES: { name: string; students: string[] }[] = [
  {
    name: 'Lớp 12A1 (15 học sinh)',
    students: [
      'Nguyễn Văn An',
      'Trần Thị Bích',
      'Lê Hoàng Long',
      'Phạm Minh Khôi',
      'Vũ Mai Phương',
      'Đặng Tuấn Kiệt',
      'Bùi Hải Đăng',
      'Hoàng Thùy Linh',
      'Đỗ Gia Huy',
      'Ngô Bảo Châu',
      'Dương Trọng Tấn',
      'Phan Khánh Vy',
      'Lý Quốc Hưng',
      'Trịnh Phương Anh',
      'Võ Minh Quân',
    ],
  },
  {
    name: 'Tổ 1 (8 học sinh)',
    students: [
      'Nguyễn Văn An',
      'Trần Thị Bích',
      'Lê Hoàng Long',
      'Phạm Minh Khôi',
      'Vũ Mai Phương',
      'Đặng Tuấn Kiệt',
      'Bùi Hải Đăng',
      'Hoàng Thùy Linh',
    ],
  },
  {
    name: 'Lớp Tiểu học / Mầm non (10 bé)',
    students: [
      'Bé Bo',
      'Bé Bắp',
      'Bé Sóc',
      'Bé Thỏ',
      'Bé Tít',
      'Bé Nhím',
      'Bé Kem',
      'Bé Sữa',
      'Bé Miu',
      'Bé Bon',
    ],
  },
];
