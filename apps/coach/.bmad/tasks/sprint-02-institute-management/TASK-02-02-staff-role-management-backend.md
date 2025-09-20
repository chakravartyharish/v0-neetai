# TASK-02-02: Staff & Role Management Backend System

## 📋 Task Details
**Task ID**: TASK-02-02
**Story Reference**: STORY-01-05 (Staff & Role Management)
**Sprint**: Sprint 2
**Phase**: Backend
**Priority**: P0 (Critical)
**Estimated Effort**: 3 days
**Assignee**: Backend Engineer
**Dependencies**: TASK-01-01 (Database Schema), TASK-02-01 (Branch Management)

## 🎯 Task Description
Develop a comprehensive backend system for staff and role management that enables institutes to efficiently manage staff members, assign roles and permissions, handle hierarchical relationships, track performance, and ensure secure access control with role-based permissions and audit trails.

## 📋 Acceptance Criteria

### AC-01: Staff Management System
- [ ] Complete CRUD operations for staff members
- [ ] Staff onboarding and invitation workflow
- [ ] Staff profile management with verification
- [ ] Bulk staff operations (import, export, updates)
- [ ] Staff status management (active, inactive, suspended)

### AC-02: Role-Based Access Control (RBAC)
- [ ] Hierarchical role system with inheritance
- [ ] Permission-based access control
- [ ] Dynamic role assignment and updates
- [ ] Role conflict detection and resolution
- [ ] Custom role creation for institutional needs

### AC-03: Department and Team Management
- [ ] Department structure creation and management
- [ ] Team formation and staff assignment
- [ ] Cross-department collaboration tools
- [ ] Department-specific role permissions
- [ ] Reporting hierarchy management

### AC-04: Performance and Activity Tracking
- [ ] Staff activity monitoring and logging
- [ ] Performance metrics collection
- [ ] Workload distribution analysis
- [ ] Staff utilization reports
- [ ] Goal setting and tracking system

### AC-05: Security and Compliance
- [ ] Multi-factor authentication for staff
- [ ] Session management and timeout controls
- [ ] Audit trail for all staff-related actions
- [ ] Data privacy compliance (GDPR)
- [ ] Emergency access controls

## 🔧 Technical Specifications

### Database Schema Extensions

