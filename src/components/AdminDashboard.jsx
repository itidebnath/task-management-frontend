import { useEffect, useState } from "react"
import axios from "axios"

export default function AdminDashboard({ onLogout }) {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [assignedTo, setAssignedTo] = useState("")

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchUsers()
    fetchTasks()
  }, [])

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
    setUsers(res.data)
  }

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
    setTasks(res.data)
  }

  const createTask = async () => {
    if (!title || !assignedTo) return

    await axios.post(
      "http://localhost:5000/api/tasks/create",
      { title, userId: assignedTo },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setTitle("")
    setAssignedTo("")
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchTasks()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] px-6 py-10 text-white">
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard 👑</h1>
          <button
            onClick={onLogout}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-slate-900 font-semibold hover:scale-105 transition"
          >
            Logout
          </button>
        </div>

        {/* Create Task */}
        <div className="bg-black/30 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Create Task</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl bg-black/40 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="rounded-xl bg-black/40 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="">Assign user</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            <button
              onClick={createTask}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-900 font-semibold hover:scale-105 transition"
            >
              Create
            </button>
          </div>
        </div>

        {/* Task List */}
        <h2 className="text-xl font-semibold mb-4">All Tasks</h2>

        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task._id}
              className="bg-black/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-black/40 transition"
            >
              <div>
                <p className="font-semibold text-lg">{task.title}</p>
                <p className="text-sm opacity-80">
                  Assigned to: {task.assignedTo?.name || "N/A"}
                </p>

                {!task.completed && task.notCompletedReason && (
                  <p className="text-pink-300 text-sm mt-1">
                    Reason: {task.notCompletedReason}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span className={`text-sm font-semibold ${task.completed ? "text-green-400" : "text-red-400"}`}>
                  {task.completed ? "Completed" : "Not Completed"}
                </span>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-600 text-slate-900 font-semibold hover:scale-105 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
