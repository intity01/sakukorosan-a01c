"use client"

import { useState } from "react"
import { MessageSquare, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!feedback.trim()) return

    // ในอนาคตสามารถส่งไป backend ได้
    console.log("Feedback:", { email, feedback })
    setSubmitted(true)
    setTimeout(() => {
      setIsOpen(false)
      setSubmitted(false)
      setFeedback("")
      setEmail("")
    }, 2000)
  }

  return (
    <>
      {/* Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50"
        aria-label="Feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Feedback Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">ขอบคุณครับ! 🙏</h3>
                <p className="text-sm text-muted-foreground">เราจะนำความคิดเห็นของคุณไปปรับปรุงแอปต่อไป</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-foreground mb-2">แบ่งปันความคิดเห็น</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  เราอยากฟังความคิดเห็นของคุณเพื่อปรับปรุงแอปให้ดีขึ้น
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      อีเมล (ไม่บังคับ)
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">ความคิดเห็น *</label>
                    <Textarea
                      placeholder="บอกเราว่าคุณคิดอย่างไรกับแอปนี้..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="rounded-xl min-h-32 resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!feedback.trim()}
                    className="w-full rounded-xl bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    ส่งความคิดเห็น
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