```sql
-- Staff members table
CREATE TABLE staff_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID REFERENCES institutes(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    
    -- Basic Information
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    display_name VARCHAR(255),
    
    -- Contact Information
    primary_email VARCHAR(255) UNIQUE NOT NULL,
    secondary_email VARCHAR(255),
    primary_phone VARCHAR(20),
    secondary_phone VARCHAR(20),
    emergency_contact JSONB DEFAULT '{}',
    
    -- Address Information
    current_address JSONB NOT NULL,
    permanent_address JSONB,
    
    -- Employment Details
    employment_type ENUM('full_time', 'part_time', 'contract', 'intern', 'consultant') NOT NULL,
    employment_status ENUM('active', 'inactive', 'suspended', 'terminated', 'on_leave') DEFAULT 'active',
    joining_date DATE NOT NULL,
    probation_end_date DATE,
    termination_date DATE,
    termination_reason TEXT,
    
    -- Department and Reporting
    department_id UUID REFERENCES departments(id),
    reports_to UUID REFERENCES staff_members(id),
    team_assignments JSONB DEFAULT '[]', -- Array of team IDs
    
    -- Role and Permissions
    primary_role_id UUID REFERENCES staff_roles(id) NOT NULL,
    additional_roles JSONB DEFAULT '[]', -- Array of additional role IDs
    custom_permissions JSONB DEFAULT '[]',
    
    -- Professional Information
    designation VARCHAR(255),
    job_description TEXT,
    qualifications JSONB DEFAULT '[]',
    experience_years INTEGER DEFAULT 0,
    skills JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    
    -- Compensation (encrypted)
    salary_encrypted VARCHAR(500), -- Encrypted salary information
    benefits JSONB DEFAULT '[]',
    
    -- Profile and Settings
    profile_picture_url VARCHAR(500),
    bio TEXT,
    languages_spoken JSONB DEFAULT '[]',
    working_hours JSONB DEFAULT '{}', -- Flexible working hours
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    
    -- Security and Access
    last_login_at TIMESTAMP,
    password_changed_at TIMESTAMP DEFAULT NOW(),
    mfa_enabled BOOLEAN DEFAULT false,
    security_clearance_level INTEGER DEFAULT 1,
    access_restrictions JSONB DEFAULT '{}',
    
    -- Performance and Activity
    performance_score DECIMAL(3,2) DEFAULT 0.00,
    activity_score DECIMAL(3,2) DEFAULT 0.00,
    last_activity_at TIMESTAMP,
    
    -- Metadata
    created_by UUID REFERENCES staff_members(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID REFERENCES institutes(id) NOT NULL,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Hierarchy
    parent_department_id UUID REFERENCES departments(id),
    department_level INTEGER DEFAULT 1,
    hierarchy_path TEXT, -- materialized path for efficient queries
    
    -- Management
    head_of_department UUID REFERENCES staff_members(id),
    deputy_head UUID REFERENCES staff_members(id),
    
    -- Location and Resources
    branch_id UUID REFERENCES institute_branches(id),
    location JSONB DEFAULT '{}', -- Specific location within branch
    budget_allocated DECIMAL(12,2) DEFAULT 0.00,
    resource_allocation JSONB DEFAULT '{}',
    
    -- Status and Settings
    status ENUM('active', 'inactive', 'restructuring') DEFAULT 'active',
    cost_center VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Staff roles and permissions
CREATE TABLE staff_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID REFERENCES institutes(id) NOT NULL,
    
    -- Role Information
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Role Hierarchy
    parent_role_id UUID REFERENCES staff_roles(id),
    role_level INTEGER DEFAULT 1,
    is_system_role BOOLEAN DEFAULT false, -- Cannot be deleted
    is_custom_role BOOLEAN DEFAULT false,
    
    -- Permissions and Access
    permissions JSONB NOT NULL DEFAULT '[]', -- Array of permission objects
    access_levels JSONB DEFAULT '{}', -- Module-specific access levels
    data_access_scope ENUM('own', 'department', 'branch', 'institute', 'all') DEFAULT 'own',
    
    -- Constraints and Limits
    max_assignments INTEGER DEFAULT 1, -- How many staff can have this role
    requires_approval BOOLEAN DEFAULT false,
    approval_workflow JSONB DEFAULT '[]',
    
    -- Status
    status ENUM('active', 'inactive', 'deprecated') DEFAULT 'active',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(institute_id, name)
);

-- Permission system
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Permission Details
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- 'student', 'teacher', 'finance', etc.
    
    -- Permission Hierarchy
    parent_permission_id UUID REFERENCES permissions(id),
    
    -- Access Control
    resource_type VARCHAR(100), -- 'student', 'batch', 'report', etc.
    action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete'
    scope_required BOOLEAN DEFAULT false,
    
    -- System Information
    is_system_permission BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Staff role assignments with history
CREATE TABLE staff_role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_members(id) NOT NULL,
    role_id UUID REFERENCES staff_roles(id) NOT NULL,
    
    -- Assignment Details
    assignment_type ENUM('primary', 'secondary', 'temporary') NOT NULL,
    assigned_by UUID REFERENCES staff_members(id),
    assignment_reason TEXT,
    
    -- Scope and Limitations
    scope_limitations JSONB DEFAULT '{}', -- Specific limitations for this assignment
    department_scope JSONB DEFAULT '[]', -- Departments this assignment applies to
    branch_scope JSONB DEFAULT '[]', -- Branches this assignment applies to
    
    -- Time-based Constraints
    effective_from TIMESTAMP DEFAULT NOW(),
    effective_until TIMESTAMP,
    is_temporary BOOLEAN DEFAULT false,
    
    -- Status
    status ENUM('active', 'inactive', 'expired', 'revoked') DEFAULT 'active',
    
    -- Approval Workflow
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    approved_by UUID REFERENCES staff_members(id),
    approved_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(staff_id, role_id, assignment_type, effective_from)
);

-- Teams and groups
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID REFERENCES institutes(id) NOT NULL,
    department_id UUID REFERENCES departments(id),
    
    -- Team Information
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    team_type ENUM('permanent', 'project', 'temporary', 'committee') DEFAULT 'permanent',
    
    -- Team Management
    team_lead UUID REFERENCES staff_members(id),
    deputy_lead UUID REFERENCES staff_members(id),
    
    -- Team Configuration
    max_members INTEGER,
    min_members INTEGER DEFAULT 1,
    requires_approval BOOLEAN DEFAULT false,
    
    -- Project/Purpose Information
    purpose TEXT,
    objectives JSONB DEFAULT '[]',
    deliverables JSONB DEFAULT '[]',
    timeline JSONB DEFAULT '{}',
    
    -- Status and Activity
    status ENUM('active', 'inactive', 'completed', 'suspended') DEFAULT 'active',
    activity_score DECIMAL(3,2) DEFAULT 0.00,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Team memberships
CREATE TABLE team_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) NOT NULL,
    staff_id UUID REFERENCES staff_members(id) NOT NULL,
    
    -- Membership Details
    role_in_team VARCHAR(100) DEFAULT 'member', -- 'lead', 'deputy', 'member', 'advisor'
    responsibilities JSONB DEFAULT '[]',
    
    -- Time-based Information
    joined_at TIMESTAMP DEFAULT NOW(),
    left_at TIMESTAMP,
    membership_duration INTERVAL,
    
    -- Status
    status ENUM('active', 'inactive', 'left') DEFAULT 'active',
    
    -- Performance in Team
    contribution_score DECIMAL(3,2) DEFAULT 0.00,
    
    UNIQUE(team_id, staff_id, joined_at)
);

-- Staff activity tracking
CREATE TABLE staff_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_members(id) NOT NULL,
    
    -- Activity Information
    activity_type VARCHAR(100) NOT NULL, -- 'login', 'logout', 'create', 'update', etc.
    activity_category VARCHAR(50) NOT NULL, -- 'system', 'academic', 'administrative'
    description TEXT,
    
    -- Context Information
    resource_type VARCHAR(100), -- What was acted upon
    resource_id UUID, -- ID of the resource
    resource_details JSONB DEFAULT '{}',
    
    -- Session and Location
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    location_context JSONB DEFAULT '{}',
    
    -- Metadata
    duration INTEGER, -- Activity duration in seconds
    success BOOLEAN DEFAULT true,
    error_details TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Staff performance metrics
CREATE TABLE staff_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_members(id) NOT NULL,
    
    -- Time Period
    metric_period ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly') NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Activity Metrics
    login_count INTEGER DEFAULT 0,
    active_hours DECIMAL(5,2) DEFAULT 0.00,
    tasks_completed INTEGER DEFAULT 0,
    tasks_pending INTEGER DEFAULT 0,
    
    -- Performance Scores
    productivity_score DECIMAL(3,2) DEFAULT 0.00,
    quality_score DECIMAL(3,2) DEFAULT 0.00,
    collaboration_score DECIMAL(3,2) DEFAULT 0.00,
    innovation_score DECIMAL(3,2) DEFAULT 0.00,
    overall_score DECIMAL(3,2) DEFAULT 0.00,
    
    -- Goal Achievement
    goals_set INTEGER DEFAULT 0,
    goals_achieved INTEGER DEFAULT 0,
    goal_achievement_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Feedback and Recognition
    positive_feedback_count INTEGER DEFAULT 0,
    negative_feedback_count INTEGER DEFAULT 0,
    recognition_received INTEGER DEFAULT 0,
    
    -- Additional Metrics
    additional_metrics JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(staff_id, metric_period, period_start)
);

-- Create indexes for performance
CREATE INDEX idx_staff_members_institute ON staff_members(institute_id);
CREATE INDEX idx_staff_members_status ON staff_members(employment_status);
CREATE INDEX idx_staff_members_department ON staff_members(department_id);
CREATE INDEX idx_staff_members_role ON staff_members(primary_role_id);
CREATE INDEX idx_staff_members_reporting ON staff_members(reports_to);

CREATE INDEX idx_departments_institute ON departments(institute_id);
CREATE INDEX idx_departments_parent ON departments(parent_department_id);
CREATE INDEX idx_departments_head ON departments(head_of_department);

CREATE INDEX idx_staff_roles_institute ON staff_roles(institute_id);
CREATE INDEX idx_staff_roles_parent ON staff_roles(parent_role_id);

CREATE INDEX idx_role_assignments_staff ON staff_role_assignments(staff_id);
CREATE INDEX idx_role_assignments_role ON staff_role_assignments(role_id);
CREATE INDEX idx_role_assignments_status ON staff_role_assignments(status);
CREATE INDEX idx_role_assignments_effective ON staff_role_assignments(effective_from, effective_until);

CREATE INDEX idx_teams_institute ON teams(institute_id);
CREATE INDEX idx_teams_department ON teams(department_id);
CREATE INDEX idx_teams_lead ON teams(team_lead);

CREATE INDEX idx_team_memberships_team ON team_memberships(team_id);
CREATE INDEX idx_team_memberships_staff ON team_memberships(staff_id);

CREATE INDEX idx_staff_activities_staff ON staff_activities(staff_id);
CREATE INDEX idx_staff_activities_type ON staff_activities(activity_type);
CREATE INDEX idx_staff_activities_date ON staff_activities(created_at);

CREATE INDEX idx_performance_metrics_staff ON staff_performance_metrics(staff_id);
CREATE INDEX idx_performance_metrics_period ON staff_performance_metrics(metric_period, period_start);
```

