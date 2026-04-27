"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Task } from "@/lib/database.types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!error && data) {
        setTasks(data);
      }
      setLoading(false);
    }

    fetchTasks();

    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((prev) => {
              if (prev.some((t) => t.id === (payload.new as Task).id))
                return prev;
              return [...prev, payload.new as Task];
            });
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((t) =>
                t.id === (payload.new as Task).id
                  ? (payload.new as Task)
                  : t
              )
            );
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) =>
              prev.filter(
                (t) => t.id !== (payload.old as { id: string }).id
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addTask = useCallback(
    async (categoryId: string, title: string) => {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const optimisticTask: Task = {
        id,
        category_id: categoryId,
        title,
        notes: null,
        status: "not_started",
        assigned_to: null,
        due_date: null,
        completed_by: null,
        completed_at: null,
        sort_order: 0,
        created_at: now,
        updated_at: now,
      };

      setTasks((prev) => [...prev, optimisticTask]);

      const { error } = await supabase.from("tasks").insert({
        id,
        category_id: categoryId,
        title,
      });

      if (error) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        throw error;
      }
    },
    []
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      const finalUpdates = { ...updates };

      if (updates.status === "done") {
        finalUpdates.completed_at = new Date().toISOString();
      } else if (updates.status) {
        finalUpdates.completed_at = null;
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...finalUpdates } : t))
      );

      const { error } = await supabase
        .from("tasks")
        .update(finalUpdates)
        .eq("id", id);

      if (error) {
        const { data } = await supabase
          .from("tasks")
          .select("*")
          .eq("id", id)
          .single();
        if (data) {
          setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
        }
        throw error;
      }
    },
    []
  );

  const deleteTask = useCallback(async (id: string) => {
    const prev = tasks;
    setTasks((current) => current.filter((t) => t.id !== id));

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      setTasks(prev);
      throw error;
    }
  }, [tasks]);

  return { tasks, loading, addTask, updateTask, deleteTask };
}
