# TASK-02-03: Staff & Role Management Frontend System

## 📋 Task Details
**Task ID**: TASK-02-03
**Story Reference**: STORY-01-05 (Staff & Role Management)
**Sprint**: Sprint 2
**Phase**: Frontend
**Priority**: P0 (Critical)
**Estimated Effort**: 3 days
**Assignee**: Frontend Engineer
**Dependencies**: TASK-02-02 (Staff & Role Management Backend)

## 🎯 Task Description
Create comprehensive frontend interfaces for staff and role management including staff directory, role assignment dashboard, organization chart visualization, performance tracking views, team management interface, and department hierarchy management with responsive design and real-time updates.

## 📋 Acceptance Criteria

### AC-01: Staff Directory and Management Interface
- [ ] Comprehensive staff listing with search, filter, and sort functionality
- [ ] Staff profile creation and editing forms with validation
- [ ] Bulk staff operations interface (import, export, updates)
- [ ] Staff status management controls
- [ ] Staff invitation workflow interface

### AC-02: Role Assignment and Permission Management
- [ ] Role assignment interface with drag-and-drop functionality
- [ ] Permission visualization and assignment tools
- [ ] Role conflict detection and resolution interface
- [ ] Custom role creation wizard
- [ ] Role hierarchy visualization

### AC-03: Organization Chart and Department Management
- [ ] Interactive organization chart with zoom and navigation
- [ ] Department structure visualization and management
- [ ] Team formation and management interface
- [ ] Reporting hierarchy visualization
- [ ] Department-specific dashboard views

### AC-04: Performance Dashboard and Analytics
- [ ] Staff performance metrics visualization
- [ ] Activity monitoring dashboard
- [ ] Workload distribution charts
- [ ] Goal tracking interface
- [ ] Performance comparison tools

### AC-05: User Experience and Accessibility
- [ ] Responsive design for all screen sizes
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Real-time updates and notifications
- [ ] Keyboard navigation support
- [ ] Loading states and error handling

## 🔧 Technical Implementation

### Component Architecture

