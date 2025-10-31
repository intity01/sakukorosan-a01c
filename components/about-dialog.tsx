"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Flame, Target, Brain, Heart, Zap, Users } from "lucide-react"

interface AboutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-4">
            🍅 Sakukoro Pomodoro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mission */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-primary mb-3">จุดมุ่งหมายของเรา</h3>
            <p className="text-muted-foreground leading-relaxed">
              ช่วยให้คุณทำงานหรือเรียนได้อย่างมีประสิทธิภาพ ด้วย Pomodoro Technique
              <br />
              <span className="text-sm">✨ Focus 25 นาที → พัก 5 นาที → ทำซ้ำ</span>
            </p>
          </div>

          {/* For Who */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              เหมาะสำหรับ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">🎓</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">นักเรียน / นิสิต</p>
                  <p className="text-xs text-muted-foreground">อ่านหนังสือมีสมาธิ ไม่ burnout</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">💼</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Freelancer / Remote</p>
                  <p className="text-xs text-muted-foreground">ทำงานที่บ้านมีประสิทธิภาพ</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">👨‍💻</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Programmer</p>
                  <p className="text-xs text-muted-foreground">Deep work ไม่เสียสมาธิ</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">🎨</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">ครีเอทีฟ</p>
                  <p className="text-xs text-muted-foreground">สร้างสรรค์ได้ต่อเนื่อง</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              ทำไมต้องใช้ Pomodoro?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">เพิ่มสมาธิ Focus</p>
                  <p className="text-xs text-muted-foreground">25 นาที = ช่วงที่สมองทำงานได้ดีที่สุด</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">ทำงานเสร็จเร็วขึ้น</p>
                  <p className="text-xs text-muted-foreground">ตั้งเวลาจำกัด = ทำงานมีประสิทธิภาพมากขึ้น</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">ป้องกัน Burnout</p>
                  <p className="text-xs text-muted-foreground">พักสม่ำเสมอทุก 25 นาที</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">สุขภาพดีขึ้น</p>
                  <p className="text-xs text-muted-foreground">ลุกเดินบ่อย ๆ ดูแลสุขภาพ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">ผลการวิจัยพบว่าผู้ใช้ Pomodoro</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold text-primary">86%</p>
                <p className="text-xs text-muted-foreground">รู้สึก productive มากขึ้น</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">72%</p>
                <p className="text-xs text-muted-foreground">ทำงานเสร็จเร็วขึ้น</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">91%</p>
                <p className="text-xs text-muted-foreground">work-life balance ดีขึ้น</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">+2.5</p>
                <p className="text-xs text-muted-foreground">ชม./วัน focus time</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Made with ❤️ for productivity enthusiasts
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
