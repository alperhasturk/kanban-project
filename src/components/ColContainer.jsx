import PropTypes from "prop-types";
import Delete from "../icons/Delete";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { useMemo } from "react";
import TaskCard from "./TaskCard";
import Plus from "../icons/Plus";

function ColContainer({
  col = {},
  deleteCol,
  updateCol,
  tasks = [],
  createTask,
  deleteTask,
  updateTask,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: col.id,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const [editMode, setEditMode] = useState(false);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="bg-bg  w-[350px] h-[500px] max-h-[500px] rounded-lg opacity-0"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-bg border-blue-800 border-2 border-opacity-90 w-[450px] h-[550px] max-h-[500px] flex flex-col rounded-xl"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="bg-bg flex items-center justify-between text-md p-3 cursor-grab rounded-md rounded-b-none border-y-2 pb-5 font-bold border-blue-800 border-opacity-90"
      >
        <div className="flex gap-2">
          <div className="flex items-center justify-center px-2 py-1 text-sm"></div>
          {!editMode && col.title}
          {editMode && (
            <input
              className="bg-bg font-bold focus:border-green-500 border-2"
              value={col.title}
              onChange={(e) => updateCol(col.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteCol(col.id);
          }}
          className="stroke-gray-500 px-1 py-2 hover:stroke-red-500 "
        >
          <Delete />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskIds}>
          {tasks &&
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
            ))}
        </SortableContext>
      </div>
      <button
        onClick={() => {
          createTask(col.id);
        }}
        className="flex gap-2 items-center border-2 border-bg p-2 border-t-blue-500 border-opacity-20 hover:bg-bg  ring-offset-blue-500 hover:ring-2 hover:text-blue-500 active:bg-blue-800 active:bg-opacity-20"
      >
        <Plus /> Add Task
      </button>
    </div>
  );
}

ColContainer.propTypes = {
  col: PropTypes.object.isRequired,
  deleteCol: PropTypes.func.isRequired,
  updateCol: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  createTask: PropTypes.func.isRequired,
  tasks: PropTypes.array.isRequired,
};

export default ColContainer;