### API Implementation

```typescript
// app/api/institutes/[id]/staff/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const role = searchParams.get('role');
    const status = searchParams.get('status') || 'active';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeTeams = searchParams.get('includeTeams') === 'true';

    const user = await getCurrentUser();
    await verifyInstituteAccess(user.id, params.id, 'manager');

    let query = supabase
      .from('staff_members')
      .select(`
        *,
        departments(id, name, code),
        staff_roles(id, name, code, permissions),
        reports_to:reports_to(id, first_name, last_name),
        ${includeTeams ? 'team_memberships(teams(id, name, team_type)),' : ''}
        staff_performance_metrics(
          overall_score,
          productivity_score,
          period_start,
          period_end
        )
      `)
      .eq('institute_id', params.id)
      .eq('employment_status', status);

    // Apply filters
    if (department) {
      query = query.eq('department_id', department);
    }
    
    if (role) {
      query = query.eq('primary_role_id', role);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: staff, error, count } = await query;
    if (error) throw new DatabaseError('Failed to fetch staff', error);

    // Calculate additional metrics for each staff member
    const enrichedStaff = await Promise.all(
      staff.map(async (member) => ({
        ...member,
        activeTeamsCount: includeTeams 
          ? member.team_memberships?.filter(tm => tm.teams.status === 'active').length 
          : 0,
        recentPerformance: member.staff_performance_metrics
          ?.sort((a, b) => new Date(b.period_start).getTime() - new Date(a.period_start).getTime())
          ?.slice(0, 3),
        directReports: await getDirectReportsCount(member.id),
        currentWorkload: await calculateCurrentWorkload(member.id)
      }))
    );

    return NextResponse.json({
      success: true,
      data: {
        staff: enrichedStaff,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const staffData = await request.json();
    const user = await getCurrentUser();
    
    await verifyInstituteAccess(user.id, params.id, 'admin');

    // Validate staff data
    const validatedData = staffCreationSchema.parse(staffData);

    // Check for duplicate employee ID
    const { data: existingStaff } = await supabase
      .from('staff_members')
      .select('id')
      .eq('institute_id', params.id)
      .eq('employee_id', validatedData.employee_id)
      .single();

    if (existingStaff) {
      return NextResponse.json(
        { error: 'Employee ID already exists' },
        { status: 409 }
      );
    }

    // Start database transaction
    const { data: newStaff, error } = await supabase
      .from('staff_members')
      .insert({
        institute_id: params.id,
        ...validatedData,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw new DatabaseError('Failed to create staff member', error);

    // Create primary role assignment
    await supabase
      .from('staff_role_assignments')
      .insert({
        staff_id: newStaff.id,
        role_id: validatedData.primary_role_id,
        assignment_type: 'primary',
        assigned_by: user.id,
        assignment_reason: 'Initial role assignment during staff creation'
      });

    // Send invitation email if user account doesn't exist
    if (!validatedData.user_id) {
      await sendStaffInvitationEmail(newStaff);
    }

    // Log staff creation activity
    await logStaffActivity(user.id, 'staff_created', {
      staff_id: newStaff.id,
      staff_name: `${newStaff.first_name} ${newStaff.last_name}`,
      department_id: newStaff.department_id,
      role_id: newStaff.primary_role_id
    });

    return NextResponse.json({
      success: true,
      data: newStaff,
      message: 'Staff member created successfully'
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error);
  }
}

// app/api/institutes/[id]/staff/[staffId]/roles/route.ts
export async function PUT(
  request: Request,
  { params }: { params: { id: string; staffId: string } }
) {
  try {
    const { roleAssignments } = await request.json();
    const user = await getCurrentUser();
    
    await verifyInstituteAccess(user.id, params.id, 'admin');

    // Validate role assignments
    const validatedAssignments = roleAssignments.map(assignment =>
      roleAssignmentSchema.parse(assignment)
    );

    // Get current staff member
    const { data: staff } = await supabase
      .from('staff_members')
      .select('*')
      .eq('id', params.staffId)
      .single();

    if (!staff) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    // Start transaction for role updates
    const { data: updatedAssignments, error } = await supabase.rpc('update_staff_roles', {
      staff_id: params.staffId,
      new_assignments: validatedAssignments,
      assigned_by: user.id
    });

    if (error) throw new DatabaseError('Failed to update staff roles', error);

    // Update staff member's primary role if changed
    const primaryAssignment = validatedAssignments.find(a => a.assignment_type === 'primary');
    if (primaryAssignment && primaryAssignment.role_id !== staff.primary_role_id) {
      await supabase
        .from('staff_members')
        .update({
          primary_role_id: primaryAssignment.role_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.staffId);
    }

    // Log role assignment activity
    await logStaffActivity(user.id, 'roles_updated', {
      staff_id: params.staffId,
      old_assignments: await getCurrentRoleAssignments(params.staffId),
      new_assignments: validatedAssignments
    });

    // Send notification to staff member about role changes
    await sendRoleChangeNotification(params.staffId, validatedAssignments);

    return NextResponse.json({
      success: true,
      data: updatedAssignments,
      message: 'Staff roles updated successfully'
    });

  } catch (error) {
    return handleApiError(error);
  }
}

// app/api/institutes/[id]/departments/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStaffCount = searchParams.get('includeStaffCount') === 'true';
    const hierarchical = searchParams.get('hierarchical') === 'true';

    const user = await getCurrentUser();
    await verifyInstituteAccess(user.id, params.id, 'manager');

    let query = supabase
      .from('departments')
      .select(`
        *,
        head_of_department:head_of_department(id, first_name, last_name),
        deputy_head:deputy_head(id, first_name, last_name),
        institute_branches(id, name, code)
      `)
      .eq('institute_id', params.id)
      .eq('status', 'active');

    if (hierarchical) {
      query = query.order('hierarchy_path');
    } else {
      query = query.order('name');
    }

    const { data: departments, error } = await query;
    if (error) throw new DatabaseError('Failed to fetch departments', error);

    // Calculate staff counts if requested
    const enrichedDepartments = await Promise.all(
      departments.map(async (dept) => ({
        ...dept,
        staffCount: includeStaffCount ? await getStaffCountByDepartment(dept.id) : 0,
        teamsCount: await getTeamsCountByDepartment(dept.id),
        subDepartmentsCount: await getSubDepartmentsCount(dept.id)
      }))
    );

    // Build hierarchical structure if requested
    const result = hierarchical 
      ? buildHierarchicalDepartments(enrichedDepartments)
      : enrichedDepartments;

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    return handleApiError(error);
  }
}

// app/api/institutes/[id]/teams/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const teamData = await request.json();
    const user = await getCurrentUser();
    
    await verifyInstituteAccess(user.id, params.id, 'manager');

    // Validate team data
    const validatedData = teamCreationSchema.parse(teamData);

    // Create team
    const { data: newTeam, error } = await supabase
      .from('teams')
      .insert({
        institute_id: params.id,
        ...validatedData
      })
      .select()
      .single();

    if (error) throw new DatabaseError('Failed to create team', error);

    // Add initial team members if provided
    if (validatedData.initialMembers && validatedData.initialMembers.length > 0) {
      const membershipInserts = validatedData.initialMembers.map(member => ({
        team_id: newTeam.id,
        staff_id: member.staff_id,
        role_in_team: member.role_in_team || 'member',
        responsibilities: member.responsibilities || []
      }));

      await supabase
        .from('team_memberships')
        .insert(membershipInserts);
    }

    // Log team creation activity
    await logStaffActivity(user.id, 'team_created', {
      team_id: newTeam.id,
      team_name: newTeam.name,
      team_type: newTeam.team_type,
      initial_members_count: validatedData.initialMembers?.length || 0
    });

    return NextResponse.json({
      success: true,
      data: newTeam,
      message: 'Team created successfully'
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error);
  }
}
```

