# 📥 Hướng dẫn Download và Upload nhanh

## Bước 1: Download tất cả files
1. Từ dashboard này, nhấp nút **"Download"** hoặc **"Export"** (nếu có)
2. Hoặc copy từng file content và lưu vào máy tính:
   - Tạo thư mục `sparkrush-dashboard` trên máy
   - Tạo các file và thư mục theo cấu trúc đã mô tả
   - Copy nội dung từng file từ dashboard này

## Bước 2: Upload hàng loạt lên GitHub
1. Vào repository GitHub đã tạo
2. Nhấp **"Add file" > "Upload files"**
3. **Kéo thả toàn bộ thư mục** `sparkrush-dashboard` vào khung upload
4. GitHub sẽ tự động tạo cấu trúc thư mục
5. Nhấp **"Commit changes"**

## Bước 3: Kiểm tra cấu trúc
Đảm bảo repository có cấu trúc:
```
/ (root)
├── dashboard.html
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── dashboard.js
    ├── wallet.js
    └── [các file js khác...]
```

## Lưu ý quan trọng:
- File `dashboard.html` phải ở root directory (thư mục gốc)
- Đảm bảo tất cả đường dẫn CSS/JS trong HTML đúng
- Kiểm tra không có lỗi typo trong tên file