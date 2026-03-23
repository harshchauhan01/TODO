import { useEffect, useState } from "react";
import CustomForm from "./Form";
import axios from "axios";
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
    const currData=data.slice(startIndex,startIndex+itemsPerPage);
    const totalPages=data.length===0?0:Math.ceil(data.length/itemsPerPage);
    

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
            const url=`http://127.0.0.1:8000/api/todo/${i}/`;
            await axios.delete(url);
            await fetchTasks();
            toast.success("Task deleted successfully.")
        }catch(error){
            toast.error(error);
        }
    };

    const handleTaskCompleted=async(id,comp)=>{
        try{
            await axios.post(`http://127.0.0.1:8000/api/todo/${id}/mark_complete/`);
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
                            className="cursor-pointer h-11 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            {showForm ? "Hide Form" : "Add Task"}
                        </button>
                    </div>
                </section>

                {showForm && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <CustomForm onSuccess={handleTaskCreated} onCancel={() => setShowForm(false)} />
                    </section>
                )}

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">Your Tasks</h2>
                        <div className="flex items-center gap-3 mt-4">
                            <button
                                disabled={currPage === 1}
                                onClick={() => setcurrPage(currPage - 1)}
                                className={`flex items-center justify-center w-9 h-9 rounded-lg border
                                ${currPage === 1 
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"}
                                `}
                            >
                                <MdChevronLeft size={20} />
                            </button>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                {currData.length} {currData.length === 1 ? "task" : "tasks"}
                            </span>

                            <button
                                disabled={currPage === totalPages}
                                onClick={() => setcurrPage(currPage + 1)}
                                className={`flex items-center justify-center w-9 h-9 rounded-lg border
                                ${currPage === totalPages 
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"}
                                `}
                            >
                                <MdChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {loading && <p className="text-sm text-slate-500">Loading tasks...</p>}
                    {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

                    {!loading && !error && currData.length === 0 && (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                            No tasks yet. Use Add Task to create your first one.
                        </div>
                    )}

                    {!loading && !error && data.length > 0 && (
                        <ul className="space-y-3">
                            {currData.map((task) => (
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
                                        <input type="checkbox" checked={task.completed} onChange={()=>handleTaskCompleted(task.id,task.completed)}/>
                                        <button onClick={()=>handleDelete(task.id)} className="cursor-pointer text-red-500 hover:text-red-700 transition">
                                            <MdDelete size={20} />
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