# 🏪 Microsoft Store Deployment Guide

## ขั้นตอนการ Deploy Sakukoro Pomodoro ไป Microsoft Store

### 📋 สิ่งที่ต้องเตรียมก่อน

1. **บัญชี Microsoft Partner Center**
   - สมัครที่: https://partner.microsoft.com/dashboard
   - ค่าธรรมเนียม: $19 USD (ครั้งเดียว สำหรับบุคคล) หรือ $99 USD (สำหรับองค์กร)

2. **Windows 10/11 สำหรับ Build**
   - ต้อง build บน Windows เท่านั้น
   - ติดตั้ง Windows SDK

3. **Certificate สำหรับ Code Signing**
   - จะได้จาก Partner Center หลังจากสร้างแอป

---

## 🔧 ขั้นตอนที่ 1: เตรียม Partner Center

### 1.1 สร้างแอปใหม่
1. เข้า Partner Center → Apps and games → New product
2. เลือก "MSIX or PWA app"
3. ตั้งชื่อแอป: **Sakukoro Pomodoro**
4. Reserve name

### 1.2 ดึงข้อมูล Publisher
1. ไปที่ Product Identity
2. คัดลอก:
   - **Package/Identity/Name**: เช่น `12345Sakukoro.SakukoroPomodoro`
   - **Package/Identity/Publisher**: เช่น `CN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`
   - **Package/Properties/PublisherDisplayName**: ชื่อที่แสดง

### 1.3 อัพเดท package.json
แก้ไขค่าใน `package.json`:

```json
"appx": {
  "identityName": "12345Sakukoro.SakukoroPomodoro",  // จาก Partner Center
  "publisher": "CN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",  // จาก Partner Center
  "publisherDisplayName": "Your Name or Company",
  "applicationId": "SakukoroPomodoro",
  "displayName": "Sakukoro Pomodoro"
}
```

---

## 🎨 ขั้นตอนที่ 2: เตรียม Assets (สำคัญมาก!)

Microsoft Store ต้องการ icons หลายขนาด:

### 2.1 สร้างโฟลเดอร์ build-assets
```bash
mkdir build-assets
```

### 2.2 สร้าง Icons ขนาดต่างๆ
ต้องมีไฟล์เหล่านี้ (PNG format, ไม่มี transparency สำหรับบางขนาด):

```
build-assets/
├── Square44x44Logo.png          (44x44)
├── Square150x150Logo.png        (150x150)
├── Square310x310Logo.png        (310x310)
├── Wide310x150Logo.png          (310x150)
├── StoreLogo.png                (50x50)
└── SplashScreen.png             (620x300)
```

**เครื่องมือแนะนำ:**
- https://www.electronforge.io/guides/create-and-add-icons
- https://redketchup.io/icon-converter

### 2.3 อัพเดท package.json เพิ่ม assets config

```json
"appx": {
  // ... existing config
  "assets": "build-assets",
  "assetLanguages": ["en-US", "th-TH"]
}
```

---

## 🏗️ ขั้นตอนที่ 3: Build แอป

### 3.1 ติดตั้ง Dependencies
```bash
npm install --legacy-peer-deps
```

### 3.2 Build สำหรับ Windows
```bash
npm run electron:build:win
```

คำสั่งนี้จะ:
1. Build Next.js → `out/`
2. Obfuscate code
3. สร้าง NSIS installer, Portable, และ **APPX** package

### 3.3 หาไฟล์ที่ Build เสร็จ
ไฟล์จะอยู่ที่:
```
dist/
├── Sakukoro Pomodoro Setup 1.0.0.exe  (NSIS installer)
├── Sakukoro Pomodoro 1.0.0.exe        (Portable)
└── Sakukoro Pomodoro 1.0.0.appx       (สำหรับ Microsoft Store) ⭐
```

---

## 📤 ขั้นตอนที่ 4: Upload ไป Microsoft Store

### 4.1 เตรียม Submission
1. กลับไปที่ Partner Center
2. เลือกแอปของคุณ → Start submission

### 4.2 กรอกข้อมูลแอป

#### **Pricing and availability**
- ฟรี หรือ ราคา
- ตลาดที่ต้องการขาย (เลือก Thailand, US, etc.)

#### **Properties**
- Category: **Productivity**
- Subcategory: **Time management**
- Age rating: **3+**

#### **Age ratings**
- ตอบแบบสอบถาม (ไม่มีเนื้อหาไม่เหมาะสม)

#### **Packages**
1. คลิก "Upload package"
2. เลือกไฟล์ `.appx` จากโฟลเดอร์ `dist/`
3. รอให้ validate (ประมาณ 5-10 นาที)

#### **Store listings**
สำหรับแต่ละภาษา (en-US, th-TH):

**Description (English):**
```
Sakukoro Pomodoro - Your Cute Productivity Companion

Boost your focus and productivity with Sakukoro Pomodoro, a beautiful and minimalist Pomodoro timer designed to help you work smarter, not harder.

✨ Features:
• Clean, distraction-free interface
• Customizable timer durations
• Task management with priorities
• Dark/Light mode
• System tray integration
• Global keyboard shortcuts
• Daily goal tracking
• Break reminders
• Multi-language support (English, Thai)

Perfect for students, developers, designers, and anyone who wants to improve their focus and time management!
```

