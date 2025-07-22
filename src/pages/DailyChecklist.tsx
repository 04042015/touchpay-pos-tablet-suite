import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, CheckSquare, AlertTriangle, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChecklistTask, ChecklistCompletion } from '@/types';
import { useAppContext } from '@/contexts/AppContext';

const DailyChecklist = () => {
  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [completions, setCompletions] = useState<ChecklistCompletion[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ChecklistTask | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { state } = useAppContext();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role: 'all' as 'admin' | 'kasir' | 'waiter' | 'all',
    priority: 'medium' as 'low' | 'medium' | 'high',
    is_active: true,
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data: tasksData, error: tasksError } = await supabase
        .from('checklist_tasks')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (tasksError) throw tasksError;

      const { data: completionsData, error: completionsError } = await supabase
        .from('checklist_completions')
        .select('*')
        .eq('date', selectedDate);

      if (completionsError) throw completionsError;

      setTasks((tasksData as ChecklistTask[]) || []);
      setCompletions((completionsData as ChecklistCompletion[]) || []);
    } catch (error: any) {
      toast({
        title: "Error loading checklist",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedTask) {
        const { error } = await supabase
          .from('checklist_tasks')
          .update(formData)
          .eq('id', selectedTask.id);

        if (error) throw error;
        toast({ title: "Task updated successfully" });
      } else {
        const { error } = await supabase
          .from('checklist_tasks')
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Task added successfully" });
      }

      await fetchTasks();
      resetForm();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error saving task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      role: 'all',
      priority: 'medium',
      is_active: true,
    });
    setSelectedTask(null);
  };

  const openEditDialog = (task: ChecklistTask) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      role: task.role,
      priority: task.priority,
      is_active: task.is_active,
    });
    setDialogOpen(true);
  };

  const toggleTaskCompletion = async (task: ChecklistTask, completed: boolean) => {
    if (!state.currentUser) {
      toast({
        title: "Error",
        description: "Please login to complete tasks",
        variant: "destructive",
      });
      return;
    }

    try {
      if (completed) {
        const { error } = await supabase
          .from('checklist_completions')
          .insert([{
            task_id: task.id,
            completed_by: state.currentUser.id,
            date: selectedDate,
          }]);

        if (error) throw error;
        toast({ title: `"${task.title}" completed` });
      } else {
        const completion = completions.find(c => c.task_id === task.id);
        if (completion) {
          const { error } = await supabase
            .from('checklist_completions')
            .delete()
            .eq('id', completion.id);

          if (error) throw error;
          toast({ title: `"${task.title}" unmarked` });
        }
      }

      await fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error updating task completion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isTaskCompleted = (taskId: string) => {
    return completions.some(c => c.task_id === taskId);
  };

  const getTasksByRole = (role: string) => {
    return tasks.filter(task => task.role === role || task.role === 'all');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'kasir': return 'bg-blue-100 text-blue-800';
      case 'waiter': return 'bg-green-100 text-green-800';
      case 'all': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const completedCount = completions.length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Checklist</h1>
            <p className="text-muted-foreground">Manage daily operational tasks</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedTask ? 'Edit Task' : 'Add New Task'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Task title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Task description..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Assigned Role</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value: 'admin' | 'kasir' | 'waiter' | 'all') => setFormData({...formData, role: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="kasir">Kasir</SelectItem>
                        <SelectItem value="waiter">Waiter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({...formData, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedTask ? 'Update' : 'Add'} Task
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="text-sm font-medium">{completedCount}/{totalCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                <div className="text-center text-lg font-bold text-green-600">
                  {completionRate}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                {completionRate === 100 ? (
                  <div className="text-center">
                    <CheckSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-green-600 font-medium">All Done!</div>
                  </div>
                ) : completionRate >= 80 ? (
                  <div className="text-center">
                    <CheckSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-blue-600 font-medium">Almost There</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-yellow-600 font-medium">In Progress</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No tasks yet</h3>
              <p className="text-muted-foreground">Start by adding your first checklist task</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => {
              const isCompleted = isTaskCompleted(task.id);
              const completion = completions.find(c => c.task_id === task.id);
              
              return (
                <Card key={task.id} className={`transition-all ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={(checked) => toggleTaskCompletion(task, checked as boolean)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h3>
                          <div className="flex space-x-2">
                            <Badge className={getRoleColor(task.role)}>
                              {task.role === 'all' ? 'All Roles' : task.role.charAt(0).toUpperCase() + task.role.slice(1)}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className={`text-sm mt-1 ${isCompleted ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                            {task.description}
                          </p>
                        )}
                        
                        {isCompleted && completion && (
                          <div className="text-xs text-green-600 mt-2">
                            Completed on {new Date(completion.completed_at).toLocaleString('id-ID')}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(task)}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DailyChecklist;