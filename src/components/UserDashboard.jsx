import { useEffect, useState } from "react"
import api from "../api/axios"

export default function UserDashboard({ onLogout }) {
  const [tasks, setTasks] = useState([])
  const [reasonTaskId, setReasonTaskId] = useState(null)
  const [reasonText, setReasonText] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await api.get("/api/tasks/mytasks")
    setTasks(res.data)
  }

  const toggleComplete = async (task) => {
    if (task.completed) {
      setReasonTaskId(task._id)
      return
    }

    await api.patch(`/api/tasks/${task._id}/toggle`)
    fetchTasks()
  }

  const submitReason = async (taskId) => {
    if (!reasonText.trim()) return

    await api.patch(`/api/tasks/${taskId}/toggle`, {
      reason: reasonText,
    })

    setReasonTaskId(null)
    setReasonText("")
    fetchTasks()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] px-6 py-10 text-white">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Tasks 💫</h1>
          <button
            onClick={onLogout}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-slate-900 font-semibold hover:scale-105 transition"
          >
            Logout
          </button>
        </div>

        <div className="space-y-5">
          {tasks.map(task => (
            <div
              key={task._id}
              className="bg-black/30 rounded-2xl p-5 hover:bg-black/40 transition"
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">{task.title}</p>
                <span className={`text-sm font-semibold ${task.completed ? "text-green-400" : "text-red-400"}`}>
                  {task.completed ? "Completed" : "Not Completed"}
                </span>
              </div>

              {!task.completed && task.notCompletedReason && (
                <p className="text-pink-300 text-sm mt-2">
                  Reason: {task.notCompletedReason}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => toggleComplete(task)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-900 font-semibold hover:scale-105 transition"
                >
                  Toggle
                </button>
              </div>

              {reasonTaskId === task._id && (
                <div className="mt-4 flex gap-3">
                  <input
                    placeholder="Enter reason"
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                    className="flex-1 rounded-xl bg-black/40 px-4 py-2 outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <button
                    onClick={() => submitReason(task._id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-slate-900 font-semibold hover:scale-105 transition"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