```typescript
// components/staff/StaffDirectory.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Users,
  UserCheck,
  UserX,
  Download,
  Upload,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui';

interface StaffMember {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  primary_email: string;
  employment_status: 'active' | 'inactive' | 'suspended' | 'terminated' | 'on_leave';
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern' | 'consultant';
  designation: string;
  department: {
    id: string;
    name: string;
    code: string;
  };
  staff_roles: {
    id: string;
    name: string;
    code: string;
  };
  profile_picture_url?: string;
  joining_date: string;
  performance_score: number;
  activity_score: number;
  activeTeamsCount: number;
  directReports: number;
}

interface StaffDirectoryProps {
  instituteId: string;
}

export const StaffDirectory: React.FC<StaffDirectoryProps> = ({ instituteId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showCreateStaffDialog, setShowCreateStaffDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const queryClient = useQueryClient();

  // Fetch staff data
  const {
    data: staffData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['staff', instituteId, searchTerm, selectedDepartment, selectedRole, selectedStatus, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status: selectedStatus,
        includeTeams: 'true'
      });

      if (selectedDepartment) params.append('department', selectedDepartment);
      if (selectedRole) params.append('role', selectedRole);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/institutes/${instituteId}/staff?${params}`);
      if (!response.ok) throw new Error('Failed to fetch staff');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch departments for filtering
  const { data: departments } = useQuery({
    queryKey: ['departments', instituteId],
    queryFn: async () => {
      const response = await fetch(`/api/institutes/${instituteId}/departments`);
      if (!response.ok) throw new Error('Failed to fetch departments');
      return response.json();
    },
  });

  // Fetch roles for filtering
  const { data: roles } = useQuery({
    queryKey: ['staff-roles', instituteId],
    queryFn: async () => {
      const response = await fetch(`/api/institutes/${instituteId}/staff/roles`);
      if (!response.ok) throw new Error('Failed to fetch roles');
      return response.json();
    },
  });

  // Update staff status mutation
  const updateStaffStatusMutation = useMutation({
    mutationFn: async ({ staffId, status }: { staffId: string; status: string }) => {
      const response = await fetch(`/api/institutes/${instituteId}/staff/${staffId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update staff status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });

  const filteredStaff = useMemo(() => {
    if (!staffData?.data?.staff) return [];

    let filtered = staffData.data.staff;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(staff =>
        staff.first_name.toLowerCase().includes(term) ||
        staff.last_name.toLowerCase().includes(term) ||
        staff.employee_id.toLowerCase().includes(term) ||
        staff.primary_email.toLowerCase().includes(term) ||
        staff.designation?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [staffData, searchTerm]);

  const handleStatusChange = (staffId: string, status: string) => {
    updateStaffStatusMutation.mutate({ staffId, status });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      terminated: 'bg-red-100 text-red-800',
      on_leave: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error loading staff directory</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Directory</h1>
          <p className="text-gray-600">
            Manage {staffData?.data?.pagination?.total || 0} staff members
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {/* Handle bulk export */}}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => {/* Handle bulk import */}}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowCreateStaffDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments?.data?.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                {roles?.data?.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="joining_date">Joining Date</SelectItem>
                  <SelectItem value="performance_score">Performance</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="wait">
          {filteredStaff.map((staff) => (
            <motion.div
              key={staff.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={staff.profile_picture_url} />
                        <AvatarFallback>
                          {staff.first_name[0]}{staff.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-sm">
                          {staff.first_name} {staff.last_name}
                        </h3>
                        <p className="text-gray-600 text-xs">{staff.designation}</p>
                        <p className="text-gray-500 text-xs">{staff.employee_id}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedStaff(staff)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {/* Handle edit */}}>
                          Edit Staff
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {/* Handle roles */}}>
                          Manage Roles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(staff.id, 'suspended')}
                          className="text-red-600"
                        >
                          Suspend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Department</span>
                      <span className="font-medium">{staff.department.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Role</span>
                      <span className="font-medium">{staff.staff_roles.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Performance</span>
                      <span className={`font-medium ${getPerformanceColor(staff.performance_score)}`}>
                        {(staff.performance_score * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <Badge className={getStatusColor(staff.employment_status)}>
                        {staff.employment_status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <Tooltip>
                        <TooltipTrigger className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {staff.activeTeamsCount}
                        </TooltipTrigger>
                        <TooltipContent>
                          Active Teams
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger className="flex items-center">
                          <UserCheck className="h-3 w-3 mr-1" />
                          {staff.directReports}
                        </TooltipTrigger>
                        <TooltipContent>
                          Direct Reports
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span>
                      Joined {new Date(staff.joining_date).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {staffData?.data?.pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, staffData.data.pagination.total)} of {staffData.data.pagination.total} staff members
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= staffData.data.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Staff Profile Dialog */}
      {selectedStaff && (
        <StaffProfileDialog
          staff={selectedStaff}
          open={!!selectedStaff}
          onOpenChange={() => setSelectedStaff(null)}
          instituteId={instituteId}
        />
      )}

      {/* Create Staff Dialog */}
      <CreateStaffDialog
        open={showCreateStaffDialog}
        onOpenChange={setShowCreateStaffDialog}
        instituteId={instituteId}
        departments={departments?.data || []}
        roles={roles?.data || []}
        onSuccess={() => {
          setShowCreateStaffDialog(false);
          queryClient.invalidateQueries({ queryKey: ['staff'] });
        }}
      />
    </div>
  );
};

// components/staff/OrganizationChart.tsx
interface OrgChartNode {
  id: string;
  name: string;
  designation: string;
  department: string;
  profilePicture?: string;
  directReportsCount: number;
  children: OrgChartNode[];
}

export const OrganizationChart: React.FC<{ instituteId: string }> = ({ instituteId }) => {
  const [selectedNode, setSelectedNode] = useState<OrgChartNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());

  const { data: orgChart, isLoading } = useQuery({
    queryKey: ['organization-chart', instituteId],
    queryFn: async () => {
      const response = await fetch(`/api/institutes/${instituteId}/staff/org-chart`);
      if (!response.ok) throw new Error('Failed to fetch organization chart');
      return response.json();
    },
  });

  const renderNode = (node: OrgChartNode, level: number = 0) => (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: level * 0.1 }}
      className="flex flex-col items-center"
    >
      <div
        className={`
          bg-white rounded-lg shadow-md p-4 border-2 cursor-pointer
          transition-all duration-200 hover:shadow-lg hover:scale-105
          ${selectedNode?.id === node.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
          ${highlightedNodes.has(node.id) ? 'ring-2 ring-yellow-200' : ''}
        `}
        onClick={() => setSelectedNode(node)}
      >
        <Avatar className="h-16 w-16 mx-auto mb-2">
          <AvatarImage src={node.profilePicture} />
          <AvatarFallback>
            {node.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-center text-sm">{node.name}</h3>
        <p className="text-gray-600 text-xs text-center">{node.designation}</p>
        <p className="text-gray-500 text-xs text-center">{node.department}</p>
        {node.directReportsCount > 0 && (
          <Badge variant="secondary" className="mt-2">
            {node.directReportsCount} reports
          </Badge>
        )}
      </div>

      {node.children.length > 0 && (
        <div className="mt-6 flex gap-8 justify-center">
          {node.children.map(child => renderNode(child, level + 1))}
        </div>
      )}
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Organization Chart</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => window.print()}>
            Export Chart
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-auto">
            {orgChart?.data?.structure?.map(rootNode => renderNode(rootNode))}
          </div>
        </CardContent>
      </Card>

      {selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
};
```

### Role Management Components

```typescript
// components/roles/RoleManagementDashboard.tsx
export const RoleManagementDashboard: React.FC<{ instituteId: string }> = ({ instituteId }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);

  const { data: roles, isLoading } = useQuery({
    queryKey: ['staff-roles', instituteId],
    queryFn: async () => {
      const response = await fetch(`/api/institutes/${instituteId}/staff/roles`);
      if (!response.ok) throw new Error('Failed to fetch roles');
      return response.json();
    },
  });

  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const response = await fetch('/api/permissions');
      if (!response.ok) throw new Error('Failed to fetch permissions');
      return response.json();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Role Management</h1>
        <Button onClick={() => setShowCreateRoleDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roles?.data?.map((role) => (
                <div
                  key={role.id}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-colors
                    ${selectedRole === role.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
                  `}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{role.name}</h3>
                      <p className="text-sm text-gray-600">{role.code}</p>
                    </div>
                    <Badge variant={role.is_custom_role ? 'default' : 'secondary'}>
                      {role.is_custom_role ? 'Custom' : 'System'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {role.staff_count} staff assigned
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Role Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRole ? (
              <RoleDetailsPanel
                roleId={selectedRole}
                instituteId={instituteId}
                permissions={permissions?.data || []}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a role to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateRoleDialog
        open={showCreateRoleDialog}
        onOpenChange={setShowCreateRoleDialog}
        instituteId={instituteId}
        permissions={permissions?.data || []}
        onSuccess={() => {
          setShowCreateRoleDialog(false);
          queryClient.invalidateQueries({ queryKey: ['staff-roles'] });
        }}
      />
    </div>
  );
};

// components/roles/PermissionMatrix.tsx
export const PermissionMatrix: React.FC<{
  roleId: string;
  permissions: Permission[];
  rolePermissions: string[];
  onPermissionChange: (permissionCode: string, granted: boolean) => void;
}> = ({ roleId, permissions, rolePermissions, onPermissionChange }) => {
  const groupedPermissions = useMemo(() => {
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  }, [permissions]);

  return (
    <div className="space-y-6">
      {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg capitalize">{category} Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryPermissions.map((permission) => (
                <div key={permission.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.code}
                    checked={rolePermissions.includes(permission.code)}
                    onCheckedChange={(checked) =>
                      onPermissionChange(permission.code, !!checked)
                    }
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={permission.code}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {permission.name}
                    </label>
                    {permission.description && (
                      <p className="text-xs text-gray-500">{permission.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
```

### Performance Dashboard Components

```typescript
// components/performance/PerformanceDashboard.tsx
export const PerformanceDashboard: React.FC<{ instituteId: string }> = ({ instituteId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const { data: performanceData, isLoading } = useQuery({
    queryKey: ['staff-performance', instituteId, selectedPeriod, selectedDepartment],
    queryFn: async () => {
      const params = new URLSearchParams({
        period: selectedPeriod
      });
      if (selectedDepartment) params.append('department', selectedDepartment);

      const response = await fetch(`/api/institutes/${instituteId}/staff/performance?${params}`);
      if (!response.ok) throw new Error('Failed to fetch performance data');
      return response.json();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Performance Dashboard</h1>
        <div className="flex gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Average Performance"
          value={`${((performanceData?.data?.averagePerformance || 0) * 100).toFixed(1)}%`}
          change="+2.5%"
          trend="up"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Top Performers"
          value={performanceData?.data?.topPerformersCount || 0}
          change="+3"
          trend="up"
          icon={<UserCheck className="h-5 w-5" />}
        />
        <MetricCard
          title="Goals Achieved"
          value={`${((performanceData?.data?.goalAchievementRate || 0) * 100).toFixed(0)}%`}
          change="+5.2%"
          trend="up"
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Staff"
          value={performanceData?.data?.activeStaffCount || 0}
          change="0"
          trend="neutral"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceTrendChart data={performanceData?.data?.performanceTrend || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentPerformanceChart data={performanceData?.data?.departmentPerformance || []} />
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <TopPerformersTable performers={performanceData?.data?.topPerformers || []} />
        </CardContent>
      </Card>
    </div>
  );
};
```

## 🧪 Testing Strategy

### Component Tests
```typescript
describe('StaffDirectory', () => {
  it('renders staff list correctly', async () => {
    const mockStaff = [
      {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        employee_id: 'EMP001',
        designation: 'Manager',
        department: { name: 'IT', code: 'IT' },
        employment_status: 'active'
      }
    ];

    render(<StaffDirectory instituteId="inst-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('EMP001')).toBeInTheDocument();
      expect(screen.getByText('Manager')).toBeInTheDocument();
    });
  });

  it('filters staff by search term', async () => {
    render(<StaffDirectory instituteId="inst-1" />);
    
    const searchInput = screen.getByPlaceholderText('Search staff...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });
  });
});

describe('OrganizationChart', () => {
  it('renders organization structure', async () => {
    const mockOrgData = {
      structure: [
        {
          id: '1',
          name: 'John Doe',
          designation: 'CEO',
          children: [
            {
              id: '2',
              name: 'Jane Smith',
              designation: 'CTO',
              children: []
            }
          ]
        }
      ]
    };

    render(<OrganizationChart instituteId="inst-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('CEO')).toBeInTheDocument();
    });
  });
});
```

### Integration Tests
```typescript
describe('Staff Management Integration', () => {
  it('creates new staff member successfully', async () => {
    const user = userEvent.setup();
    
    render(<StaffDirectory instituteId="inst-1" />);
    
    const addButton = screen.getByText('Add Staff');
    await user.click(addButton);
    
    // Fill form
    await user.type(screen.getByLabelText('First Name'), 'John');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    await user.type(screen.getByLabelText('Employee ID'), 'EMP001');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    
    const submitButton = screen.getByText('Create Staff');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Staff member created successfully')).toBeInTheDocument();
    });
  });
});
```

## 📊 Performance Optimization

### Code Splitting
```typescript
// Lazy load heavy components
const OrganizationChart = lazy(() => import('./OrganizationChart'));
const PerformanceDashboard = lazy(() => import('./PerformanceDashboard'));
const RoleManagementDashboard = lazy(() => import('./RoleManagementDashboard'));
```

### Virtual Scrolling for Large Lists
```typescript
// For large staff lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedStaffList = ({ staff, height = 400 }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <StaffListItem staff={staff[index]} />
    </div>
  );

  return (
    <List
      height={height}
      itemCount={staff.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### Optimized Queries
```typescript
// Use React Query with proper caching
const useStaffQuery = (instituteId: string, filters: StaffFilters) => {
  return useQuery({
    queryKey: ['staff', instituteId, filters],
    queryFn: () => fetchStaff(instituteId, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
```

## 📋 Definition of Done

- [ ] Staff directory with search, filter, and pagination implemented
- [ ] Staff creation and editing forms functional
- [ ] Role assignment interface with drag-and-drop working
- [ ] Organization chart visualization complete
- [ ] Performance dashboard with charts operational
- [ ] Team and department management interfaces ready
- [ ] Responsive design for all screen sizes implemented
- [ ] Accessibility compliance (WCAG 2.1 AA) achieved
- [ ] Real-time updates and notifications working
- [ ] Loading states and error handling implemented
- [ ] Component tests passing (>85% coverage)
- [ ] Integration tests complete
- [ ] Performance optimization implemented

## 🔗 Dependencies
- TASK-02-02 (Staff & Role Management Backend)
- UI component library
- Chart visualization library (Chart.js/D3)
- State management (React Query)
- Form validation library (React Hook Form + Zod)

## 📝 Notes
- Focus on intuitive user experience for non-technical users
- Implement progressive loading for better perceived performance
- Ensure data privacy in performance visualizations
- Plan for mobile-first responsive design
- Consider implementing keyboard shortcuts for power users

---

**Task Owner**: Frontend Engineer
**Reviewer**: UX Designer + Tech Lead
**Created**: 2024-01-20
**Due Date**: 2024-02-21