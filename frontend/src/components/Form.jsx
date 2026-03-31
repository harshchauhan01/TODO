import React, { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useOfflineStatus } from "../hooks/useOffline";
import { saveTask, addToSyncQueue } from "../utils/db";

const baseInputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200";

const CustomForm = ({ onSuccess, onCancel, user }) => {
  const [formData, setFormData] = useState({
    title: "",
    priority: "",
    due_date: "",
    completed: false,
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const isOnline = useOfflineStatus();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        completed: formData.completed,
        priority: formData.priority === "" ? 1 : Number(formData.priority),
        due_date: formData.due_date
          ? new Date(`${formData.due_date}T00:00:00`).toISOString()
          : null,
      };

      if (!isOnline) {
        // Save offline with user ID
        const tempId = `temp_${Date.now()}`;
        const offlineTask = { 
          ...payload, 
          id: tempId, 
          user: user?.id,
          synced: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await saveTask(offlineTask);
        await addToSyncQueue('create', payload);
        toast.success("Task saved offline (will sync when online)");
      } else {
        // Save online
        await api.post("/api/todo/", payload);
        toast.success("Task created successfully");
      }

      setFormData({
        title: "",
        priority: "",
        due_date: "",
        completed: false,
        content: "",
      });

      onSuccess?.();
    } catch (err) {
      const responseError = err?.response?.data;
      if (typeof responseError === "string") {
        setSubmitError(responseError);
      } else if (responseError && typeof responseError === "object") {
        const firstMessage = Object.values(responseError).flat()[0];
        setSubmitError(firstMessage || "Failed to save task.");
      } else {
        setSubmitError("Failed to save task.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/85 p-5 shadow-lg backdrop-blur-sm sm:p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">New Task</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">Create an action item</h3>
        </div>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              📱 Offline
            </span>
          )}
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Fast Entry
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Task Title</label>
          <input
            type="text"
            className={baseInputClass}
            placeholder="Design sprint planning"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Priority</label>
          <input
            type="number"
            min="1"
            className={baseInputClass}
            placeholder="1"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Due Date</label>
          <input
            type="date"
            className={baseInputClass}
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
          <textarea
            className={`${baseInputClass} min-h-[115px] resize-y`}
            placeholder="Write details for this task..."
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <label className="sm:col-span-2 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
          />
          Mark as completed immediately
        </label>

        {submitError && (
          <p className="sm:col-span-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {submitError}
          </p>
        )}

        <div className="sm:col-span-2 flex flex-wrap justify-end gap-3 pt-2">
          <button
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomForm;