### Service Layer Implementation

```typescript
// services/StaffManagementService.ts
export class StaffManagementService {
  async calculateStaffPerformance(staffId: string, period: string): Promise<PerformanceMetrics> {
    const activities = await this.getStaffActivities(staffId, period);
    const goals = await this.getStaffGoals(staffId, period);
    const feedback = await this.getStaffFeedback(staffId, period);

    const metrics: PerformanceMetrics = {
      productivity_score: this.calculateProductivityScore(activities),
      quality_score: this.calculateQualityScore(activities, feedback),
      collaboration_score: this.calculateCollaborationScore(activities),
      innovation_score: this.calculateInnovationScore(activities, feedback),
      goal_achievement_rate: this.calculateGoalAchievement(goals),
      overall_score: 0
    };

    // Calculate weighted overall score
    metrics.overall_score = (
      metrics.productivity_score * 0.3 +
      metrics.quality_score * 0.25 +
      metrics.collaboration_score * 0.2 +
      metrics.innovation_score * 0.15 +
      metrics.goal_achievement_rate * 0.1
    );

    return metrics;
  }

  async validateRoleAssignment(
    staffId: string, 
    roleId: string, 
    assignmentType: string
  ): Promise<ValidationResult> {
    // Check role conflicts
    const currentRoles = await this.getCurrentRoles(staffId);
    const newRole = await this.getRoleById(roleId);
    
    // Validate role hierarchy
    if (assignmentType === 'primary') {
      const conflictingRoles = currentRoles.filter(role => 
        this.hasRoleConflict(role, newRole)
      );
      
      if (conflictingRoles.length > 0) {
        return {
          isValid: false,
          errors: [`Role conflicts with existing roles: ${conflictingRoles.map(r => r.name).join(', ')}`]
        };
      }
    }

    // Check department restrictions
    const staff = await this.getStaffById(staffId);
    if (newRole.department_restrictions && 
        !newRole.department_restrictions.includes(staff.department_id)) {
      return {
        isValid: false,
        errors: ['Role not allowed for staff member\'s department']
      };
    }

    // Check maximum assignments
    if (newRole.max_assignments) {
      const currentAssignments = await this.getRoleAssignmentCount(roleId);
      if (currentAssignments >= newRole.max_assignments) {
        return {
          isValid: false,
          errors: ['Role has reached maximum assignment limit']
        };
      }
    }

    return { isValid: true, errors: [] };
  }

  async generateOrganizationChart(
    instituteId: string, 
    options: OrgChartOptions = {}
  ): Promise<OrganizationChart> {
    const staff = await supabase
      .from('staff_members')
      .select(`
        id, first_name, last_name, designation, department_id, reports_to,
        departments(name, code),
        staff_roles(name, code),
        profile_picture_url
      `)
      .eq('institute_id', instituteId)
      .eq('employment_status', 'active');

    const departments = await supabase
      .from('departments')
      .select('*')
      .eq('institute_id', instituteId)
      .eq('status', 'active');

    // Build hierarchical structure
    const orgChart = this.buildOrganizationStructure(staff.data, departments.data, options);
    
    return {
      structure: orgChart,
      totalStaff: staff.data.length,
      departmentCount: departments.data.length,
      averageTeamSize: this.calculateAverageTeamSize(staff.data),
      managementLevels: this.calculateManagementLevels(orgChart)
    };
  }

  private buildOrganizationStructure(
    staff: any[], 
    departments: any[], 
    options: OrgChartOptions
  ): OrgNode[] {
    const staffMap = new Map(staff.map(s => [s.id, s]));
    const rootNodes: OrgNode[] = [];

    // Find top-level managers (no reports_to or reports to someone outside institute)
    const topLevelStaff = staff.filter(s => 
      !s.reports_to || !staffMap.has(s.reports_to)
    );

    topLevelStaff.forEach(topStaff => {
      const node = this.buildNodeRecursively(topStaff, staff, staffMap, options);
      rootNodes.push(node);
    });

    return rootNodes;
  }

  private buildNodeRecursively(
    staff: any, 
    allStaff: any[], 
    staffMap: Map<string, any>,
    options: OrgChartOptions
  ): OrgNode {
    const directReports = allStaff.filter(s => s.reports_to === staff.id);
    
    return {
      id: staff.id,
      name: `${staff.first_name} ${staff.last_name}`,
      designation: staff.designation,
      department: staff.departments?.name,
      profilePicture: staff.profile_picture_url,
      email: staff.primary_email,
      role: staff.staff_roles?.name,
      directReportsCount: directReports.length,
      children: directReports.map(report => 
        this.buildNodeRecursively(report, allStaff, staffMap, options)
      )
    };
  }

  async auditStaffActivity(
    instituteId: string, 
    filters: ActivityFilters
  ): Promise<ActivityAuditReport> {
    const baseQuery = supabase
      .from('staff_activities')
      .select(`
        *,
        staff_members(first_name, last_name, employee_id, departments(name))
      `)
      .eq('staff_members.institute_id', instituteId);

    // Apply filters
    let query = baseQuery;
    
    if (filters.staffId) {
      query = query.eq('staff_id', filters.staffId);
    }
    
    if (filters.activityType) {
      query = query.eq('activity_type', filters.activityType);
    }
    
    if (filters.dateRange) {
      query = query
        .gte('created_at', filters.dateRange.start)
        .lte('created_at', filters.dateRange.end);
    }

    if (filters.department) {
      query = query.eq('staff_members.department_id', filters.department);
    }

    const { data: activities, error } = await query
      .order('created_at', { ascending: false })
      .limit(filters.limit || 1000);

    if (error) throw error;

    return {
      activities: activities,
      summary: {
        totalActivities: activities.length,
        uniqueStaff: new Set(activities.map(a => a.staff_id)).size,
        activityTypes: this.groupByActivityType(activities),
        hourlyDistribution: this.calculateHourlyDistribution(activities),
        departmentDistribution: this.calculateDepartmentDistribution(activities)
      }
    };
  }
}

// services/RoleManagementService.ts
export class RoleManagementService {
  async createCustomRole(
    instituteId: string, 
    roleData: CustomRoleData
  ): Promise<StaffRole> {
    // Validate permissions
    const validatedPermissions = await this.validatePermissions(roleData.permissions);
    
    // Check for role name conflicts
    const existingRole = await supabase
      .from('staff_roles')
      .select('id')
      .eq('institute_id', instituteId)
      .eq('name', roleData.name)
      .single();

    if (existingRole.data) {
      throw new Error('Role name already exists');
    }

    // Create role
    const { data: newRole, error } = await supabase
      .from('staff_roles')
      .insert({
        institute_id: instituteId,
        name: roleData.name,
        code: roleData.code || this.generateRoleCode(roleData.name),
        description: roleData.description,
        permissions: validatedPermissions,
        access_levels: roleData.accessLevels,
        data_access_scope: roleData.dataAccessScope || 'own',
        is_custom_role: true,
        max_assignments: roleData.maxAssignments,
        requires_approval: roleData.requiresApproval || false
      })
      .select()
      .single();

    if (error) throw error;

    return newRole;
  }

  async validatePermissions(permissions: Permission[]): Promise<Permission[]> {
    const validPermissions: Permission[] = [];
    
    for (const permission of permissions) {
      // Check if permission exists in system
      const { data: systemPermission } = await supabase
        .from('permissions')
        .select('*')
        .eq('code', permission.code)
        .single();

      if (systemPermission) {
        validPermissions.push({
          ...permission,
          id: systemPermission.id,
          validated: true
        });
      } else {
        // Log invalid permission for review
        console.warn(`Invalid permission code: ${permission.code}`);
      }
    }

    return validPermissions;
  }

  async calculateEffectivePermissions(staffId: string): Promise<EffectivePermissions> {
    // Get all role assignments for staff
    const { data: assignments } = await supabase
      .from('staff_role_assignments')
      .select(`
        *,
        staff_roles(permissions, access_levels, data_access_scope)
      `)
      .eq('staff_id', staffId)
      .eq('status', 'active')
      .or(
        `effective_until.is.null,effective_until.gte.${new Date().toISOString()}`
      );

    // Get staff member's custom permissions
    const { data: staff } = await supabase
      .from('staff_members')
      .select('custom_permissions')
      .eq('id', staffId)
      .single();

    // Combine all permissions
    const allPermissions = new Set();
    const accessLevels = new Map();
    let dataAccessScope = 'own';

    // Process role permissions
    assignments?.forEach(assignment => {
      const role = assignment.staff_roles;
      
      // Add role permissions
      role.permissions.forEach(permission => {
        allPermissions.add(permission.code);
      });

      // Merge access levels (take highest level)
      Object.entries(role.access_levels).forEach(([module, level]) => {
        const currentLevel = accessLevels.get(module) || 0;
        accessLevels.set(module, Math.max(currentLevel, level));
      });

      // Take broadest data access scope
      const scopePriority = { own: 1, department: 2, branch: 3, institute: 4, all: 5 };
      if (scopePriority[role.data_access_scope] > scopePriority[dataAccessScope]) {
        dataAccessScope = role.data_access_scope;
      }
    });

    // Add custom permissions
    staff?.custom_permissions?.forEach(permission => {
      allPermissions.add(permission.code);
    });

    return {
      permissions: Array.from(allPermissions),
      accessLevels: Object.fromEntries(accessLevels),
      dataAccessScope,
      lastCalculated: new Date().toISOString()
    };
  }
}
```

