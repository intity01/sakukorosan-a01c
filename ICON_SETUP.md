# 🎨 Setup App Icon - Sakudoko

## ขั้นตอนการตั้งค่า Icon สำหรับแอป

### 1. เตรียมไฟล์ Icon

คุณมีรูป Sakudoko แล้ว ให้:

1. **บันทึกรูปเป็น PNG**
   - ชื่อไฟล์: `sakudoko-icon.png`
   - ขนาดแนะนำ: 1024x1024 px หรือใหญ่กว่า
   - Background: โปร่งใส (transparent) หรือสีขาว
   - บันทึกใน: `public/sakudoko-icon.png`

### 2. แปลง PNG เป็น ICO (สำหรับ Windows)

#### วิธีที่ 1: ใช้ Online Tool (แนะนำ)

1. ไปที่: https://convertio.co/png-ico/
2. Upload ไฟล์ `public/sakudoko-icon.png`
3. เลือก output format: **ICO**
4. เลือกขนาด: **256x256** (หรือ Multi-size)
5. Download ไฟล์ `icon.ico`
6. บันทึกใน: `public/icon.ico`

#### วิธีที่ 2: ใช้ ImageMagick (Advanced)

```bash
# ติดตั้ง ImageMagick
# Windows: https://imagemagick.org/script/download.php

# แปลง PNG เป็น ICO
magick convert public/sakudoko-icon.png -define icon:auto-resize=256,128,64,48,32,16 public/icon.ico
```

### 3. อัพเดท Config

แก้ไข `package.json`:

```json
{
  "build": {
    "win": {
      "icon": "public/icon.ico"  // เปลี่ยนจาก sakukoro-mascot.png
    },
    "mac": {
      "icon": "public/icon.icns"  // สำหรับ macOS
    },
    "linux": {
      "icon": "public/icon.png"
    }
  }
}
```

แก้ไข `electron/main.js`:

```javascript
mainWindow = new BrowserWindow({
  // ...
  icon: path.join(__dirname, '../public/icon.ico')  // เปลี่ยนเป็น icon.ico
})
```

### 4. สร้าง Icons หลายขนาด (สำหรับ Microsoft Store)

ใช้สคริปต์ที่มีอยู่:

```bash
npm run generate-icons
```

หรือสร้างเองด้วย Online Tool:
- https://www.icoconverter.com/
- https://redketchup.io/icon-converter

ขนาดที่ต้องการ:
- 16x16
- 32x32
- 48x48
- 64x64
- 128x128
- 256x256
- 512x512
- 1024x1024

### 5. ทดสอบ

```bash
# Build แอป
npm run electron:build:win

# ตรวจสอบ icon ใน dist/
# - ไฟล์ .exe ควรมี icon
# - Shortcut ควรแสดง icon
# - Taskbar ควรแสดง icon
```

### 6. สำหรับ Microsoft Store

ใน `build-assets/` ต้องมี:
- `Square44x44Logo.png` (44x44)
- `Square150x150Logo.png` (150x150)
- `Square310x310Logo.png` (310x310)
- `Wide310x150Logo.png` (310x150)
- `StoreLogo.png` (50x50)

ใช้ Sakudoko icon สำหรับทุกขนาด

---

## 🎯 Quick Setup (ทำตามนี้)

### ขั้นตอนย่อ:

1. **บันทึกรูป Sakudoko**
   ```
   public/sakudoko-icon.png (1024x1024)
   ```

2. **แปลงเป็น ICO**
   - ไปที่: https://convertio.co/png-ico/
   - Upload → Convert → Download
   - บันทึกเป็น: `public/icon.ico`

3. **อัพเดท package.json**
   ```json
   "win": {
     "icon": "public/icon.ico"
   }
   ```

4. **อัพเดท electron/main.js**
   ```javascript
   icon: path.join(__dirname, '../public/icon.ico')
   ```

5. **Build**
   ```bash
   npm run electron:build:win
   ```

---

## 📝 Checklist

- [ ] บันทึก `sakudoko-icon.png` ใน `public/`
- [ ] แปลงเป็น `icon.ico`
- [ ] อัพเดท `package.json`
- [ ] อัพเดท `electron/main.js`
- [ ] สร้าง icons สำหรับ Store (`npm run generate-icons`)
- [ ] Build และทดสอบ
- [ ] ตรวจสอบ icon แสดงถูกต้อง

---

## 🎨 Tips

1. **ขนาด Icon ที่ดี**
   - Source: 1024x1024 px ขึ้นไป
   - Format: PNG with transparency
   - Style: Simple, clear, recognizable

2. **สี**
   - ใช้สีที่เด่นชัด
   - Contrast ดี (เห็นชัดทั้ง light/dark mode)
   - Sakudoko logo มีสีเทาและฟ้า - ดีมาก!

3. **Testing**
   - ทดสอบบน Windows 10 และ 11
   - ดูใน Taskbar, Start Menu, Desktop
   - ตรวจสอบขนาดต่างๆ

---

## 🚀 Ready to Deploy!

เมื่อ icon พร้อมแล้ว:
```bash
npm run prepare-store
```

ไฟล์ `.appx` จะมี icon ที่ถูกต้องแล้ว! 🎉
