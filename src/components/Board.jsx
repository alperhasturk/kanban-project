import Plus from "../icons/Plus";
import ColContainer from "./ColContainer";
import { DndContext, DragOverlay, PointerSensor, useSensors, useSensor } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const defaultCols = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Work in progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

function Board() {
  const [columns, setColumns] = useState(defaultCols);
  const [tasks, setTasks] = useState([]);
  const [activeId, setActiveId] = useState([]);
  const [activeTask, setActiveTask] = useState([]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  return (
    <div className="m-auto overflow-x-auto overflow-y-hidden items-center px-10 flex min-h-screen w-full">
      <DndContext
        sensors={sensors}
        onDragStart={dragStart}
        onDragEnd={dragEnd}
        onDragOver={dragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-6">
            <SortableContext items={columns.map((col) => col.id)}>
              {columns.map((col, index) => (
                <ColContainer
                  key={index}
                  col={col}
                  deleteCol={deleteCol}
                  updateCol={updateCol}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  createTask={() => createTask(col.id)}
                  tasks={tasks.filter((task) => task.colId === col.id)}
                />
              ))}
            </SortableContext>
          </div>

          <button
            onClick={() => {
              createColumn();
            }}
            className="w-[350px] h-[500px] max-h-[500px] flex gap-2 items-center justify-center font-bold text-xl cursor-pointer rounded-lg border-2 border-cyan-500 p-4 bg-bg ring-offset-green-400 hover:ring-2"
          >
            <Plus />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeId && (
              <ColContainer
                col={columns.find((col) => col.id === activeId)}
                deleteCol={deleteCol}
                updateCol={updateCol}
                deleteTask={deleteTask}
                updateTask={updateTask}
                createTask={() => createTask(activeId)}
                tasks={tasks.filter((task) => task.colId === activeId)}
              />
            )}
            {activeTask && (
              <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createColumn() {
    const columnAdd = {
      id: Math.floor(Math.random() * 1000),
      title: "Column " + (columns.length + 1),
    };
    setColumns([...columns, columnAdd]);
  }
  function createTask(colId) {
    const newTask = {
      id: Math.floor(Math.random() * 1000),
      colId: colId,
      content: "Task " + (tasks.length + 1),
    };
    setTasks([...tasks, newTask]);
  }

  function deleteCol(id) {
    const newColumns = columns.filter((col) => col.id !== id);
    setColumns(newColumns);
    const newTasks = tasks.filter((task) => task.colId !== id);
    setTasks(newTasks);
  }
  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }
  function updateTask(id, content) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }
  function updateCol(id, updatedTitle) {
    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((col) => {
        if (col.id !== id) {
          return col;
        }
        return {
          ...col,
          title: updatedTitle,
        };
      });
      return updatedColumns;
    });
  }

  function dragStart(event) {
    if (event.active.id !== activeId) {
      setActiveId(event.active.id);
    }
    if (event.active.id !== activeTask) {
      setActiveTask(event.active.id);
    }
  }
  function dragEnd(event) {
    if (!event.active || !event.over) return;

    const oldIndex = columns.findIndex((col) => col.id === event.active.id);
    const newIndex = columns.findIndex((col) => col.id === event.over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedColumns = arrayMove(columns, oldIndex, newIndex);

    setColumns(reorderedColumns);
    setActiveId(null);
  }

  function dragOver(event) {
    if (!event.active || !event.over) return;

    const isOverAColumn = columns.some((col) => col.id === event.over.id);
    if (isOverAColumn) {
      const taskToMove = tasks.find((task) => task.id === event.active.id);

      if (taskToMove) {
        const updatedTasks = tasks.map((task) =>
          task.id === taskToMove.id ? { ...task, colId: event.over.id } : task
        );
        setTasks(updatedTasks);
      }
    }

    const oldIndex = tasks.findIndex((task) => task.id === event.active.id);
    const newIndex = tasks.findIndex((task) => task.id === event.over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(reorderedTasks);
    }
    setActiveTask(null);
  }
}
export default Board;
