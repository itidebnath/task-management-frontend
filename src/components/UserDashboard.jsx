import { useEffect, useState } from "react"
import api from "../api/axios"

export default function UserDashboard({ onLogout }) {
  const [tasks, setTasks] = useState([])
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [reasonText, setReasonText] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await api.get("/api/tasks/mytasks")
    setTasks(res.data)
  }

  // When user selects status
  const handleStatusChange = async (task, status) => {
    if (status === "completed") {
      await api.patch(`/api/tasks/${task._id}/toggle`)
      resetUI()
      fetchTasks()
    } else {
      setActiveTaskId(task._id)
      setSelectedStatus("not_completed")
    }
  }

  const submitReason = async (taskId) => {
    if (!reasonText.trim()) return

    await api.patch(`/api/tasks/${taskId}/toggle`, {
      reason: reasonText,
    })

    resetUI()
    fetchTasks()
  }

  const resetUI = () => {
    setActiveTaskId(null)
    setSelectedStatus("")
    setReasonText("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] px-6 py-10 text-white">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <button
            onClick={onLogout}
            className="px-5 py-2 rounded-xl bg-pink-500 font-semibold"
          >
            Logout
          </button>
        </div>

        <div className="space-y-5">
          {tasks.map(task => (
            <div key={task._id} className="bg-black/30 rounded-2xl p-5">

              <div className="flex justify-between">
                <p className="font-semibold">{task.title}</p>
                <span className={task.completed ? "text-green-400" : "text-red-400"}>
                  {task.completed ? "Completed" : "Not Completed"}
                </span>
              </div>

              {!task.completed && task.notCompletedReason && (
                <p className="text-pink-300 text-sm mt-2">
                  Reason: {task.notCompletedReason}
                </p>
              )}

              {/* RADIO OPTIONS */}
              <div className="mt-4 flex gap-6">
                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name={`status-${task._id}`}
                    checked={task.completed}
                    onChange={() => handleStatusChange(task, "completed")}
                  />
                  Completed
                </label>

                <label className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name={`status-${task._id}`}
                    checked={!task.completed}
                    onChange={() => handleStatusChange(task, "not_completed")}
                  />
                  Not Completed
                </label>
              </div>

              {/* REASON INPUT */}
              {activeTaskId === task._id && selectedStatus === "not_completed" && (
                <div className="mt-4 flex gap-3">
                  <input
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                    placeholder="Enter reason"
                    className="flex-1 px-4 py-2 rounded-xl bg-black/40"
                  />
                  <button
                    onClick={() => submitReason(task._id)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 font-semibold"
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
