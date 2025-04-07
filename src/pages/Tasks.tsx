
import React from 'react';
import { Task } from '@/types';
import { getTasks } from '@/lib/tasks';
import TaskCard from '@/components/tasks/TaskCard';
import InviteTask from '@/components/tasks/InviteTask';

const Tasks: React.FC = () => {
  const tasks = getTasks();
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 gradient-text">Complete Tasks, Earn Coins</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Earn coins by completing simple tasks. The more tasks you complete, the more rewards you can redeem!
        </p>
      </div>
      
      {/* Special Invite Task Card */}
      <div className="mb-10">
        <InviteTask />
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Available Tasks</h2>
      
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tasks.map((task: Task) => (
            <div key={task.id} className="card-hover">
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/40 rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h3 className="text-xl font-medium">No tasks available</h3>
          <p className="text-muted-foreground mt-1">Check back later for new tasks</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
