import { useEffect, useState } from "react";
import CustomForm from "./Form";
import api from "../api/axios";
import { MdDelete,MdChevronLeft, MdChevronRight } from "react-icons/md";
import toast from "react-hot-toast";

const Todo = () => {
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currPage,setcurrPage]=useState(1);
    const sortedData=[...data].sort((a,b)=>{

        if(a.completed!==b.completed){
            return a.completed ? 1:-1;
        }

        const priorityDiff=a.priority-b.priority;
        if(priorityDiff!==0)return priorityDiff;
        const dateA = new Date(a.due_date || "9999-12-31");
        const dateB = new Date(b.due_date || "9999-12-31");
        return dateA-dateB;
    });

    const itemsPerPage=5;
    const startIndex=(currPage-1)*itemsPerPage;
    const currData=sortedData.slice(startIndex,startIndex+itemsPerPage);
    const totalPages=sortedData.length===0?0:Math.ceil(sortedData.length/itemsPerPage);
    

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/api/todo/");
            setData(response.data);
            console.log(response.data);
            
        } catch (fetchError) {
            setError("Unable to load tasks right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const [user, setUser] = useState(null);
    
    useEffect(()=>{
        const fetchUser = async () =>{
            try{
                const res = await api.get("/api/me/");
                setUser(res.data);
            }catch(error){
                console.log(error);
            }
        };
        fetchUser();
    },[]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskCreated = async () => {
        setShowForm(false);
        toast.success("Task created successfully.")
        await fetchTasks();
    };

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

    const handleDelete=async (i)=>{
        try{
            const url=`/api/todo/${i}/`;
            await api.delete(url);
            await fetchTasks();
            toast.success("Task deleted successfully.")
        }catch(error){
            toast.error(error);
        }
    };

    const handleTaskCompleted=async(id,comp)=>{
        try{
            await api.post(`/api/todo/${id}/mark_complete/`);
            await fetchTasks();
            if(comp==true){
                toast.success("Marked Pending");
            }else{
                toast.success("Marked Completed");
            }
        }catch(error){
            console.log(error);
        }
    };
    
    

    return (
        <main className="page-wrap min-h-screen pb-14 pt-4 sm:pt-6">
            <div className="space-y-6">
                <section className="glass-panel rise-in rounded-3xl px-6 py-7 sm:px-8 sm:py-9">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                Welcome back
                            </p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                {user?.username
                                    ? `Hi ${user.username.charAt(0).toUpperCase()}${user.username.slice(1)}`
                                    : "Your Task Manager"}
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                                Keep momentum high. Plan priority work, set deadlines, and close items fast.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm((prev) => !prev)}
                            className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-700"
                        >
                            {showForm ? "Hide Form" : "Add Task"}
                        </button>
                    </div>
                </section>

                {showForm && (
                    <section className="rise-in">
                        <CustomForm onSuccess={handleTaskCreated} onCancel={() => setShowForm(false)} />
                    </section>
                )}

                <section className="glass-panel rounded-3xl px-6 py-7 sm:px-8 sm:py-9">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-2xl font-bold text-slate-900">Your Tasks</h2>
                        <div className="flex items-center gap-3">
                            <button
                                disabled={currPage === 1}
                                onClick={() => setcurrPage(currPage - 1)}
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                                    currPage === 1
                                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300"
                                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                <MdChevronLeft size={20} />
                            </button>

                            <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
                                {currData.length} {currData.length === 1 ? "task" : "tasks"}
                            </span>

                            <button
                                disabled={currPage === totalPages || totalPages === 0}
                                onClick={() => setcurrPage(currPage + 1)}
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                                    currPage === totalPages || totalPages === 0
                                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300"
                                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                <MdChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {loading && <p className="text-sm text-slate-500">Loading tasks...</p>}
                    {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

                    {!loading && !error && currData.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
                            No tasks yet. Use Add Task to create your first one.
                        </div>
                    )}

                    {!loading && !error && sortedData.length > 0 && (
                        <ul className="space-y-3">
                            {currData.map((task) => (
                                <li
                                    key={task.id}
                                    className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                                            <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                                {task.content || "No description provided."}
                                            </p>
                                        </div>
                                        <span
                                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${task.completed
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-amber-100 text-amber-700"}`}
                                        >
                                            {task.completed ? "Completed" : "Pending"}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                                            Priority: {task.priority}
                                        </span>
                                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                                            Due: {formatDueDate(task.due_date)}
                                        </span>
                                        <label className="ml-auto inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={()=>handleTaskCompleted(task.id,task.completed)}
                                                className="h-4 w-4 rounded border-slate-300 text-slate-900"
                                            />
                                            Toggle
                                        </label>
                                        <button
                                            onClick={()=>handleDelete(task.id)}
                                            className="rounded-md border border-rose-200 bg-rose-50 p-1.5 text-rose-600 transition hover:bg-rose-100"
                                            aria-label="Delete task"
                                        >
                                            <MdDelete size={18} />
                                        </button>
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

export default Todo;