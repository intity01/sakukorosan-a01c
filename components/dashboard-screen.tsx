"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Clock, TrendingUp, Plus, Trash2, CheckCircle2, Briefcase, BookOpen, User } from "lucide-react"
import { usePomodoro } from "@/lib/pomodoro-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/lib/types"

const categoryIcons = {
  work: Briefcase,
  study: BookOpen,
  personal: User,
}

const categoryColors = {
  work: "text-blue-500 bg-blue-500/10",
  study: "text-green-500 bg-green-500/10",
  personal: "text-purple-500 bg-purple-500/10",
}

export function DashboardScreen() {
  const { tasks, addTask, deleteTask, setCurrentTask, getTotalPomodoros } = usePomodoro()
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState<Task["category"]>("work")
  const [showAddTask, setShowAddTask] = useState(false)
  const [filterCategory, setFilterCategory] = useState<Task["category"] | "all">("all")

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), newTaskCategory)
      setNewTaskTitle("")
      setNewTaskCategory("work")
      setShowAddTask(false)
    }
  }

  const activeTasks = tasks.filter((t) => !t.completed)
  const filteredTasks =
    filterCategory === "all" ? activeTasks : activeTasks.filter((t) => t.category === filterCategory)

  return (
    <div className="flex flex-col h-full">
      <AppHeader />

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-foreground mb-6 text-balance">Ready to Focus?</h2>

        {/* Dashboard Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Dashboard</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAddTask(!showAddTask)}
              className="text-primary hover:bg-primary/10 rounded-full h-8 w-8 p-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {showAddTask && (
            <div className="mb-3 space-y-2">
              <Input
                placeholder="Enter task name..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                className="flex-1 bg-card border-primary/20 rounded-xl focus-visible:ring-primary/30"
                autoFocus
              />
              <div className="flex gap-2">
                <Select value={newTaskCategory} onValueChange={(v) => setNewTaskCategory(v as Task["category"])}>
                  <SelectTrigger className="flex-1 bg-card border-primary/20 rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddTask} className="rounded-xl bg-primary hover:bg-primary/90">
                  Add
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={filterCategory === "all" ? "default" : "outline"}
              onClick={() => setFilterCategory("all")}
              className="rounded-xl"
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filterCategory === "work" ? "default" : "outline"}
              onClick={() => setFilterCategory("work")}
              className="rounded-xl"
            >
              <Briefcase className="w-4 h-4 mr-1" />
              Work
            </Button>
            <Button
              size="sm"
              variant={filterCategory === "study" ? "default" : "outline"}
              onClick={() => setFilterCategory("study")}
              className="rounded-xl"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Study
            </Button>
            <Button
              size="sm"
              variant={filterCategory === "personal" ? "default" : "outline"}
              onClick={() => setFilterCategory("personal")}
              className="rounded-xl"
            >
              <User className="w-4 h-4 mr-1" />
              Personal
            </Button>
          </div>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="bg-card rounded-2xl p-8 text-center border border-primary/10">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {filterCategory === "all" ? "No tasks yet. Add one to get started!" : `No ${filterCategory} tasks.`}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const Icon = task.category ? categoryIcons[task.category] : CheckCircle2
                const colorClass = task.category ? categoryColors[task.category] : "text-primary bg-primary/10"

                return (
                  <div
                    key={task.id}
                    className="bg-card rounded-2xl p-4 flex items-center gap-3 group cursor-pointer hover:bg-primary/5 transition-all border border-transparent hover:border-primary/20"
                    onClick={() => setCurrentTask(task)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground leading-relaxed">
                        <span className="font-semibold text-primary">Task:</span> {task.title}
                      </p>
                      {task.category && (
                        <p className="text-xs text-muted-foreground mt-1 capitalize">{task.category}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTask(task.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Your Progress Section */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Progress</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-2xl p-5 border border-primary/10 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">Total Pomodoros</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{getTotalPomodoros()}</p>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-primary/10 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">Active Tasks</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{activeTasks.length}</p>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-primary/10 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">Completed</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{tasks.filter((t) => t.completed).length}</p>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-primary/10 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">Total Tasks</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{tasks.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
