
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, CheckCircle } from 'lucide-react';
import { Task } from '@/types';
import { completeTask, isTaskCompleted } from '@/lib/tasks';
import { getCurrentUser } from '@/lib/auth';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const currentUser = getCurrentUser();
  const isCompleted = currentUser ? isTaskCompleted(task.id, currentUser.id) : false;
  
  const handleCompleteTask = () => {
    completeTask(task.id);
  };
  
  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${isCompleted ? 'bg-accent/30' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
          {isCompleted && <CheckCircle className="h-5 w-5 text-primary" />}
        </div>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="flex items-center space-x-1">
          <Coins className="h-5 w-5 text-coin" />
          <span className="font-bold text-lg">{task.coins}</span>
          <span className="text-muted-foreground text-sm">coins</span>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          className="w-full" 
          onClick={handleCompleteTask}
          disabled={isCompleted || !currentUser}
          variant={isCompleted ? "outline" : "default"}
        >
          {isCompleted ? 'Completed' : 'Complete Task'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
