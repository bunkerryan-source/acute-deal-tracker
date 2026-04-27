"use client";

import { useState } from "react";
import { Category, Task } from "@/lib/database.types";
import CategoryHeader from "./CategoryHeader";
import TaskRow from "./TaskRow";
import AddTaskInput from "./AddTaskInput";
import ConfirmDialog from "./ConfirmDialog";

interface CategorySectionProps {
  category: Category;
  tasks: Task[];
  expandedTaskId: string | null;
  onToggleTaskExpand: (taskId: string) => void;
  onAddTask: (categoryId: string, title: string) => Promise<void>;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onRenameCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
}

export default function CategorySection({
  category,
  tasks,
  expandedTaskId,
  onToggleTaskExpand,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onRenameCategory,
  onDeleteCategory,
}: CategorySectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const canDelete = tasks.length === 0;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="overflow-hidden rounded-md border border-ink-10 bg-white">
      <CategoryHeader
        name={category.name}
        doneCount={doneCount}
        totalCount={tasks.length}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onRename={(newName) => onRenameCategory(category.id, newName)}
        onDelete={() => setShowDeleteConfirm(true)}
        canDelete={canDelete}
      />

      <div
        className="grid transition-all duration-200"
        style={{ gridTemplateRows: isCollapsed ? "0fr" : "1fr" }}
      >
        <div className="overflow-hidden">
          {tasks.length > 0 ? (
            <div>
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className={idx > 0 ? "border-t border-ink-06" : ""}
                >
                  <TaskRow
                    task={task}
                    isExpanded={expandedTaskId === task.id}
                    onToggleExpand={() => onToggleTaskExpand(task.id)}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-6 text-center mono-label">No tasks yet</div>
          )}
          <AddTaskInput onAdd={(title) => onAddTask(category.id, title)} />
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Category"
          message={
            canDelete
              ? `Delete "${category.name}"? This cannot be undone.`
              : `"${category.name}" still has tasks. Remove all tasks first.`
          }
          confirmLabel={canDelete ? "Delete" : "OK"}
          onConfirm={() => {
            if (canDelete) {
              onDeleteCategory(category.id);
            }
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