## 🧪 Testing Requirements

### Unit Tests
```typescript
describe('StaffManagementService', () => {
  test('calculates staff performance correctly', async () => {
    const staffId = 'staff-123';
    const period = 'monthly';
    
    const performance = await staffService.calculateStaffPerformance(staffId, period);
    
    expect(performance.overall_score).toBeGreaterThan(0);
    expect(performance.overall_score).toBeLessThanOrEqual(1);
    expect(performance).toHaveProperty('productivity_score');
    expect(performance).toHaveProperty('quality_score');
  });

  test('validates role assignments correctly', async () => {
    const staffId = 'staff-123';
    const roleId = 'role-admin';
    
    const validation = await staffService.validateRoleAssignment(staffId, roleId, 'primary');
    
    expect(validation.isValid).toBeDefined();
    if (!validation.isValid) {
      expect(validation.errors).toBeInstanceOf(Array);
    }
  });

  test('generates organization chart structure', async () => {
    const instituteId = 'inst-123';
    
    const orgChart = await staffService.generateOrganizationChart(instituteId);
    
    expect(orgChart.structure).toBeInstanceOf(Array);
    expect(orgChart.totalStaff).toBeGreaterThan(0);
    expect(orgChart.managementLevels).toBeGreaterThan(0);
  });
});

describe('RoleManagementService', () => {
  test('creates custom role successfully', async () => {
    const roleData = {
      name: 'Custom Manager',
      permissions: [{ code: 'staff.read' }, { code: 'staff.update' }],
      dataAccessScope: 'department'
    };
    
    const newRole = await roleService.createCustomRole('inst-123', roleData);
    
    expect(newRole.name).toBe('Custom Manager');
    expect(newRole.is_custom_role).toBe(true);
  });

  test('calculates effective permissions correctly', async () => {
    const staffId = 'staff-123';
    
    const permissions = await roleService.calculateEffectivePermissions(staffId);
    
    expect(permissions.permissions).toBeInstanceOf(Array);
    expect(permissions.dataAccessScope).toBeDefined();
    expect(['own', 'department', 'branch', 'institute', 'all']).toContain(permissions.dataAccessScope);
  });
});
```

