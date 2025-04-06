
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rewards from "./pages/Rewards";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import ViewAds from "./pages/ViewAds";
import Withdrawals from "./pages/Withdrawals";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRewards from "./pages/admin/AdminRewards";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminAds from "./pages/admin/AdminAds";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { initializeStorage } from "./lib/data";
import { getCurrentUser } from "./lib/auth";

const queryClient = new QueryClient();

// Admin route guard component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getCurrentUser();
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  useEffect(() => {
    // Initialize localStorage with mock data
    initializeStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/view-ads" element={<ViewAds />} />
              <Route path="/withdrawals" element={<Withdrawals />} />
              
              {/* Admin routes with route guard */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/rewards" element={<AdminRoute><AdminRewards /></AdminRoute>} />
              <Route path="/admin/tasks" element={<AdminRoute><AdminTasks /></AdminRoute>} />
              <Route path="/admin/ads" element={<AdminRoute><AdminAds /></AdminRoute>} />
              <Route path="/admin/media" element={<AdminRoute><AdminMedia /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
