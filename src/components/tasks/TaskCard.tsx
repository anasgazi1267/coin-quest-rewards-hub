
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, CheckCircle2, ExternalLink } from 'lucide-react';
import { Task } from '@/types';
import { completeTask, isTaskCompleted } from '@/lib/tasks';
import { getCurrentUser } from '@/lib/auth';
import { toast } from '@/lib/toast';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(() => {
    const currentUser = getCurrentUser();
    return currentUser ? isTaskCompleted(task.id, currentUser.id) : false;
  });
  
  const handleCompleteTask = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error("You must be logged in to complete tasks");
      return;
    }
    
    setIsLoading(true);
    
    // For tasks that require verification (like social media tasks)
    if (task.type === 'social' || task.type === 'youtube' || task.type === 'telegram') {
      // Here we would implement verification logic
      // For now, we'll simulate a validation process with a timeout
      setTimeout(() => {
        const success = completeTask(task.id);
        if (success) {
          setIsCompleted(true);
        }
        setIsLoading(false);
      }, 1500);
    } else {
      // For regular tasks that can be completed immediately
      const success = completeTask(task.id);
      if (success) {
        setIsCompleted(true);
      }
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="flex items-center space-x-1">
          <Coins className="h-5 w-5 text-coin" />
          <span className="font-bold text-lg">{task.coins}</span>
          <span className="text-muted-foreground text-sm">coins</span>
        </div>
        
        {task.url && (
          <a 
            href={task.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center mt-2 text-xs text-blue-500 hover:underline"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            {task.type === 'youtube' ? 'Visit YouTube Channel' : 
             task.type === 'telegram' ? 'Join Telegram Channel' : 'Visit Link'}
          </a>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        {isCompleted ? (
          <Button disabled className="w-full bg-green-500 text-white">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Completed
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={handleCompleteTask}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Complete Task'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
