
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Coins, Plus, Pencil, Trash } from 'lucide-react';
import { getTasks, saveTask, deleteTask } from '@/lib/tasks';
import { Task } from '@/types';
import { toast } from '@/components/ui/sonner';
import NavSidebar from '@/components/admin/NavSidebar';

const AdminTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(getTasks());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coins, setCoins] = useState('');
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCoins('');
    setEditingTask(null);
  };
  
  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setCoins(task.coins.toString());
    } else {
      resetForm();
    }
    
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleSaveTask = () => {
    // Validate form
    if (!title || !description || !coins) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const coinsValue = parseInt(coins);
    if (isNaN(coinsValue) || coinsValue <= 0) {
      toast.error('Coin reward must be a positive number');
      return;
    }
    
    const taskData: Task = {
      id: editingTask?.id || '',
      title,
      description,
      coins: coinsValue,
    };
    
    const savedTask = saveTask(taskData);
    setTasks(getTasks());
    
    toast.success(`Task ${editingTask ? 'updated' : 'created'} successfully`);
    handleCloseDialog();
  };
  
  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
      setTasks(getTasks());
      toast.success('Task deleted successfully');
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      <NavSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Task Management</h1>
            
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>Manage tasks that users can complete to earn coins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Task</th>
                      <th className="px-4 py-3.5 text-right text-sm font-semibold text-muted-foreground">Reward</th>
                      <th className="px-4 py-3.5 text-right text-sm font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tasks.map((task: Task) => (
                      <tr key={task.id} className="hover:bg-muted/50">
                        <td className="px-4 py-4 text-sm">
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{task.description}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-right">
                          <div className="flex items-center justify-end">
                            <Coins className="h-4 w-4 text-coin mr-1" />
                            <span>{task.coins}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenDialog(task)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {tasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No tasks found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Add/Edit Task Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                <DialogDescription>
                  {editingTask
                    ? 'Update the details of this task'
                    : 'Create a new task for users to complete and earn coins'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coins">Reward (Coins)</Label>
                  <Input 
                    id="coins" 
                    type="number" 
                    min="1" 
                    value={coins} 
                    onChange={(e) => setCoins(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveTask}>
                  {editingTask ? 'Update Task' : 'Add Task'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminTasks;
