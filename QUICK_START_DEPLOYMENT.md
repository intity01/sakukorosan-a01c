# 🚀 Quick Start: Deploy to Microsoft Store

เวอร์ชันย่อสำหรับคนที่รีบ - ทำตามขั้นตอนนี้เพื่อ deploy แอปไป Microsoft Store

---

## ⚡ ขั้นตอนด่วน (30 นาที)

### 1️⃣ สมัคร Microsoft Partner Center (5 นาที)
```
🔗 https://partner.microsoft.com/dashboard
💰 ค่าธรรมเนียม: $19 USD (ครั้งเดียว)
```

### 2️⃣ สร้างแอปและดึงข้อมูล (5 นาที)
1. Partner Center → New product → MSIX app
2. ตั้งชื่อ: **Sakukoro Pomodoro**
3. ไปที่ **Product Identity** และคัดลอก:
   - `Package/Identity/Name`
   - `Package/Identity/Publisher`

### 3️⃣ อัพเดท package.json (2 นาที)
```json
"appx": {
  "identityName": "วางค่าจาก Partner Center",
  "publisher": "วางค่าจาก Partner Center",
  // ... ส่วนอื่นๆ ไม่ต้องแก้
}
```

### 4️⃣ สร้าง Icons (3 นาที)
```bash
npm run generate-icons
```
ตรวจสอบไฟล์ใน `build-assets/` ว่าครบ 7 ไฟล์

### 5️⃣ Build แอป (5 นาที)
```bash
npm run prepare-store
```
หรือ
```bash
npm run electron:build:win
```

ไฟล์ `.appx` จะอยู่ใน `dist/`

### 6️⃣ Host Privacy Policy (3 นาที)
1. GitHub → Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: **main**, Folder: **/docs**
4. Save และรอ 2-3 นาที
5. URL: `https://[username].github.io/sakukoro-pomodoro/privacy-policy.html`

### 7️⃣ ถ่าย Screenshots (5 นาที)
ถ่าย 4-5 รูป (1920x1080):
- หน้าจอหลัก (Timer)
- Task management
- Settings
- Dark mode
- Notifications

### 8️⃣ Upload ไป Partner Center (10 นาที)

#### Packages
- Upload ไฟล์ `.appx`

#### Store listings (English)
```
Title: Sakukoro Pomodoro

Description:
Boost your focus with Sakukoro Pomodoro - a beautiful Pomodoro timer.

Features:
• Customizable timer
• Task management
• Dark/Light mode
• System tray
• Keyboard shortcuts
• Daily goals
• Offline & Private

Perfect for students, developers, and anyone who wants better focus!

Keywords: pomodoro, timer, productivity, focus, time management
```

#### Store listings (Thai)
```
Title: Sakukoro Pomodoro

Description:
เพิ่มสมาธิด้วย Sakukoro Pomodoro - แอปจับเวลาแบบ Pomodoro

ฟีเจอร์:
• ปรับเวลาได้
• จัดการงาน
• โหมดมืด/สว่าง
• System tray
• ปุ่มลัด
• เป้าหมายรายวัน
• ออฟไลน์และปลอดภัย

เหมาะสำหรับนักเรียน นักพัฒนา และทุกคนที่ต้องการสมาธิดีขึ้น!

Keywords: pomodoro, timer, productivity, focus, time management
```

#### Properties
- Category: **Productivity**
- Subcategory: **Time management**
- Age rating: **3+**

#### Privacy Policy
- URL: `https://[username].github.io/sakukoro-pomodoro/privacy-policy.html`

### 9️⃣ Submit! (1 นาที)
- Review ทุกอย่าง
- คลิก **Submit to the Store**
- รอ 24-48 ชั่วโมง

---

## 📋 Checklist ก่อน Submit

```
[ ] อัพเดท publisher ใน package.json
[ ] สร้าง icons (npm run generate-icons)
[ ] Build แอป (npm run prepare-store)
[ ] ได้ไฟล์ .appx ใน dist/
[ ] Host Privacy Policy บน GitHub Pages
[ ] ถ่าย screenshots 4-5 รูป
[ ] กรอกข้อมูลครบใน Partner Center
[ ] Upload .appx package
[ ] Submit!
```

---

## 🎯 คำสั่งที่ใช้บ่อย

```bash
# ติดตั้ง dependencies
npm install --legacy-peer-deps

# สร้าง icons
npm run generate-icons

# Build สำหรับ Windows
npm run electron:build:win

# Build + สร้าง icons (ทำทุกอย่าง)
npm run prepare-store

# ทดสอบแอป
npm run electron:dev:simple

# ลบ cache และ build ใหม่
npm run clean
npm run prepare-store
```

---

## ⚠️ ปัญหาที่เจอบ่อย

### ❌ Build failed
```bash
npm run clean
npm install --legacy-peer-deps
npm run prepare-store
```

### ❌ Package validation failed
- ตรวจสอบ `publisher` และ `identityName` ใน package.json
- ต้องตรงกับ Partner Center ทุกตัวอักษร

### ❌ Icons missing
```bash
npm run generate-icons
# ตรวจสอบว่ามีไฟล์ใน build-assets/ ครบ 7 ไฟล์
```

### ❌ Privacy Policy 404
- รอ 5-10 นาที หลัง enable GitHub Pages
- ตรวจสอบว่าเลือก folder **/docs** ใน Settings

---

## 📚 เอกสารเพิ่มเติม

- **คู่มือฉบับเต็ม**: `MICROSOFT_STORE_DEPLOYMENT.md`
- **Checklist ละเอียด**: `STORE_SUBMISSION_CHECKLIST.md`
- **Privacy Policy**: `docs/privacy-policy.html`

---

## 🎉 เมื่อ Publish สำเร็จ

ลิงก์แอปของคุณ:
```
https://www.microsoft.com/store/apps/[YOUR-APP-ID]
```

แชร์ให้เพื่อนๆ และขอรีวิวกันเยอะๆ! 🚀

---

## 💡 Tips

1. **Screenshots สวย** = Download เยอะ
2. **Description ชัดเจน** = Conversion rate สูง
3. **ตอบรีวิวเร็ว** = Rating ดี
4. **อัพเดทสม่ำเสมอ** = User กลับมาใช้

---

## 📞 ต้องการความช่วยเหลือ?

- **Microsoft Support**: https://partner.microsoft.com/support
- **GitHub Issues**: https://github.com/intity01/sakukoro-pomodoro/issues
- **Email**: aoom5961@gmail.com

---

**Good luck! 💪 คุณทำได้!**
