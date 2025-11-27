# ✅ Microsoft Store Submission Checklist

## 📝 ก่อน Build

### 1. อัพเดท Package.json
- [ ] เปลี่ยน `version` เป็นเวอร์ชันที่ต้องการ (เช่น `1.0.0`)
- [ ] อัพเดท `publisher` จาก Partner Center
- [ ] อัพเดท `identityName` จาก Partner Center
- [ ] ตรวจสอบ `displayName` ถูกต้อง

### 2. เตรียม Icons
```bash
npm run generate-icons
```
- [ ] ตรวจสอบไฟล์ใน `build-assets/` ครบทุกขนาด
- [ ] ตรวจสอบ icons ดูสวยงาม ไม่เบลอ

### 3. ทดสอบแอป
```bash
npm run electron:dev:simple
```
- [ ] แอปเปิดได้ปกติ
- [ ] Timer ทำงานถูกต้อง
- [ ] Task management ใช้งานได้
- [ ] Settings บันทึกได้
- [ ] Dark/Light mode สลับได้
- [ ] Keyboard shortcuts ทำงาน
- [ ] Notifications แสดงได้
- [ ] System tray ทำงาน

---

## 🏗️ Build

### 4. Build สำหรับ Windows
```bash
npm run prepare-store
```
หรือ
```bash
npm run electron:build:win
```

- [ ] Build สำเร็จไม่มี errors
- [ ] ได้ไฟล์ `.appx` ใน `dist/`
- [ ] ขนาดไฟล์ไม่เกิน 500 MB

### 5. ทดสอบ APPX Package
```powershell
# ติดตั้งแบบ sideload เพื่อทดสอบ
Add-AppxPackage -Path "dist\Sakukoro Pomodoro 1.0.0.appx"
```
- [ ] ติดตั้งได้สำเร็จ
- [ ] แอปเปิดได้จาก Start Menu
- [ ] ทดสอบฟีเจอร์ทั้งหมดอีกครั้ง
- [ ] ถอนการติดตั้งได้ปกติ

---

## 📸 เตรียม Assets สำหรับ Store

### 6. Screenshots (ต้องมีอย่างน้อย 1 รูป, แนะนำ 4-5 รูป)
ขนาดแนะนำ: **1920x1080** หรือ **1366x768**

รูปที่ควรมี:
- [ ] หน้าจอหลัก (Timer screen)
- [ ] Task management
- [ ] Settings panel
- [ ] Dark mode
- [ ] Notifications/System tray

**วิธีถ่าย:**
1. เปิดแอป
2. กด `Win + Shift + S` (Snipping Tool)
3. เลือกพื้นที่ที่ต้องการ
4. บันทึกเป็น PNG

### 7. App Icon สำหรับ Store
- [ ] ใช้ `public/sakukoro-mascot.png`
- [ ] ขนาดอย่างน้อย 300x300
- [ ] Ratio 1:1

### 8. Promotional Images (Optional แต่แนะนำ)
- [ ] Hero image (1920x1080) - แสดงบน Store page
- [ ] Promotional banner (2400x1200)

---

## 📄 เตรียมข้อมูล

### 9. Description (ภาษาอังกฤษ)
```
Sakukoro Pomodoro - Your Cute Productivity Companion

Boost your focus and productivity with Sakukoro Pomodoro, a beautiful and minimalist Pomodoro timer designed to help you work smarter, not harder.

✨ Features:
• Clean, distraction-free interface
• Customizable timer durations (Focus, Short Break, Long Break)
• Task management with priorities
• Dark/Light mode with multiple color themes
• System tray integration - work in the background
• Global keyboard shortcuts for quick access
• Daily goal tracking and statistics
• Break reminders with notifications
• Multi-language support (English, Thai)
• Completely offline - your data stays on your device
• No ads, no tracking, no account required

Perfect for:
• Students studying for exams
• Developers coding projects
• Designers working on creative tasks
• Writers focusing on content
• Anyone who wants to improve focus and time management

Why Pomodoro Technique?
The Pomodoro Technique is a time management method that uses a timer to break work into intervals (traditionally 25 minutes) separated by short breaks. This helps maintain focus and prevents burnout.

Privacy First:
All your data is stored locally on your device. No cloud sync, no tracking, no data collection. Your tasks and statistics are yours alone.

Free and Open Source:
Sakukoro Pomodoro is open source software. You can review the code and contribute on GitHub.

Start your productivity journey today! 🍅
```

