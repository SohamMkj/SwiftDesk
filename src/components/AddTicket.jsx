import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const notify = () =>
  toast.success(`Ticket Created Successfully🎉`, {
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
  });

export default function AddTicket() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("localTickets")) || [];
    setTickets(stored);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (title.trim().length < 3)
      newErrors.title = "Title must be at least 3 characters.";

    if (!name.trim()) newErrors.name = "Name is required.";
    if (name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters.";

    if (!description.trim()) newErrors.description = "Description is required.";
    if (description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newTicket = {
      id: uuidv4(),
      title,
      name,
      description,
      priority,
      status: "Open",
      createdAt: new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      comments: [],
    };
    const add = [...tickets, newTicket];
    setTickets(add);
    localStorage.setItem("localTickets", JSON.stringify(add));
    notify();

    setTitle("");
    setName("");
    setDescription("");
    setPriority("Low");
    setErrors({});
    navigate(`/ticket/${newTicket.id}`);
  };

  return (
    <div className="flex justify-center items-center max-w-full mx-auto">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="p-8 rounded-2xl shadow-xl bg-app max-w-2xl w-full mt-10  flex flex-col justify-center items-center md:mx-10 mx-5"
      >
        <h2 className="lg:text-3xl md:text-2xl text-xl font-bold md:mb-6 mb-4 text-center uppercase text-primary">
          Create Ticket
        </h2>

        <div className="mb-4 w-full">
          <label className="block mb-1 md:text-lg text-base md:font-semibold text-secondary">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter ticket title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="focus:outline-none w-full border border-[var(--color-primary)] rounded-lg md:p-2 p-1 text-secondary placeholder:text-secondary md:placeholder:text-lg placeholder:text-base"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="w-full flex justify-center items-baseline gap-2 ">
          <div className="mb-4 w-[70%]">
            <label className="block mb-1 md:text-lg text-base md:font-semibold text-secondary">
              Created By
            </label>
            <input
              type="text"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:outline-none w-full border border-[var(--color-primary)] md:rounded-lg rounded-sm md:p-2 p-1 text-secondary placeholder:text-secondary md:placeholder:text-base placeholder:text-sm"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-6 w-[30%]">
            <label className="block mb-1 md:text-lg text-base md:font-semibold text-secondary">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select w-full md:text-base text-xs sm:text-sm"
            >
              <option className="priority-low">Low</option>
              <option className="priority-medium">Medium</option>
              <option className="priority-high">High</option>
            </select>
          </div>
        </div>

        <div className="mb-4 w-full">
          <label className="block mb-1 md:text-lg text-base md:font-semibold text-secondary">
            Description
          </label>
          <textarea
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="focus:outline-none w-full border border-[var(--color-primary)] rounded-lg p-3 md:h-32 h-20 md:placeholder:text-lg placeholder:text-base  resize-none text-secondary placeholder:text-secondary"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary hover:cursor-pointer text-white md:px-6 px-2 md:py-3 py-1 md:rounded-xl rounded-md md:font-semibold shadow-md hover:bg-secondary transition duration-200"
          >
            Create Ticket
          </button>
        </div>
      </form>
    </div>
  );
}
