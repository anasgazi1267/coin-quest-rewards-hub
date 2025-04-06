
import React from 'react';
import { Task } from '@/types';
import { getTasks } from '@/lib/tasks';
import TaskCard from '@/components/tasks/TaskCard';

const Tasks: React.FC = () => {
  const tasks = getTasks();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Tasks</h1>
      
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No tasks available</h3>
          <p className="text-muted-foreground mt-1">Check back later for new tasks</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
