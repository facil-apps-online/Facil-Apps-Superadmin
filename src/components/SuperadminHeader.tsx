import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, ChevronsUpDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useScreenSize } from "@/hooks/useScreenSize";
import { Separator } from "@/components/ui/separator";
import React, { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGoogleDriveImage } from "@/hooks/useGoogleDriveImage"; // Importamos el hook

export function SuperadminHeader() {
  const { user, logout, assignments, currentAssignment, switchCurrentAssignment } = useAuth();
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  const navigate = useNavigate();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Usamos el hook para obtener la URL de la imagen una sola vez
  const { displayUrl } = useGoogleDriveImage(user?.avatarUrl);

  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email;

  const getInitials = () => {
    if (user?.firstName) {
      return `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || '?';
  };

  const handleLogout = () => {
    setIsPopoverOpen(false);
    logout();
  };

  const handleProfileClick = () => {
    setIsPopoverOpen(false);
    navigate("/profile-settings");
  };

  const headerTitle = useMemo(() => {
    const role = currentAssignment?.role;
    switch (role) {
      case 'super_admin':
        return 'Superadmin Control Panel';
      case 'app_super_admin':
        return 'App Superadmin Control Panel';
      case 'investor':
        return 'Investor Dashboard';
      case 'vendor':
        return 'Vendor Dashboard';
      default:
        return 'Dashboard';
    }
  }, [currentAssignment]);

  const uniqueRoles = useMemo(() => {
    if (!assignments) return [];
    const roleNames = assignments.map(a => a.role);
    return [...new Set(roleNames)];
  }, [assignments]);

  const handleRoleSwitch = (role: string) => {
    const firstMatchingAssignment = assignments.find(a => a.role === role);
    if (firstMatchingAssignment) {
      switchCurrentAssignment(firstMatchingAssignment);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        <SidebarTrigger className="p-2 hover:bg-slate-100 rounded-lg transition-colors" />
        <h1 className="text-lg sm:text-2xl font-bold truncate">{headerTitle}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {uniqueRoles.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span className="capitalize">{currentAssignment?.role?.replace('_', ' ')}</span>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {uniqueRoles.map((role, index) => (
                <DropdownMenuItem key={index} onSelect={() => handleRoleSwitch(role)}>
                  <span className="capitalize">{role.replace('_', ' ')}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {!isMobile && (
          <div className="text-sm text-right">
            <p className="font-semibold text-slate-700 truncate max-w-xs">{displayName}</p>
            <p className="text-xs text-slate-500 capitalize">{currentAssignment?.role?.replace('_', ' ')}</p>
          </div>
        )}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
              <Avatar className="h-10 w-10">
                <AvatarImage src={displayUrl} alt="Avatar" />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-2">
            <div className="p-2 flex items-center gap-3">
               <Avatar className="h-10 w-10">
                <AvatarImage src={displayUrl} alt="Avatar" />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="truncate">
                <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                <p className="text-xs text-slate-500 capitalize">{currentAssignment?.role?.replace('_', ' ')}</p>
              </div>
            </div>
            <Separator className="my-2" />
            <div 
              onClick={handleProfileClick} 
              className="flex items-center p-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span>Mi Perfil</span>
            </div>
            <Separator className="my-1" />
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              className="w-full justify-start text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Cerrar Sesión</span>
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
