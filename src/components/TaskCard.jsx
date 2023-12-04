import Delete from "../icons/Delete";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
function TaskCard({ task, deleteTask, updateTask }) {
  const [isHovered, setIsHovered] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setIsHovered(false);
  };
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        
      bg-blue-800 opacity-30 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2  cursor-grab relative
      "
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative bg-blue-800 bg-opacity-25 p-2 h-24 min-h-[100px] flex items-center text-left rounded-sm hover:ring-inset hover:ring-2 hover:ring-blue-500 cursor-grab"
      >
        <textarea
          value={task.content}
          placeholder="Enter your tasks here"
          autoFocus
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => {
            updateTask(task.id, e.target.value);
          }}
          className="w-full h-20 resize-none border-none rounded bg-transparent text-white focus:outline-none"
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-blue-800 bg-opacity-25 p-2 h-20 min-h-[90px] rounded-lg flex items-center text-left hover:ring-inset hover:ring-2 hover:ring-blue-500 cursor-grab"
    >
      <div className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </div>

      {isHovered && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-red-500 absolute right-5 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
        >
          <Delete />
        </button>
      )}
    </div>
  );
}

TaskCard.propTypes = {
  deleteTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
};

export default TaskCard;
