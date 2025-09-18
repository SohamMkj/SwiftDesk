import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";
import { MdDeleteForever } from "react-icons/md";

const TicketBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const firstLoad = useRef(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const notify = useCallback(
    (message) =>
      toast.success(`Ticket ${message} Successfully🎉`, {
        style: {
          border: "1px solid var(--color-primary)",
          padding: "14px",
          color: "var(--color-text)",
          backgroundColor: "var(--color-mainbg)",
        },
        iconTheme: {
          primary: "var(--color-secondary)",
          secondary: "white",
        },
      }),
    []
  );

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("localTickets")) || [];
    setTickets(stored);
  }, []);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    localStorage.setItem("localTickets", JSON.stringify(tickets));
  }, [tickets]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("ticketId", id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    const ticketId = e.dataTransfer.getData("ticketId");
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket || ticket.status === newStatus) return;

    const updated = tickets.map((t) =>
      t.id === ticketId ? { ...t, status: newStatus } : t
    );
    setTickets(updated);
    notify("status updated");
  };

  const handleDropDelete = (e) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData("ticketId");
    if (ticketId) openDeleteModal(ticketId);
  };

  const openDeleteModal = useCallback((ticketId) => {
    setDeleteId(ticketId);
    setIsModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsModalOpen(false);
    setDeleteId(null);
  }, []);

  const handleDelete = useCallback(() => {
    if (!deleteId) return;
    const updated = tickets.filter(
      (item) => String(item.id) !== String(deleteId)
    );
    setTickets(updated);
    localStorage.setItem("localTickets", JSON.stringify(updated));
    notify("Deleted");
    closeDeleteModal();
  }, [deleteId, tickets, notify, closeDeleteModal]);

  const handleAddComment = (ticketId) => {
    const commentText = newComment[ticketId]?.trim();
    if (!commentText) return;

    const updated = tickets.map(
      (t) =>
        t.id === ticketId
          ? {
              ...t,
              comments: [
                ...t.comments,
                {
                  text: commentText,
                  date: new Date().toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }),
                },
              ],
            }
          : t,
      notify("comment added")
    );

    setTickets(updated);
    setNewComment({ ...newComment, [ticketId]: "" });
  };

  const renderTicketCard = (ticket) => (
    <div
      key={ticket.id}
      draggable
      onDragStart={(e) => handleDragStart(e, ticket.id)}
      className="bg-card text-secondary rounded-xl shadow-md p-4 mb-4 hover:shadow-xl transition cursor-move w-full max-w-lg mx-auto"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center md:gap-2">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-700 text-white font-bold">
            {ticket.name?.[0]}
            {ticket.name?.[1]}
          </span>
          <div>
            <h3 className="md:font-semibold font-medium">
              {ticket.title.slice(0, 7)}
            </h3>
            <p className="text-sm">{ticket.id.slice(0, 6)}</p>
          </div>
        </div>
        <span
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
            ticket.priority === "High"
              ? "bg-red-100 text-red-700"
              : ticket.priority === "Medium"
              ? "bg-purple-100 text-purple-700"
              : "bg-teal-100 text-teal-700"
          }`}
        >
          <span
            className={`w-3 h-3 rounded-full ${
              ticket.priority === "High"
                ? "bg-red-500"
                : ticket.priority === "Medium"
                ? "bg-purple-500"
                : "bg-teal-500"
            }`}
          ></span>
          <span className="hidden md:inline">{ticket.priority}</span>
        </span>
      </div>

      <p className="flex justify-start items-center text-base mb-2">
        <span
          className={`inline-block w-4 h-4 rounded-full mr-2 ${
            ticket.status === "Open"
              ? "bg-blue-500"
              : ticket.status === "In Progress"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        ></span>
        {ticket.status}
      </p>

      <p className="text-base mb-3">
        {ticket.description.length > 15
          ? ticket.description.slice(0, 15) + "..."
          : ticket.description}
      </p>

      <div className="mb-3">
        <div className="flex justify-between items-center text-base font-semibold mb-1">
          <h4>Comments:</h4>
          <span>{ticket.comments.length}</span>
        </div>
        <div className="max-h-24 overflow-y-hidden">
          {ticket.comments.map((comm, index) => (
            <div
              key={index}
              className="bg-card px-2 py-1 text-sm text-secondary custom-scrollbar overflow-auto"
            >
              <p>{comm.text}</p>
              <p className="text-sm text-gray-500">{comm.date}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-2 mt-2">
          <input
            type="text"
            placeholder="Comment..."
            className="lg:flex-1 border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={newComment[ticket.id] || ""}
            onChange={(e) =>
              setNewComment({ ...newComment, [ticket.id]: e.target.value })
            }
          />
          <button
            onClick={() => handleAddComment(ticket.id)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 hover:cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
        <Link
          to={`/ticket/${ticket.id}`}
          className="bg-primary text-white hover:underline md:px-3 px-1 py-1 rounded-md text-sm"
        >
          Details
        </Link>
        <div className="font-semibold">{ticket.createdAt}</div>
      </div>
    </div>
  );

  const columns = ["Open", "In Progress", "Resolved"];

  return (
    <div className="relative">
      <div
        className="fixed md:top-4 bottom-8 right-[45%] md:right-2 w-14 h-14 flex items-center justify-center 
             bg-red-500/90 rounded-full shadow-xl text-white text-3xl 
             hover:bg-red-600 hover:scale-110 transition-all duration-300 
             border-2 border-white cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDropDelete}
      >
        <MdDeleteForever className="drop-shadow-md" size={30} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:mt-6 mt-10 md:mx-4 md:p-4">
        {columns.map((col) => (
          <section
            key={col}
            className={`p-4 rounded-3xl shadow-sm min-h-[80vh]`}
            style={{
              backgroundColor:
                col === "Open"
                  ? "var(--color-primary)"
                  : col === "In Progress"
                  ? "#fef9c3"
                  : "var(--color-secondary)",
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col)}
          >
            <h2 className="text-lg font-semibold mb-4 bg-gray-300 rounded-lg p-4">
              {col}
            </h2>
            {tickets
              .filter((t) => t.status === col)
              .map((ticket) => renderTicketCard(ticket))}
          </section>
        ))}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};
export default TicketBoard;