### 10. Description (ภาษาไทย)
```
Sakukoro Pomodoro - เพื่อนคู่ใจสำหรับการทำงานอย่างมีประสิทธิภาพ

เพิ่มสมาธิและประสิทธิภาพในการทำงานด้วย Sakukoro Pomodoro แอปจับเวลาแบบ Pomodoro ที่สวยงาม ใช้งานง่าย และออกแบบมาเพื่อช่วยให้คุณทำงานได้อย่างชาญฉลาด

✨ ฟีเจอร์:
• หน้าจอสะอาดตา ไม่รบกวนสมาธิ
• ปรับเวลาได้ตามต้องการ (โฟกัส, พักสั้น, พักยาว)
• จัดการงานพร้อมระดับความสำคัญ
• โหมดมืด/สว่าง พร้อมธีมสีหลากหลาย
• ทำงานใน System Tray - ใช้งานเบื้องหลังได้
• ปุ่มลัดคีย์บอร์ดสำหรับเข้าถึงง่าย
• ติดตามเป้าหมายรายวันและสถิติ
• แจ้งเตือนเวลาพักด้วย Notifications
• รองรับภาษาไทยและอังกฤษ
• ใช้งานออฟไลน์ได้ - ข้อมูลอยู่ในเครื่องคุณ
• ไม่มีโฆษณา ไม่มีการติดตาม ไม่ต้องสมัครสมาชิก

เหมาะสำหรับ:
• นักเรียน นักศึกษา ที่กำลังอ่านหนังสือสอบ
• นักพัฒนาที่กำลังเขียนโค้ด
• นักออกแบบที่ทำงานสร้างสรรค์
• นักเขียนที่กำลังเขียนคอนเทนต์
• ทุกคนที่ต้องการเพิ่มสมาธิและจัดการเวลาให้ดีขึ้น

ทำไมต้อง Pomodoro Technique?
เทคนิค Pomodoro เป็นวิธีการจัดการเวลาที่ใช้ตัวจับเวลาแบ่งงานออกเป็นช่วงๆ (โดยปกติ 25 นาที) คั่นด้วยการพักสั้นๆ ช่วยรักษาสมาธิและป้องกันความเหนื่อยล้า

ความเป็นส่วนตัวเป็นสำคัญ:
ข้อมูลทั้งหมดเก็บไว้ในเครื่องของคุณเท่านั้น ไม่มีการซิงค์คลาวด์ ไม่มีการติดตาม ไม่มีการเก็บข้อมูล งานและสถิติของคุณเป็นของคุณเพียงผู้เดียว

ฟรีและโอเพนซอร์ส:
Sakukoro Pomodoro เป็นซอฟต์แวร์โอเพนซอร์ส คุณสามารถตรวจสอบโค้ดและมีส่วนร่วมได้ที่ GitHub

เริ่มต้นเส้นทางเพิ่มประสิทธิภาพของคุณวันนี้! 🍅
```

### 11. Keywords (สูงสุด 7 คำ)
- [ ] pomodoro
- [ ] timer
- [ ] productivity
- [ ] focus
- [ ] time management
- [ ] task manager
- [ ] study timer

### 12. Privacy Policy URL
- [ ] Host `PRIVACY_POLICY.md` บน GitHub Pages
- [ ] หรือใช้: `https://yourusername.github.io/sakukoro-pomodoro/PRIVACY_POLICY.html`
- [ ] ทดสอบ URL เปิดได้

### 13. Support Contact
- [ ] Email: aoom5961@gmail.com
- [ ] Website/GitHub: https://github.com/intity01/sakukoro-pomodoro

---

## 🏪 Partner Center

### 14. สร้างแอปใน Partner Center
- [ ] เข้า https://partner.microsoft.com/dashboard
- [ ] สร้าง "New product" → "MSIX or PWA app"
- [ ] Reserve name: "Sakukoro Pomodoro"
- [ ] คัดลอก Publisher ID และ Identity Name

### 15. กรอกข้อมูลใน Partner Center

