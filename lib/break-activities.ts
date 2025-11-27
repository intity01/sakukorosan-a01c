/**
 * Break Activity Suggestions
 * Random activity recommendations for short and long breaks
 */

export interface BreakActivity {
  icon: string
  activity: string
  duration: "short" | "long" | "both"
  category: "physical" | "mental" | "social" | "creative"
}

export const breakActivities: BreakActivity[] = [
  // Physical Activities
  { icon: "🚶", activity: "Take a short walk", duration: "both", category: "physical" },
  { icon: "🧘", activity: "Do some stretching", duration: "both", category: "physical" },
  { icon: "💧", activity: "Drink a glass of water", duration: "short", category: "physical" },
  { icon: "👀", activity: "Look away from screen (20-20-20 rule)", duration: "short", category: "physical" },
  { icon: "🤸", activity: "Do 10 jumping jacks", duration: "short", category: "physical" },
  { icon: "🏃", activity: "Quick cardio workout", duration: "long", category: "physical" },
  { icon: "🧘‍♀️", activity: "Meditation or breathing exercises", duration: "long", category: "physical" },
  { icon: "💪", activity: "Simple desk exercises", duration: "short", category: "physical" },
  
  // Mental Activities
  { icon: "😌", activity: "Close your eyes and relax", duration: "short", category: "mental" },
  { icon: "🎵", activity: "Listen to your favorite song", duration: "both", category: "mental" },
  { icon: "📖", activity: "Read a few pages", duration: "both", category: "mental" },
  { icon: "🧠", activity: "Quick brain teaser or puzzle", duration: "short", category: "mental" },
  { icon: "🎧", activity: "Listen to a podcast", duration: "long", category: "mental" },
  { icon: "✍️", activity: "Journal your thoughts", duration: "long", category: "mental" },
  
  // Social Activities
  { icon: "☕", activity: "Chat with a colleague", duration: "both", category: "social" },
  { icon: "📱", activity: "Call a friend or family", duration: "long", category: "social" },
  { icon: "💬", activity: "Send a message to someone", duration: "short", category: "social" },
  { icon: "🤝", activity: "Quick team check-in", duration: "short", category: "social" },
  
  // Creative Activities  
  { icon: "🎨", activity: "Doodle or sketch", duration: "both", category: "creative" },
  { icon: "🌱", activity: "Water your plants", duration: "short", category: "creative" },
  { icon: "🎮", activity: "Play a quick game", duration: "long", category: "creative" },
  { icon: "📸", activity: "Take some photos", duration: "long", category: "creative" },
  { icon: "🍵", activity: "Make yourself tea or coffee", duration: "short", category: "creative" },
  { icon: "🪟", activity: "Look out the window", duration: "short", category: "creative" },
  { icon: "🌤️", activity: "Step outside for fresh air", duration: "both", category: "creative" },
  { icon: "🧹", activity: "Tidy up your workspace", duration: "both", category: "creative" },
]

export function getRandomBreakActivity(isLongBreak: boolean = false): BreakActivity {
  const duration = isLongBreak ? "long" : "short"
  const suitable = breakActivities.filter(
    a => a.duration === duration || a.duration === "both"
  )
  
  return suitable[Math.floor(Math.random() * suitable.length)]
}

export function getBreakActivitiesByCategory(category: BreakActivity["category"], isLongBreak: boolean = false): BreakActivity[] {
  const duration = isLongBreak ? "long" : "short"
  return breakActivities.filter(
    a => a.category === category && (a.duration === duration || a.duration === "both")
  )
}
