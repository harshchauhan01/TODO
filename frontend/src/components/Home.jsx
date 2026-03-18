import { useEffect, useState } from "react";
import CustomForm from "./Form";
import axios from "axios";

const Home = () => {
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await axios.get("http://127.0.0.1:8000/api/todo/");
                setData(response.data);
            } catch (fetchError) {
                setError("Unable to load tasks right now. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const formatDueDate = (dueDate) => {
        if (!dueDate) {
            return "No due date";
        }

        const parsedDate = new Date(dueDate);
        if (Number.isNaN(parsedDate.getTime())) {
            return "No due date";
        }

        return parsedDate.toLocaleDateString();
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 px-4 py-8 sm:px-6">
            <div className="mx-auto w-full max-w-5xl space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Task Manager</h1>
                            <p className="mt-2 text-sm text-slate-600">Track your tasks and stay focused on what matters most.</p>
                        </div>
                        <button
                            onClick={() => setShowForm((prev) => !prev)}
                            className="h-11 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            {showForm ? "Hide Form" : "Add Task"}
                        </button>
                    </div>
                </section>

                {showForm && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <CustomForm />
                    </section>
                )}

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">Your Tasks</h2>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {data.length} {data.length === 1 ? "task" : "tasks"}
                        </span>
                    </div>

                    {loading && <p className="text-sm text-slate-500">Loading tasks...</p>}
                    {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

                    {!loading && !error && data.length === 0 && (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                            No tasks yet. Use Add Task to create your first one.
                        </div>
                    )}

                    {!loading && !error && data.length > 0 && (
                        <ul className="space-y-3">
                            {data.map((task) => (
                                <li
                                    key={task.id}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
                                            <p className="mt-1 text-sm text-slate-600">
                                                {task.content || "No description provided."}
                                            </p>
                                        </div>
                                        <span
                                            className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${task.completed
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-amber-100 text-amber-700"}`}
                                        >
                                            {task.completed ? "Completed" : "Pending"}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                                        <span className="rounded-md bg-white px-2 py-1 border border-slate-200">
                                            Priority: {task.priority}
                                        </span>
                                        <span className="rounded-md bg-white px-2 py-1 border border-slate-200">
                                            Due: {formatDueDate(task.due_date)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Home;