#### Pricing and availability
- [ ] เลือก "Free"
- [ ] เลือกตลาด: Thailand, United States, และอื่นๆ ที่ต้องการ
- [ ] Visibility: Public

#### Properties
- [ ] Category: **Productivity**
- [ ] Subcategory: **Time management**
- [ ] Age rating: **3+** (ไม่มีเนื้อหาไม่เหมาะสม)

#### Age ratings
- [ ] ตอบแบบสอบถาม (ทุกคำตอบควรเป็น "No")

#### Packages
- [ ] Upload ไฟล์ `.appx` จาก `dist/`
- [ ] รอ validation (5-10 นาที)
- [ ] ตรวจสอบไม่มี errors

#### Store listings - English (en-US)
- [ ] Description (ใช้จาก section 9)
- [ ] Screenshots (4-5 รูป)
- [ ] App icon (300x300+)
- [ ] Short description (สั้นๆ 1-2 ประโยค)
- [ ] Keywords (7 คำ)

#### Store listings - Thai (th-TH)
- [ ] Description (ใช้จาก section 10)
- [ ] Screenshots (เหมือนกับ en-US หรือแยกก็ได้)
- [ ] App icon (เหมือนกับ en-US)
- [ ] Short description
- [ ] Keywords

#### Privacy policy
- [ ] ใส่ URL ของ Privacy Policy

#### Notes for certification
```
This is a Pomodoro timer application built with Electron and Next.js.

Testing instructions:
1. Launch the app from Start Menu
2. Click the Play button (center) to start the timer
3. Timer will count down from 25 minutes (default focus time)
4. Test keyboard shortcuts:
   - Space: Play/Pause
   - R: Reset timer
   - T: Open tasks
   - S: Skip to next session
5. Test dark mode toggle (moon/sun icon in header)
6. Test settings panel (gear icon)
7. Test task management (sparkles icon)
8. Minimize to system tray (yellow button)

No login required. All data is stored locally on the device.
No internet connection needed after installation.

The app is safe, privacy-focused, and contains no ads or tracking.
```

### 16. Submit
- [ ] Review ทุกอย่างอีกครั้ง
- [ ] คลิก "Submit to the Store"
- [ ] รอการตรวจสอบ (24-48 ชั่วโมง)

---

## ⏰ หลัง Submit

### 17. ระหว่างรอ Certification
- [ ] ตรวจสอบ email จาก Microsoft
- [ ] เตรียมตอบคำถามถ้ามี
- [ ] เตรียม marketing materials

### 18. หลัง Approved
- [ ] แชร์ลิงก์ Store
- [ ] โพสต์บน social media
- [ ] ขอรีวิวจากเพื่อนๆ
- [ ] ติดตาม analytics

### 19. Maintenance
- [ ] ตอบรีวิวของผู้ใช้
- [ ] แก้ไข bugs ที่รายงาน
- [ ] วางแผนฟีเจอร์ใหม่
- [ ] อัพเดทเป็นประจำ

---

## 🚨 ปัญหาที่อาจเจอ

### Build Failed
```bash
# ลบ cache และ build ใหม่
npm run clean
npm install --legacy-peer-deps
npm run prepare-store
```

### Package Validation Failed
- ตรวจสอบ `publisher` และ `identityName` ใน package.json
- ต้องตรงกับ Partner Center ทุกตัวอักษร

### Certification Failed
- อ่าน feedback จาก Microsoft ให้ละเอียด
- แก้ไขตามที่แนะนำ
- Submit ใหม่

### App Crashes
- ทดสอบบน Windows 10 และ 11
- ตรวจสอบ logs ใน Event Viewer
- แก้ไข bugs และ build ใหม่

---

## 📞 ติดต่อ Support

- **Microsoft Partner Support**: https://partner.microsoft.com/support
- **Developer Forum**: https://learn.microsoft.com/answers/
- **Email**: storesupport@microsoft.com

---

## 🎉 เมื่อ Publish สำเร็จ

ลิงก์แอปของคุณจะเป็น:
```
https://www.microsoft.com/store/apps/[YOUR-APP-ID]
```

แชร์ให้เพื่อนๆ และขอรีวิวกันเยอะๆ นะครับ! 🚀

---

**Good luck with your submission! 💪**