**Description (Thai):**
```
Sakukoro Pomodoro - เพื่อนคู่ใจสำหรับการทำงานอย่างมีประสิทธิภาพ

เพิ่มสมาธิและประสิทธิภาพในการทำงานด้วย Sakukoro Pomodoro แอปจับเวลาแบบ Pomodoro ที่สวยงามและใช้งานง่าย

✨ ฟีเจอร์:
• หน้าจอสะอาดตา ไม่รบกวนสมาธิ
• ปรับเวลาได้ตามต้องการ
• จัดการงานพร้อมระดับความสำคัญ
• โหมดมืด/สว่าง
• ทำงานใน System Tray
• ปุ่มลัดคีย์บอร์ด
• ติดตามเป้าหมายรายวัน
• แจ้งเตือนเวลาพัก
• รองรับภาษาไทยและอังกฤษ

เหมาะสำหรับนักเรียน นักพัฒนา นักออกแบบ และทุกคนที่ต้องการเพิ่มสมาธิและจัดการเวลาให้ดีขึ้น!
```

**Screenshots:**
- ต้องมีอย่างน้อย 1 รูป (แนะนำ 4-5 รูป)
- ขนาด: 1366x768 หรือ 1920x1080
- แสดงฟีเจอร์หลักๆ ของแอป

**App icon:**
- 1:1 ratio (300x300 ขึ้นไป)
- ใช้ไฟล์ `public/sakukoro-mascot.png`

#### **Privacy policy**
- URL: ใส่ลิงก์ไปยัง `PRIVACY_POLICY.md` (ต้อง host บน GitHub Pages หรือเว็บไซต์)
- หรือใช้: `https://yourusername.github.io/sakukoro-pomodoro/PRIVACY_POLICY.html`

#### **Notes for certification**
```
This is a Pomodoro timer application built with Electron and Next.js.

Testing instructions:
1. Launch the app
2. Click Play button to start timer
3. Timer will count down from 25 minutes (default)
4. Test keyboard shortcuts: Space (play/pause), R (reset), T (tasks)
5. Test dark mode toggle
6. Test settings panel

No login required. All data is stored locally.
```

### 4.3 Submit for certification
1. Review ทุกอย่าง
2. คลิก "Submit to the Store"
3. รอการตรวจสอบ (ประมาณ 24-48 ชั่วโมง)

---

## ⚠️ ปัญหาที่อาจเจอและวิธีแก้

### ❌ "Package validation failed"
**สาเหตุ:** Publisher ID ไม่ตรง
**แก้:** ตรวจสอบ `publisher` ใน package.json ให้ตรงกับ Partner Center

### ❌ "Missing required assets"
**สาเหตุ:** ไม่มี icons ครบ
**แก้:** สร้าง icons ตามขนาดที่ระบุใน section 2.2

### ❌ "App crashes on launch"
**สาเหตุ:** Path ของ resources ไม่ถูกต้อง
**แก้:** ตรวจสอบ path ใน `electron/main.js` ให้ใช้ `process.resourcesPath` สำหรับ production

### ❌ "Certification failed - Security"
**สาเหตุ:** Code ไม่ผ่านการตรวจสอบความปลอดภัย
**แก้:** ตรวจสอบว่าไม่มี:
- External API calls ที่ไม่ปลอดภัย
- Code injection vulnerabilities
- Suspicious network activity

---

## 🎯 Checklist ก่อน Submit

- [ ] อัพเดท `publisher` ใน package.json จาก Partner Center
- [ ] สร้าง icons ครบทุกขนาด
- [ ] Build แอปสำเร็จ (ได้ไฟล์ .appx)
- [ ] ทดสอบแอปบน Windows 10/11
- [ ] เตรียม screenshots (4-5 รูป)
- [ ] เขียน description ภาษาไทยและอังกฤษ
- [ ] Host privacy policy online
- [ ] กรอกข้อมูลครบใน Partner Center
- [ ] Submit!

---

## 📊 หลังจาก Publish

### ติดตาม Analytics
- Partner Center → Analytics
- ดูจำนวน downloads, ratings, reviews

### อัพเดทแอป
1. เพิ่ม version ใน `package.json`
2. Build ใหม่
3. Upload package ใหม่ใน Partner Center
4. Submit update

### ตอบรีวิว
- ตอบรีวิวของผู้ใช้เป็นประจำ
- แก้ไข bugs ที่ถูกรายงาน

---

## 🚀 ขั้นตอนถัดไป: Multi-platform

### macOS (Mac App Store)
```bash
npm run electron:build:mac
```
- ต้องมี Apple Developer Account ($99/year)
- ต้อง build บน macOS
- ใช้ App Store Connect

### Linux
```bash
npm run electron:build:linux
```
- Publish บน Snap Store (ฟรี)
- หรือ Flathub (ฟรี)
- ไม่ต้อง code signing

---

## 📞 ช่องทางติดต่อ Microsoft Support

- Partner Center Support: https://partner.microsoft.com/support
- Developer Forum: https://learn.microsoft.com/answers/
- Email: storesupport@microsoft.com

---

## 💡 Tips สำหรับความสำเร็จ

1. **Screenshots สวยๆ** - ใช้เวลาทำให้ดูดี มีผลต่อ conversion rate มาก
2. **Description ชัดเจน** - บอกฟีเจอร์และประโยชน์ที่ได้รับ
3. **ตอบรีวิวเร็ว** - แสดงว่าคุณใส่ใจผู้ใช้
4. **อัพเดทสม่ำเสมอ** - แก้ bugs และเพิ่มฟีเจอร์ใหม่
5. **ทดสอบให้ดี** - ก่อน submit ทุกครั้ง

---

Good luck! 🎉
