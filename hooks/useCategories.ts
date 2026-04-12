"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Category } from "@/lib/database.types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!error && data) {
        setCategories(data);
      }
      setLoading(false);
    }

    fetchCategories();

    const channel = supabase
      .channel("categories-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setCategories((prev) => {
              if (prev.some((c) => c.id === (payload.new as Category).id))
                return prev;
              return [...prev, payload.new as Category];
            });
          } else if (payload.eventType === "UPDATE") {
            setCategories((prev) =>
              prev.map((c) =>
                c.id === (payload.new as Category).id
                  ? (payload.new as Category)
                  : c
              )
            );
          } else if (payload.eventType === "DELETE") {
            setCategories((prev) =>
              prev.filter(
                (c) => c.id !== (payload.old as { id: string }).id
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

  const addCategory = useCallback(async (name: string) => {
    const maxOrder = await supabase
      .from("categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);
    const nextOrder =
      maxOrder.data && maxOrder.data.length > 0
        ? maxOrder.data[0].sort_order + 1
        : 0;

    const { error } = await supabase
      .from("categories")
      .insert({ name, sort_order: nextOrder });

    if (error) throw error;
  }, []);

  const renameCategory = useCallback(async (id: string, name: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c))
    );
    const { error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id);

    if (error) {
      throw error;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }, []);

  return { categories, loading, addCategory, renameCategory, deleteCategory };
}