## 📊 Success Metrics
- Staff onboarding completion rate > 95%
- Role assignment accuracy > 99%
- Permission calculation response time < 200ms
- Activity tracking data integrity > 99.5%
- Organization chart generation < 1 second

## 📋 Definition of Done
- [ ] All staff CRUD operations implemented
- [ ] Role-based access control system functional
- [ ] Department and team management working
- [ ] Performance tracking system operational
- [ ] Security and audit logging complete
- [ ] Organization chart generation working
- [ ] Staff invitation workflow functional
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests complete
- [ ] Performance benchmarks met

## 🔗 Dependencies
- TASK-01-01 (Database Schema)
- TASK-02-01 (Branch Management)
- Authentication system
- Email service integration
- File storage for profile pictures
- Performance metrics calculation engine

## ⚡ Performance Optimization
- Database indexing for staff queries
- Caching for role permissions
- Batch operations for staff updates
- Background processing for performance calculations
- Optimized organization chart generation

## 📝 Notes
- Implement data encryption for sensitive staff information
- Consider implementing advanced analytics for workforce management
- Plan for integration with HR systems
- Prepare for compliance with labor laws
- Design for scalability with large staff numbers

---

**Task Owner**: Backend Engineer
**Reviewer**: Tech Lead + HR Manager
**Created**: 2024-01-20
**Due Date**: 2024-02-18