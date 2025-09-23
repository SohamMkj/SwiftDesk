import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    priority: "Low",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("localTickets")) || [];
    setTickets(stored);
    const foundTicket = stored.find((item) => String(item.id) === String(id));
    setTicket(foundTicket || null);
  }, [id]);

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

  const handleStatusChange = (e) => {
    const updatedStatus = e.target.value;

    const updatedTickets = tickets.map((item) =>
      String(item.id) === String(id) ? { ...item, status: updatedStatus } : item
    );

    setTickets(updatedTickets);
    localStorage.setItem("localTickets", JSON.stringify(updatedTickets));

    setTicket({ ...ticket, status: updatedStatus });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const updatedCommentHistory = [
      ...(ticket.comments || []),
      {
        text: newComment,
        date: new Date().toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      },
    ];

    const updatedTickets = tickets.map((item) =>
      String(item.id) === String(id)
        ? { ...item, comments: updatedCommentHistory }
        : item
    );

    setTickets(updatedTickets);
    localStorage.setItem("localTickets", JSON.stringify(updatedTickets));
    setTicket({ ...ticket, comments: updatedCommentHistory });
    notify("comment added");
    setNewComment("");
  };

  const handleEditComment = (index) => {
    const updated = [...ticket.comments];
    updated[index] = {
      ...updated[index],
      isEditing: true,
      editText: updated[index].text,
    };
    setTicket({ ...ticket, comments: updated });
  };

  const handleSaveComment = (index) => {
    const updated = [...ticket.comments];
    updated[index] = {
      ...updated[index],
      text: updated[index].editText,
      isEditing: false,
      editText: undefined,
    };

    const updatedTickets = tickets.map((item) =>
      String(item.id) === String(id) ? { ...item, comments: updated } : item
    );
    setTickets(updatedTickets);
    localStorage.setItem("localTickets", JSON.stringify(updatedTickets));
    setTicket({ ...ticket, comments: updated });
    notify("comment edited");
  };

  const handleDeleteComment = (index) => {
    const updated = ticket.comments.filter((_, item) => item !== index);

    const updatedTickets = tickets.map((item) =>
      String(item.id) === String(id) ? { ...item, comments: updated } : item
    );
    setTickets(updatedTickets);
    localStorage.setItem("localTickets", JSON.stringify(updatedTickets));
    setTicket({ ...ticket, comments: updated });
    notify("comment deleted");
  };

  const openDeleteModal = useCallback(() => setIsModalOpen(true), []);
  const closeDeleteModal = useCallback(() => setIsModalOpen(false), []);

  const handleDelete = useCallback(() => {
    const updated = tickets.filter((item) => String(item.id) !== String(id));
    setTickets(updated);
    localStorage.setItem("localTickets", JSON.stringify(updated));
    navigate("/");
    notify("Deleted");
    closeDeleteModal();
  }, [id, tickets, setTickets, navigate, notify, closeDeleteModal]);

  const handleEdit = () => {
    setEditData({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
    });
    setIsEditing(true);
  };

  const handleEditSave = () => {
    const updatedTickets = tickets.map((item) =>
      String(item.id) === String(id) ? { ...item, ...editData } : item
    );

    setTickets(updatedTickets);
    localStorage.setItem("localTickets", JSON.stringify(updatedTickets));
    setTicket({ ...ticket, ...editData });
    setIsEditing(false);
    notify("Edited");
  };

  if (!ticket) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-red-600">Ticket not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 md:rounded-lg rounded-md text-app bg-card relative">
      {isEditing && (
        <div className="flex flex-col items-center justify-center">
          <div className="p-6 w-full h-full">
            <h2 className="lg:text-3xl md:text-2xl text-xl text-center font-bold mb-4 underline">
              Edit Ticket
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-semibold mb-2 mt-4">
                  Title
                </label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className="focus:outline-none w-full md:px-3 px-1 md:py-2 py-1 rounded border border-[var(--color-primary)] md:text-base text-sm"
                />
                {(!editData.title || editData.title.length < 3) && (
                  <p className="text-red-500 text-xs mt-1">
                    Title must be at least 3 characters long.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-base font-semibold mb-2 mt-4">
                  Description
                </label>
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="focus:outline-none w-full rounded md:px-3 px-1 md:py-2 py-1 md:h-32 h-20 resize-none border border-[var(--color-primary)] md:text-base text-sm"
                />
                {(!editData.description ||
                  editData.description.length < 10) && (
                  <p className="text-red-500 text-xs mt-1">
                    Description must be at least 10 characters long.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-base font-semibold mb-2 mt-4">
                  Priority
                </label>
                <select
                  value={editData.priority}
                  onChange={(e) =>
                    setEditData({ ...editData, priority: e.target.value })
                  }
                  className="focus:outline-none priority-select w-full border md:px-3 md:py-2 rounded md:text-base text-sm"
                >
                  <option value="">Select Priority</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                {!editData.priority && (
                  <p className="text-red-500 text-xs mt-1">
                    Please select a priority.
                  </p>
                )}
              </div>
            </div>
            <div className="flex md:justify-end justify-center gap-2 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="md:px-4 px-2 md:py-2 py-1 text-black bg-red-500 rounded hover:bg-red-600 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (
                    editData.title &&
                    editData.title.length >= 3 &&
                    editData.description &&
                    editData.description.length >= 10 &&
                    editData.priority
                  ) {
                    handleEditSave();
                  }
                }}
                className="md:px-4 px-2 md:py-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {!isEditing && (
        <>
          <div className="flex justify-between">
            <h1 className="lg:text-3xl md:text-2xl text-xl text-primary font-bold mb-4 underline">
              Ticket Details
            </h1>
            <div className="flex gap-2">
              <div className="relative group">
                <div
                  onClick={handleEdit}
                  className="text-app md:text-2xl text-lg hover:cursor-pointer"
                >
                  <FaEdit />
                </div>
                <span
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                     bg-primary text-white text-xs rounded px-2 py-1 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  Edit
                </span>
              </div>

              <div className="relative group">
                <div
                  onClick={openDeleteModal}
                  className="text-app md:text-2xl text-lg hover:cursor-pointer"
                >
                  <MdDeleteForever />
                </div>
                <span
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                     bg-primary text-white text-xs rounded px-2 py-1 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  Delete
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <p className="md:text-lg text-base overflow-auto custom-scrollbar">
              <span className="font-bold">Title:</span> {ticket.title}
            </p>
            <p className="md:text-lg text-base overflow-auto custom-scrollbar">
              <span className="font-bold">ID:</span> {id}
            </p>
            <p className="md:text-lg text-base overflow-auto custom-scrollbar">
              <span className="font-bold">By:</span>
              {ticket.name}
            </p>
            <p className="md:text-lg text-base overflow-auto custom-scrollbar">
              <span className="font-bold">Description:</span>{" "}
              <span className="overflow-auto custom-scrollbar">
                {ticket.description}
              </span>
            </p>
            <p className="md:text-lg text-base overflow-auto custom-scrollbar">
              <span className="font-bold">Priority:</span> {ticket.priority}
            </p>
            <p className="md:text-lg text-base overflow-auto custom-scrollbar">
              <span className="font-bold">Created On:</span>{" "}
              {ticket.createdAt || "N/A"}
            </p>
            <p>
              <span className="md:text-lg text-base font-bold">Status:</span>
              <select
                value={ticket.status}
                onChange={handleStatusChange}
                className="focus:border-none border priority-select p-1 rounded md:text-base text-sm"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </p>
          </div>

          <div className="mt-6">
            <h2 className="md:text-lg text-base font-bold mb-2">
              Comment History
            </h2>
            <div className="space-y-2 mb-4 max-h-30 overflow-y-auto border-0 p-2 rounded custom-scrollbar shadow-sm">
              {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map((comment, index) => (
                  <div
                    key={index}
                    className="border-b pb-2 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      {comment.isEditing ? (
                        <input
                          type="text"
                          value={comment.editText}
                          onChange={(e) => {
                            const updated = [...ticket.comments];
                            updated[index].editText = e.target.value;
                            setTicket({ ...ticket, comments: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-[var(--color-primary)] text-sm"
                        />
                      ) : (
                        <p className="text-sm">{comment.text}</p>
                      )}
                      <span className="text-xs">{comment.date}</span>
                    </div>

                    <div className="flex gap-2 ml-2">
                      {comment.isEditing ? (
                        <button
                          onClick={() => handleSaveComment(index)}
                          className="text-green-700 bg-green-100 rounded-md p-1 hover:cursor-pointer text-xs hover:underline"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditComment(index)}
                          className="text-blue-700 bg-blue-100 rounded-md p-1 hover:cursor-pointer text-xs hover:underline"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteComment(index)}
                        className="text-red-700 bg-red-100 rounded-md p-1 hover:cursor-pointer  text-xs hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="">No comments yet.</p>
              )}
            </div>

            <div className="flex md:flex-row flex-col gap-2">
              <div className="flex-1 flex flex-col">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onBlur={() => setIsTouched(true)} 
                  placeholder="Add a comment..."
                  className="flex-1 md:px-3 md:py-2 px-2 py-1 rounded border-none priority-select focus:border-none"
                />
                {isTouched && (!newComment || newComment.trim().length < 3) && (
                  <p className="text-red-500 text-xs mt-1">
                    Comment must be at least 3 characters long.
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  setIsTouched(true);
                  if (newComment && newComment.trim().length >= 3) {
                    handleAddComment();
                    setNewComment("");
                    setIsTouched(false);
                  }
                }}
                className="bg-primary text-white md:px-4 md:py-2 px-2 py-1 md:text-base text-sm rounded hover:bg-secondary hover:cursor-pointer h-10"
              >
                Add
              </button>
            </div>
          </div>
        </>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};

export default TicketDetails;
