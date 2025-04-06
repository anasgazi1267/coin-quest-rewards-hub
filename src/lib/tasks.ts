
import { Task } from '@/types';
import { STORAGE_KEYS } from './data';
import { getCurrentUser, updateUserCoins } from './auth';
import { toast } from '@/components/ui/sonner';

// Get all tasks
export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
  return tasks ? JSON.parse(tasks) : [];
};

// Save all tasks
export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

// Add or update task
export const saveTask = (task: Task): Task => {
  const tasks = getTasks();
  
  if (task.id) {
    // Update existing task
    const updatedTasks = tasks.map(t => t.id === task.id ? task : t);
    saveTasks(updatedTasks);
  } else {
    // Add new task
    const newTask = {
      ...task,
      id: Date.now().toString(),
    };
    saveTasks([...tasks, newTask]);
    return newTask;
  }
  
  return task;
};

// Delete task
export const deleteTask = (id: string): void => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  saveTasks(filteredTasks);
};

// Get user's completed task ids
export const getUserCompletedTaskIds = (userId: string): string[] => {
  if (typeof window === 'undefined') return [];
  const key = `${STORAGE_KEYS.TASKS}-${userId}-completed`;
  const completedTasks = localStorage.getItem(key);
  return completedTasks ? JSON.parse(completedTasks) : [];
};

// Save user's completed task ids
export const saveUserCompletedTaskIds = (userId: string, taskIds: string[]): void => {
  if (typeof window === 'undefined') return;
  const key = `${STORAGE_KEYS.TASKS}-${userId}-completed`;
  localStorage.setItem(key, JSON.stringify(taskIds));
};

// Complete a task
export const completeTask = (taskId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    toast.error("You must be logged in to complete tasks");
    return false;
  }
  
  const tasks = getTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    toast.error("Task not found");
    return false;
  }
  
  const completedTaskIds = getUserCompletedTaskIds(currentUser.id);
  
  // Check if already completed
  if (completedTaskIds.includes(taskId)) {
    toast.info("Task already completed");
    return false;
  }
  
  // Add to completed tasks
  const updatedCompletedTaskIds = [...completedTaskIds, taskId];
  saveUserCompletedTaskIds(currentUser.id, updatedCompletedTaskIds);
  
  // Add coins to user
  updateUserCoins(currentUser.id, currentUser.coins + task.coins);
  
  toast.success(`Task completed! You earned ${task.coins} coins`);
  return true;
};

// Check if task is completed by user
export const isTaskCompleted = (taskId: string, userId: string): boolean => {
  const completedTaskIds = getUserCompletedTaskIds(userId);
  return completedTaskIds.includes(taskId);
};
