# Giờ Tan

Nhập giờ vào làm → biết giờ tan + đồng hồ đếm ngược. React + Vite, phong cách neo-brutalism trắng/đen.

## Quy tắc tính

- Làm đủ **8 tiếng thực**, không tính nghỉ trưa 12:30–13:45.
- Vào trước 08:30 → tính từ 08:30 (tan sớm nhất 17:45).
- Vào sau 09:30 → đi trễ, vẫn bù đủ 8 tiếng.

Logic nằm ở `src/lib/workTime.js`.

## Chạy

```bash
npm install
npm run dev     # phát triển
npm run build   # build ra dist/
```

Icon được tải từ Iconify API nên cần có mạng.
