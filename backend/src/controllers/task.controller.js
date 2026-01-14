import Task from "../models/Task.model.js";




export const createTask = async (req, res) => {
  try {
    const { title, lead, dueDate } = req.body;

    if (!title || !lead) {
      return res.status(400).json({
        success: false,
        message: "Title and Lead are required",
      });
    }

    const task = await Task.create({
      title,
      lead,
      dueDate,
      assignedTo: req.user.id, 
      completed: false,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};



export const getTasks = async (req, res) => {
  try {
    const filter =
      req.user.role === "Admin"
        ? {}
        : { assignedTo: req.user.id };

    const tasks = await Task.find(filter)
      .populate("lead", "name email phone");

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

export const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (
      req.user.role !== "Admin" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    task.completed = true;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task marked as completed",
      task,
    });
  } catch (error) {
    console.error("Complete Task Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete task",
    });
  }
};
