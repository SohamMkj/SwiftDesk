import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegCreditCard, FaTable, FaRegCopy } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineInbox } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseFill } from "react-icons/ri";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [viewMode, setViewMode] = useState("cards");
  const [showOverview, setShowOverview] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedView = localStorage.getItem("View");
      if (storedView) {
        setViewMode(JSON.parse(storedView));
      } else {
        setViewMode("cards");
      }
    } catch (e) {
      console.error("Error parsing view mode:", e);
      setViewMode("cards");
      localStorage.removeItem("View");
    }

    const storedTickets =
      JSON.parse(localStorage.getItem("localTickets")) || [];
    setTickets(storedTickets);
  }, []);

  const handleView = () => {
    const newView = viewMode === "cards" ? "table" : "cards";
    setViewMode(newView);
    localStorage.setItem("View", JSON.stringify(newView));
  };

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

  const updateStatus = (id) => {
    const updated = tickets.map((item) =>
      item.id === id
        ? {
            ...item,
            status:
              item.status === "Open"
                ? "In Progress"
                : item.status === "In Progress"
                ? "Resolved"
                : "Open",
          }
        : item
    );
    setTickets(updated);
    localStorage.setItem("localTickets", JSON.stringify(updated));
    notify("status updated");
  };

  const filteredTickets = tickets.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" ? true : item.status === statusFilter;
    const matchPriority =
      priorityFilter === "All" ? true : item.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const copyToClipboard = (ticket) => {
    navigator.clipboard.writeText(ticket.id);
    notify("Id copied");
  };

  const statusCounts = {
    Open: tickets.filter((item) => item.status === "Open").length,
    "In Progress": tickets.filter((item) => item.status === "In Progress")
      .length,
    Resolved: tickets.filter((item) => item.status === "Resolved").length,
  };

  const priorityCounts = {
    Low: tickets.filter((item) => item.priority === "Low").length,
    Medium: tickets.filter((item) => item.priority === "Medium").length,
    High: tickets.filter((item) => item.priority === "High").length,
  };

  const priorityWeights = { Low: 1, Medium: 2, High: 3 };

  const totalWeighted = tickets.reduce(
    (sum, item) => sum + (priorityWeights[item.priority] || 1),
    0
  );

  const completedWeighted = tickets.reduce(
    (sum, item) =>
      item.status === "Resolved"
        ? sum + (priorityWeights[item.priority] || 1)
        : sum,
    0
  );

  const completionPercentage =
    totalWeighted === 0
      ? 0
      : Math.round((completedWeighted / totalWeighted) * 100);

  return (
    <div>
      <h2 className="lg:text-3xl md:text-2xl text-lg font-bold text-primary uppercase mt-4">
        Ticket Dashboard
      </h2>

      <div className="max-w-full min-w-[200px] sticky z-10 top-0 pt-4 pb-2 backdrop-blur-md bg-app/70 mx-auto">
        <div className="flex justify-between flex-wrap md:gap-4 gap-1 mb-6 items-center">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="priority-select border border-[var(--color-secondary)] rounded-lg flex-1 md:max-w-3xl text-base placeholder:text-base md:placeholder:font-semibold"
          />

          <div className="flex md:flex-row flex-col gap-2 md:justify-between md:items-center space-x-2 max-w-full mx-auto">
            <div className="flex md:justify-between justify-center items-center md:text-sm text-xs mx-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="priority-select border border-[var(--color-secondary)] sm:text-sm text-[10px] md:font-semibold"
              >
                <option value="All">Status Select</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="priority-select border border-[var(--color-secondary)] sm:text-sm text-[10px] md:font-semibold"
              >
                <option value="All">Priority Select</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex md:justify-between justify-center items-center space-x-2 text-nowrap">
              <button
                onClick={() => handleView()}
                className="bg-primary text-white sm:px-3 sm:py-2 px-1 py-1 md:rounded-lg md:text-sm text-xs font-semibold rounded-md hover:bg-secondary transition hover:cursor-pointer md:w-30"
              >
                {viewMode === "cards" ? (
                  <span className="flex items-center gap-1">
                    <FaTable /> Table View
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <FaRegCreditCard /> Card View
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowOverview(!showOverview)}
                className="bg-secondary text-white sm:px-3 sm:py-2 px-1 py-1 md:rounded-lg sm:text-sm text-[10px] font-semibold rounded-md hover:bg-primary transition hover:cursor-pointer md:w-36"
              >
                {showOverview ? "Hide Overview" : "Show Overview"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        {showOverview && (
          <div className="border border-[var(--color-secondary)] bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg space-y-4 mb-6 transition-transform duration-600">
            <div>
              <div className="flex justify-between items-center text-secondary font-semibold text-lg mb-2">
                <h3 className="flex items-center gap-2 lg:text-2xl md:text-xl text-base text-nowrap">
                  <span className="md:w-3 w-1 md:h-3 h-1 rounded-full bg-secondary animate-pulse"></span>
                  Task Completion
                </h3>
                <span className="md:text-xl text-base font-bold text-green-400">
                  {completionPercentage}%
                </span>
              </div>

              <div className="w-full bg-app/30 rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 shadow-md transition-all duration-700 ease-in-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>

              <p className="mt-1 lg:text-sm md:text-xs text-[10px] text-secondary text-right italic">
                {completedWeighted} of {totalWeighted} weighted points completed
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-app/60 px-6">
                <div className="flex justify-between items-center text-secondary font-semibold mb-2">
                  <h3 className="flex items-center gap-2 lg:text-xl text-sm text-nowrap">
                    <span className="md:w-3 w-1 md:h-3 h-1 rounded-full bg-secondary animate-pulse"></span>
                    By Status
                  </h3>
                  <span className="lg:text-lg md:text-base text-sm font-bold text-app">
                    {statusCounts.Open +
                      statusCounts.Resolved +
                      statusCounts["In Progress"]}
                  </span>
                </div>

                <div className="space-y-3 text-lg">
                  <p className="flex justify-between items-center md:text-sm text-xs">
                    <span className="text-app">Open</span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 font-bold">
                      {statusCounts.Open}
                    </span>
                  </p>
                  <p className="flex justify-between items-center md:text-sm text-xs">
                    <span className="text-app">In Progress</span>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 font-bold">
                      {statusCounts["In Progress"]}
                    </span>
                  </p>
                  <p className="flex justify-between items-center md:text-sm text-xs">
                    <span className="text-app">Resolved</span>
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 font-bold">
                      {statusCounts.Resolved}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-app/60 px-6">
                <div className="flex justify-between items-center text-secondary font-semibold mb-2">
                  <h3 className="flex items-center gap-2 lg:text-xl text-sm text-nowrap">
                    <span className="md:w-3 w-1 md:h-3 h-1 rounded-full bg-secondary animate-pulse"></span>
                    By Priority
                  </h3>
                  <span className="lg:text-lg md:text-base text-sm  font-bold text-app">
                    {priorityCounts.Low +
                      priorityCounts.Medium +
                      priorityCounts.High}
                  </span>
                </div>

                <div className="space-y-3 text-lg">
                  <p className="flex justify-between items-center md:text-sm text-xs">
                    <span className="text-app">Low</span>
                    <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-500 font-bold">
                      {priorityCounts.Low}
                    </span>
                  </p>
                  <p className="flex justify-between items-center md:text-sm text-xs">
                    <span className="text-app">Medium</span>
                    <span className="px-3 py-1 rounded-full bg-yellow-600/20 text-yellow-500 font-bold">
                      {priorityCounts.Medium}
                    </span>
                  </p>
                  <p className="flex justify-between items-center md:text-sm text-xs">
                    <span className="text-app">High</span>
                    <span className="px-3 py-1 rounded-full bg-red-600/20 text-red-500 font-bold">
                      {priorityCounts.High}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-secondary font-semibold text-3xl relative flex flex-col items-center justify-center">
          <div className="mt-15">
            <AiOutlineInbox size={80} />
          </div>
          No tickets found !
          {tickets.length === 0 && (
            <Link
              to={`/ticket`}
              className="bg-primary text-center text-white px-4 py-2 rounded-lg text-sm hover:bg-secondary transition hover:cursor-pointer mt-4"
            >
              Add Ticket
            </Link>
          )}
        </div>
      ) : (
        <div key={viewMode} className="animate-fadeScale">
          {" "}
          {viewMode === "cards" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6 relative">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="relative bg-app border border-[var(--color-secondary)] md:rounded-2xl rounded-lg md:p-5 p-3 flex flex-col hover:shadow-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4
                      className="text-sm font-medium text-secondary flex items-center gap-2 select-text cursor-pointer"
                      onDoubleClick={() => copyToClipboard(ticket)}
                      title="Double click to copy ID"
                    >
                      <span className="text-base text-secondary">ID-</span>{" "}
                      {ticket.id.length > 15
                        ? ticket.id.slice(0, 15) + "..."
                        : ticket.id}
                      <FaRegCopy
                        className="ml-1 cursor-pointer hover:text-primary"
                        onClick={() => copyToClipboard(ticket)}
                        title="Click to copy ID"
                        size={16}
                      />
                    </h4>

                    <div className="relative">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(
                            openDropdown === ticket.id ? null : ticket.id
                          );
                        }}
                        className="text-secondary text-xl px-2 hover:text-app hover:cursor-pointer"
                      >
                        {openDropdown === ticket.id ? (
                          <RiCloseFill />
                        ) : (
                          <BsThreeDotsVertical />
                        )}
                      </div>

                      {openDropdown === ticket.id && (
                        <div className="absolute priority-select p-0 right-0 mt-2 w-40 rounded-lg shadow-xl text-sm z-50 overflow-hidden animate-fade-in">
                          <button
                            onClick={() => {
                              updateStatus(ticket.id);
                              setOpenDropdown(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-yellow-500 hover:text-white transition hover:cursor-pointer"
                          >
                            Update Status
                          </button>
                          <button
                            onClick={() => {
                              openDeleteModal(ticket.id);
                              setOpenDropdown(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition hover:cursor-pointer"
                          >
                            Delete Ticket
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="xl:text-2xl :text-xl font-bold text-secondary mb-3 overflow-auto custom-scrollbar">
                    {ticket.title}
                  </h3>

                  <div className="flex xl:flex-row flex-col xl:justify-between justify-start gap-2 xl:items-center mb-3 md:text-base text-sm">
                    <span className="font-semibold text-secondary">
                      <span>By-</span> {ticket.name}
                    </span>

                    <span className="font-semibold md:text-lg text-base">
                      <span className="text-secondary">Status-</span>{" "}
                      <span
                        className={`${
                          ticket.status === "Resolved"
                            ? "text-green-500"
                            : ticket.status === "In Progress"
                            ? "text-yellow-500"
                            : "text-blue-500"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </span>
                  </div>

                  <div className="text-sm text-secondary mb-3 relative group">
                    <span className="absolute left-0 -top-12 max-w-full hidden rounded-md bg-gray-900 text-white text-xs p-2 shadow-lg group-hover:block z-50">
                      {ticket.description}
                      <div className="absolute left-4 top-full text-gray-600 text-lg">
                        <IoIosArrowDown />
                      </div>
                    </span>
                    <span>Description-</span>{" "}
                    {ticket.description.length > 25
                      ? ticket.description.slice(0, 25) + "..."
                      : ticket.description}
                  </div>

                  <p className="md:text-lg text-base font-semibold mb-3">
                    <span className="text-secondary">Priority-</span>{" "}
                    <span
                      className={`${
                        ticket.priority === "High"
                          ? "text-red-500"
                          : ticket.priority === "Medium"
                          ? "text-purple-500"
                          : "text-teal-500"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </p>

                  <p className="text-sm text-secondary mb-4 text-nowrap">
                    <span>Created On-</span> {ticket.createdAt}
                  </p>

                  <div className="flex lg:justify-start justify-center mt-auto">
                    <Link
                      to={`/ticket/${ticket.id}`}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-secondary transition hover:cursor-pointer font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto max-w-full text-nowrap custom-scrollbar border border-[var(--color-secondary)] md:rounded-xl rounded-md mb-4">
              <table className="min-w-full md:text-base text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="md:p-3 p-1 text-center md:text-xl text-base">
                      Sl.No
                    </th>
                    <th className="md:p-3 p-1 text-center md:text-xl text-base">
                      ID
                    </th>
                    <th className="md:p-3 p-1 text-center md:text-xl text-base">
                      Title
                    </th>
                    <th className="md:p-3 p-1 text-center md:text-xl text-base">
                      By
                    </th>
                    <th className="md:p-3 p-1 text-center md:text-xl text-base">
                      Priority
                    </th>
                    <th className="md:p-3 p-1 text-center md:text-xl text-base">
                      Status
                    </th>
                    <th className="md:p-3 p-1 text-center md:text-xl text-base">
                      Created
                    </th>
                    <th className="md:p-3 p-1 text-center md:text-xl text-base">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((ticket, index) => (
                    <tr
                      key={ticket.id}
                      className="border-t border-[var(--color-secondary)] bg-app text-secondary hover:cursor-pointer text-center"
                    >
                      <td
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                        className="md:p-2 p-1"
                      >
                        {index + 1}
                      </td>
                      <td className="md:p-3 p-1 relative">
                        <div className="flex gap-2">
                          <span className="group relative">
                            <span
                              onDoubleClick={() => copyToClipboard(ticket)}
                              className="cursor-pointer select-none inline-block px-1"
                            >
                              {ticket.id.length > 9
                                ? ticket.id.slice(0, 8) + "..."
                                : ticket.id}
                            </span>

                            <div className="absolute left-0 -top-12 w-65 hidden rounded-md bg-gray-900 text-white text-xs p-2 shadow-lg group-hover:block z-50 pointer-events-none">
                              {ticket.id}
                              <div className="absolute left-4 top-full text-gray-600 text-lg">
                                <IoIosArrowDown />
                              </div>
                            </div>
                          </span>

                          <FaRegCopy
                            className="ml-1 cursor-pointer hover:text-primary"
                            onClick={() => copyToClipboard(ticket)}
                            title="Click to copy ID"
                            size={16}
                          />
                        </div>
                      </td>

                      <td
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                        className="md:p-3 p-1"
                      >
                        {ticket.title}
                      </td>
                      <td
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                        className="md:p-3 p-1"
                      >
                        {ticket.name}
                      </td>
                      <td
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                        className={`md:p-3 p-1 ${
                          ticket.priority === "High"
                            ? "text-red-500"
                            : ticket.priority === "Medium"
                            ? "text-purple-500"
                            : "text-teal-500"
                        }`}
                      >
                        {ticket.priority}
                      </td>
                      <td
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                        className={`md:p-3 p-1 ${
                          ticket.status === "Resolved"
                            ? "text-green-500"
                            : ticket.status === "In Progress"
                            ? "text-yellow-500"
                            : "text-blue-500"
                        }`}
                      >
                        {ticket.status}
                      </td>
                      <td
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                        className="md:p-3 p-1"
                      >
                        {ticket.createdAt}
                      </td>
                      <td className="md:p-3 p-1 flex items-center justify-around relative">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(
                              openDropdown === ticket.id ? null : ticket.id
                            );
                          }}
                          className="text-secondary text-xl px-2 hover:text-app hover:cursor-pointer"
                        >
                          {openDropdown === ticket.id ? (
                            <RiCloseFill />
                          ) : (
                            <BsThreeDotsVertical />
                          )}
                        </div>

                        {openDropdown === ticket.id && (
                          <div className="absolute priority-select p-0 right-10 md:right-16 top-0 mt-2 w-40 rounded-lg shadow-xl text-sm z-50 overflow-hidden animate-fade-in">
                            <button
                              onClick={() => {
                                updateStatus(ticket.id);
                                setOpenDropdown(null);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-yellow-500 hover:text-white hover:cursor-pointer transition"
                            >
                              Update Status
                            </button>
                            <button
                              onClick={() => {
                                openDeleteModal(ticket.id);
                                setOpenDropdown(null);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white hover:cursor-pointer transition"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}
