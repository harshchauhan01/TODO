import { Link } from "react-router-dom";

const Home=()=>{
    return(
        <main className="page-wrap pb-16 pt-10 sm:pt-14">
            <section className="glass-panel rise-in relative overflow-hidden rounded-3xl px-6 py-12 sm:px-12 sm:py-16">
                <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-sky-100/80 blur-2xl" />
                <div className="absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-emerald-100/80 blur-2xl" />

                <p className="mb-4 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
                    Productivity Suite
                </p>
                <h1 className="max-w-2xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                    Manage tasks and time with a polished, focused workspace.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                    Stay on top of priorities, track deadlines, and use the integrated chronograph tools without leaving your dashboard.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                        to="/todo"
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-700"
                    >
                        Open Task Manager
                    </Link>
                    <Link
                        to="/clock"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
                    >
                        Explore Clock Tools
                    </Link>
                </div>
            </section>
        </main>
    )
};
export default Home;