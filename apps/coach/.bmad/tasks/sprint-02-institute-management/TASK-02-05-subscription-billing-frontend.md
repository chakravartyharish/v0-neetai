# TASK-02-05: Subscription & Billing Management Frontend System

## 📋 Task Details
**Task ID**: TASK-02-05
**Story Reference**: STORY-01-06 (Subscription & Billing Management)
**Sprint**: Sprint 2
**Phase**: Frontend
**Priority**: P0 (Critical)
**Estimated Effort**: 4 days
**Assignee**: Frontend Engineer + UX Designer
**Dependencies**: TASK-02-04 (Subscription & Billing Management Backend)

## 🎯 Task Description
Create comprehensive frontend interfaces for subscription and billing management including subscription overview dashboard, plan selection and upgrade flow, payment method management, invoice history and downloads, usage tracking visualization, billing analytics, and payment flow integration with secure payment processing UI components.

## 📋 Acceptance Criteria

### AC-01: Subscription Overview Dashboard
- [ ] Current subscription status and plan details display
- [ ] Usage meters and progress indicators for plan limits
- [ ] Billing cycle timeline and next payment date
- [ ] Quick actions for plan changes and payment methods
- [ ] Real-time subscription status updates

### AC-02: Plan Management and Upgrades
- [ ] Interactive plan comparison and selection interface
- [ ] Upgrade/downgrade flow with proration preview
- [ ] Trial period management and conversion tracking
- [ ] Custom enterprise plan request form
- [ ] Plan feature comparison matrix

### AC-03: Payment Method Management
- [ ] Secure payment method addition and removal
- [ ] Multiple payment gateway integration (Stripe, Razorpay)
- [ ] Payment method verification and validation
- [ ] Default payment method selection
- [ ] Payment history and transaction details

### AC-04: Billing and Invoice Management
- [ ] Invoice history with download functionality
- [ ] Payment receipt generation and viewing
- [ ] Billing address management
- [ ] Tax information display and configuration
- [ ] Failed payment recovery flow

### AC-05: Usage Analytics and Reporting
- [ ] Usage tracking visualizations and charts
- [ ] Billing projections and forecasting
- [ ] Cost optimization recommendations
- [ ] Usage alerts and notifications
- [ ] Historical usage trend analysis

## 🔧 Technical Implementation

### Component Architecture

```typescript
// components/billing/SubscriptionDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  CreditCard,
  TrendingUp,
  Settings,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Button,
  Badge,
  Progress,
  Alert,
  AlertDescription,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui';
import { formatCurrency, formatDate, formatUsage } from '@/lib/utils';

interface SubscriptionData {
  id: string;
  status: 'trial' | 'active' | 'past_due' | 'canceled' | 'paused';
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    billing_interval: string;
    features: Record<string, any>;
    usage_limits: Record<string, number>;
  };
  current_period_start: string;
  current_period_end: string;
  next_billing_date: string;
  trial_end?: string;
  current_usage: Record<string, number>;
  payment_method: {
    type: string;
    last4?: string;
    brand?: string;
    exp_month?: number;
    exp_year?: number;
  };
}

interface SubscriptionDashboardProps {
  instituteId: string;
}

export const SubscriptionDashboard: React.FC<SubscriptionDashboardProps> = ({ instituteId }) => {
  const [showUpgradeFlow, setShowUpgradeFlow] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const queryClient = useQueryClient();

  // Fetch current subscription
  const {
    data: subscription,
    isLoading: subscriptionLoading,
    error: subscriptionError,
    refetch: refetchSubscription
  } = useQuery({
    queryKey: ['subscription', instituteId],
    queryFn: async () => {
      const response = await fetch(`/api/institutes/${instituteId}/subscriptions?includeUsage=true&includeBilling=true`);
      if (!response.ok) throw new Error('Failed to fetch subscription');
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Fetch available plans
  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const response = await fetch('/api/subscription-plans');
      if (!response.ok) throw new Error('Failed to fetch plans');
      return response.json();
    },
  });

  // Fetch billing history
  const { data: billingHistory } = useQuery({
    queryKey: ['billing-history', instituteId],
    queryFn: async () => {
      const response = await fetch(`/api/institutes/${instituteId}/billing/invoices?limit=5`);
      if (!response.ok) throw new Error('Failed to fetch billing history');
      return response.json();
    },
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      const response = await fetch(`/api/institutes/${instituteId}/subscriptions/${subscription?.data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          cancelAtPeriodEnd: true,
          reason
        }),
      });
      if (!response.ok) throw new Error('Failed to cancel subscription');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });

  const getStatusColor = (status: string) => {
    const colors = {
      trial: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      past_due: 'bg-red-100 text-red-800',
      canceled: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'trial':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'past_due':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'canceled':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Settings className="h-4 w-4 text-gray-600" />;
    }
  };

  const calculateUsagePercentage = (current: number, limit: number): number => {
    if (limit === 0 || !limit) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  const getDaysUntilBilling = (date: string): number => {
    return Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (subscriptionError || !subscription?.data) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Subscription</h2>
        <p className="text-gray-600 mb-6">Get started with a subscription plan to access all features.</p>
        <Button onClick={() => setShowUpgradeFlow(true)}>
          Choose a Plan
        </Button>
      </div>
    );
  }

  const subscriptionData: SubscriptionData = subscription.data;
  const daysUntilBilling = getDaysUntilBilling(subscriptionData.next_billing_date);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription, billing, and usage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetchSubscription()}>
            Refresh
          </Button>
          <Button onClick={() => setShowUpgradeFlow(true)}>
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {subscriptionData.status === 'past_due' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Your payment is past due. Please update your payment method to avoid service interruption.
            <Button variant="link" className="p-0 h-auto text-red-600 ml-2">
              Update Payment Method
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {subscriptionData.trial_end && new Date(subscriptionData.trial_end) > new Date() && (
        <Alert className="border-blue-200 bg-blue-50">
          <Calendar className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Your trial ends on {formatDate(subscriptionData.trial_end)}. 
            <Button variant="link" className="p-0 h-auto text-blue-600 ml-2">
              Upgrade Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(subscriptionData.status)}
                  Current Plan: {subscriptionData.plan.name}
                </CardTitle>
                <CardDescription>
                  {formatCurrency(subscriptionData.plan.price, subscriptionData.plan.currency)} per {subscriptionData.plan.billing_interval}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(subscriptionData.status)}>
                {subscriptionData.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Billing Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Current Period</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(subscriptionData.current_period_start)} - {formatDate(subscriptionData.current_period_end)}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Next Billing</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(subscriptionData.next_billing_date)} 
                  <span className="text-xs text-gray-500 ml-1">
                    ({daysUntilBilling} days)
                  </span>
                </p>
              </div>
            </div>

            {/* Usage Meters */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Usage This Period</h4>
              {Object.entries(subscriptionData.plan.usage_limits).map(([usageType, limit]) => {
                const current = subscriptionData.current_usage[usageType] || 0;
                const percentage = calculateUsagePercentage(current, limit);
                const isNearLimit = percentage > 80;
                
                return (
                  <div key={usageType} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">
                        {usageType.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatUsage(current, usageType)} / {formatUsage(limit, usageType)}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${isNearLimit ? 'bg-red-100' : 'bg-gray-100'}`}
                    />
                    {isNearLimit && (
                      <p className="text-xs text-red-600">
                        ⚠️ Approaching limit - consider upgrading your plan
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Payment Method */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">Payment Method</h4>
                  <p className="text-sm text-gray-600">
                    {subscriptionData.payment_method.brand} •••• {subscriptionData.payment_method.last4}
                    {subscriptionData.payment_method.exp_month && subscriptionData.payment_method.exp_year && (
                      <span className="ml-2">
                        Expires {subscriptionData.payment_method.exp_month}/{subscriptionData.payment_method.exp_year}
                      </span>
                    )}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={() => setShowUpgradeFlow(true)}>
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
              <Button variant="outline" onClick={() => setShowUpgradeFlow(true)}>
                <ArrowDown className="h-4 w-4 mr-2" />
                Downgrade Plan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => cancelSubscriptionMutation.mutate({ reason: 'User requested cancellation' })}
                disabled={cancelSubscriptionMutation.isPending}
              >
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(subscriptionData.plan.price, subscriptionData.plan.currency)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {subscriptionData.current_usage.students || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Plan Utilization</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(
                      Object.entries(subscriptionData.plan.usage_limits).reduce((acc, [type, limit]) => {
                        const current = subscriptionData.current_usage[type] || 0;
                        return acc + calculateUsagePercentage(current, limit);
                      }, 0) / Object.keys(subscriptionData.plan.usage_limits).length
                    )}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Invoices */}
      {billingHistory?.data?.invoices?.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Invoices</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {billingHistory.data.invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium">
                      Invoice #{invoice.invoice_number}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(invoice.created_at)} • {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {invoice.status}
                    </Badge>
                    <span className="font-medium">
                      {formatCurrency(invoice.total_amount / 100, invoice.currency)}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Selection Dialog */}
      <PlanSelectionDialog
        open={showUpgradeFlow}
        onOpenChange={setShowUpgradeFlow}
        currentPlan={subscriptionData.plan}
        availablePlans={plans?.data || []}
        instituteId={instituteId}
        onSuccess={() => {
          setShowUpgradeFlow(false);
          queryClient.invalidateQueries({ queryKey: ['subscription'] });
        }}
      />
    </div>
  );
};

// components/billing/PlanSelectionDialog.tsx
interface PlanSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: any;
  availablePlans: any[];
  instituteId: string;
  onSuccess: () => void;
}

export const PlanSelectionDialog: React.FC<PlanSelectionDialogProps> = ({
  open,
  onOpenChange,
  currentPlan,
  availablePlans,
  instituteId,
  onSuccess
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [prorationPreview, setProrationPreview] = useState<any>(null);

  const changeSubscriptionMutation = useMutation({
    mutationFn: async ({ planId }: { planId: string }) => {
      const response = await fetch(`/api/institutes/${instituteId}/subscriptions/${currentPlan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upgrade',
          planId,
          prorationBehavior: 'create_prorations'
        }),
      });
      if (!response.ok) throw new Error('Failed to change subscription');
      return response.json();
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    
    // Fetch proration preview
    try {
      const response = await fetch(`/api/institutes/${instituteId}/subscriptions/preview-change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlanId: currentPlan.id,
          newPlanId: planId
        }),
      });
      if (response.ok) {
        const preview = await response.json();
        setProrationPreview(preview.data);
      }
    } catch (error) {
      console.error('Failed to fetch proration preview:', error);
    }
  };

  const handleConfirmChange = () => {
    if (selectedPlan) {
      changeSubscriptionMutation.mutate({ planId: selectedPlan });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {availablePlans.map((plan) => (
            <motion.div
              key={plan.id}
              className={`
                border-2 rounded-lg p-6 cursor-pointer transition-all
                ${selectedPlan === plan.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}
                ${plan.id === currentPlan.id ? 'bg-blue-50' : 'bg-white'}
              `}
              onClick={() => handlePlanSelect(plan.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {plan.id === currentPlan.id && (
                <Badge className="mb-4 bg-blue-100 text-blue-800">Current Plan</Badge>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-1">
                {formatCurrency(plan.base_price, plan.currency)}
                <span className="text-sm font-normal text-gray-600">/{plan.billing_interval}</span>
              </p>
              
              <ul className="space-y-2 mt-4">
                {Object.entries(plan.features).map(([feature, value]) => (
                  <li key={feature} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="capitalize">{feature.replace('_', ' ')}: {value}</span>
                  </li>
                ))}
              </ul>

              {Object.entries(plan.usage_limits).map(([type, limit]) => (
                <div key={type} className="mt-2 text-sm text-gray-600">
                  <span className="capitalize">{type.replace('_', ' ')}: </span>
                  <span className="font-medium">{formatUsage(limit, type)}</span>
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {prorationPreview && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Billing Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Proration Credit</span>
                  <span>{formatCurrency(prorationPreview.credit, prorationPreview.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>New Plan Charge</span>
                  <span>{formatCurrency(prorationPreview.charge, prorationPreview.currency)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total Due Today</span>
                  <span>{formatCurrency(prorationPreview.total, prorationPreview.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmChange}
            disabled={!selectedPlan || selectedPlan === currentPlan.id || changeSubscriptionMutation.isPending}
          >
            {changeSubscriptionMutation.isPending ? 'Updating...' : 'Confirm Change'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

### Payment Method Management

```typescript
// components/billing/PaymentMethodManagement.tsx
export const PaymentMethodManagement: React.FC<{ instituteId: string }> = ({ instituteId }) => {
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'stripe' | 'razorpay'>('stripe');

  const { data: paymentMethods, refetch } = useQuery({
    queryKey: ['payment-methods', instituteId],
    queryFn: async () => {
      const response = await fetch(`/api/institutes/${instituteId}/payment-methods`);
      if (!response.ok) throw new Error('Failed to fetch payment methods');
      return response.json();
    },
  });

  const deletePaymentMethodMutation = useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const response = await fetch(`/api/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete payment method');
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const setDefaultPaymentMethodMutation = useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const response = await fetch(`/api/payment-methods/${paymentMethodId}/set-default`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to set default payment method');
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Methods</h2>
        <Button onClick={() => setShowAddPaymentMethod(true)}>
          <CreditCard className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid gap-4">
        {paymentMethods?.data?.map((method) => (
          <Card key={method.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {method.card_brand} •••• {method.card_last4}
                    </p>
                    <p className="text-sm text-gray-600">
                      Expires {method.card_exp_month}/{method.card_exp_year}
                    </p>
                    {method.is_default && (
                      <Badge className="mt-1 bg-green-100 text-green-800">Default</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!method.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultPaymentMethodMutation.mutate(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deletePaymentMethodMutation.mutate(method.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddPaymentMethodDialog
        open={showAddPaymentMethod}
        onOpenChange={setShowAddPaymentMethod}
        instituteId={instituteId}
        selectedProvider={selectedProvider}
        onProviderChange={setSelectedProvider}
        onSuccess={() => {
          setShowAddPaymentMethod(false);
          refetch();
        }}
      />
    </div>
  );
};

// components/billing/AddPaymentMethodDialog.tsx
export const AddPaymentMethodDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instituteId: string;
  selectedProvider: 'stripe' | 'razorpay';
  onProviderChange: (provider: 'stripe' | 'razorpay') => void;
  onSuccess: () => void;
}> = ({ open, onOpenChange, instituteId, selectedProvider, onProviderChange, onSuccess }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
        </DialogHeader>
        
        <Tabs value={selectedProvider} onValueChange={onProviderChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stripe">Credit Card</TabsTrigger>
            <TabsTrigger value="razorpay">UPI / Net Banking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stripe" className="space-y-4">
            <StripePaymentForm
              instituteId={instituteId}
              onSuccess={onSuccess}
            />
          </TabsContent>
          
          <TabsContent value="razorpay" className="space-y-4">
            <RazorpayPaymentForm
              instituteId={instituteId}
              onSuccess={onSuccess}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
```

### Usage Analytics Dashboard

```typescript
// components/billing/UsageAnalytics.tsx
export const UsageAnalytics: React.FC<{ instituteId: string }> = ({ instituteId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const { data: usageData, isLoading } = useQuery({
    queryKey: ['usage-analytics', instituteId, selectedPeriod],
    queryFn: async () => {
      const response = await fetch(`/api/institutes/${instituteId}/billing/usage?period=${selectedPeriod}`);
      if (!response.ok) throw new Error('Failed to fetch usage data');
      return response.json();
    },
  });

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
        <h2 className="text-2xl font-bold">Usage Analytics</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {usageData?.data?.summary?.map((item) => (
          <Card key={item.type}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">
                    {item.type.replace('_', ' ')}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatUsage(item.current, item.type)}
                  </p>
                  <p className="text-xs text-gray-500">
                    of {formatUsage(item.limit, item.type)} limit
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    item.trend > 0 ? 'text-green-600' : item.trend < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {item.trend > 0 ? '+' : ''}{item.trend}%
                  </p>
                  <p className="text-xs text-gray-500">vs last {selectedPeriod}</p>
                </div>
              </div>
              <Progress 
                value={(item.current / item.limit) * 100} 
                className="mt-3 h-2"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usage Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageTrendChart data={usageData?.data?.trends || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CostBreakdownChart data={usageData?.data?.costs || []} />
          </CardContent>
        </Card>
      </div>

      {/* Usage Recommendations */}
      {usageData?.data?.recommendations?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usageData.data.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">{recommendation.title}</h4>
                    <p className="text-sm text-blue-700">{recommendation.description}</p>
                    {recommendation.potential_savings && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        Potential savings: {formatCurrency(recommendation.potential_savings, 'INR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
```

## 🧪 Testing Strategy

### Component Tests
```typescript
describe('SubscriptionDashboard', () => {
  it('displays subscription status correctly', async () => {
    const mockSubscription = {
      data: {
        id: 'sub-123',
        status: 'active',
        plan: {
          name: 'Professional',
          price: 2999,
          currency: 'INR'
        }
      }
    };

    render(<SubscriptionDashboard instituteId="inst-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Current Plan: Professional')).toBeInTheDocument();
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    });
  });

  it('shows usage meters correctly', async () => {
    const mockData = {
      data: {
        plan: {
          usage_limits: { students: 100 }
        },
        current_usage: { students: 75 }
      }
    };

    render(<SubscriptionDashboard instituteId="inst-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('75 / 100')).toBeInTheDocument();
    });
  });
});

describe('PlanSelectionDialog', () => {
  it('allows plan selection and shows proration preview', async () => {
    const mockPlans = [
      { id: 'plan-1', name: 'Basic', base_price: 999 },
      { id: 'plan-2', name: 'Pro', base_price: 2999 }
    ];

    render(
      <PlanSelectionDialog
        open={true}
        onOpenChange={() => {}}
        currentPlan={{ id: 'plan-1' }}
        availablePlans={mockPlans}
        instituteId="inst-1"
        onSuccess={() => {}}
      />
    );

    const proButton = screen.getByText('Pro');
    fireEvent.click(proButton);

    await waitFor(() => {
      expect(screen.getByText('Billing Preview')).toBeInTheDocument();
    });
  });
});
```

### Integration Tests
```typescript
describe('Billing Flow Integration', () => {
  it('handles complete upgrade flow', async () => {
    const user = userEvent.setup();

    render(<SubscriptionDashboard instituteId="inst-1" />);
    
    // Click upgrade plan
    const upgradeButton = screen.getByText('Upgrade Plan');
    await user.click(upgradeButton);
    
    // Select new plan
    const premiumPlan = screen.getByText('Premium Plan');
    await user.click(premiumPlan);
    
    // Confirm upgrade
    const confirmButton = screen.getByText('Confirm Change');
    await user.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText('Plan upgraded successfully')).toBeInTheDocument();
    });
  });

  it('handles payment method addition', async () => {
    const user = userEvent.setup();
    
    render(<PaymentMethodManagement instituteId="inst-1" />);
    
    const addButton = screen.getByText('Add Payment Method');
    await user.click(addButton);
    
    // Fill payment form
    await user.type(screen.getByLabelText('Card Number'), '4242424242424242');
    await user.type(screen.getByLabelText('Expiry'), '12/25');
    await user.type(screen.getByLabelText('CVC'), '123');
    
    const saveButton = screen.getByText('Save Payment Method');
    await user.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Payment method added successfully')).toBeInTheDocument();
    });
  });
});
```

## 📊 Performance Optimization

### Lazy Loading
```typescript
// Lazy load heavy components
const UsageAnalytics = lazy(() => import('./UsageAnalytics'));
const PaymentMethodManagement = lazy(() => import('./PaymentMethodManagement'));
const InvoiceHistory = lazy(() => import('./InvoiceHistory'));
```

### Optimized Queries
```typescript
// Use React Query with proper caching and refetch strategies
const useSubscriptionQuery = (instituteId: string) => {
  return useQuery({
    queryKey: ['subscription', instituteId],
    queryFn: () => fetchSubscription(instituteId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds for subscription status
    refetchIntervalInBackground: false,
  });
};

const useUsageQuery = (instituteId: string, period: string) => {
  return useQuery({
    queryKey: ['usage', instituteId, period],
    queryFn: () => fetchUsageData(instituteId, period),
    staleTime: 2 * 60 * 1000, // 2 minutes for usage data
    refetchOnWindowFocus: false,
  });
};
```

### Memoized Components
```typescript
// Memoize expensive calculations
const UsageMeter = memo(({ current, limit, type }) => {
  const percentage = useMemo(() => 
    calculateUsagePercentage(current, limit), 
    [current, limit]
  );
  
  const isNearLimit = useMemo(() => 
    percentage > 80, 
    [percentage]
  );
  
  return (
    <div className="space-y-2">
      <Progress value={percentage} />
      {isNearLimit && <UsageLimitWarning />}
    </div>
  );
});
```

## 📋 Definition of Done

- [ ] Subscription dashboard with real-time status implemented
- [ ] Plan upgrade/downgrade flow with proration working
- [ ] Payment method management interface complete
- [ ] Usage analytics with visualizations operational
- [ ] Invoice history and download functionality ready
- [ ] Secure payment processing integration working
- [ ] Billing alerts and notifications implemented
- [ ] Mobile-responsive design complete
- [ ] Accessibility compliance (WCAG 2.1 AA) achieved
- [ ] Loading states and error handling implemented
- [ ] Component tests passing (>85% coverage)
- [ ] Integration tests complete
- [ ] Performance optimization implemented

## 🔗 Dependencies
- TASK-02-04 (Subscription & Billing Management Backend)
- Payment gateway SDKs (Stripe, Razorpay)
- Chart visualization library
- PDF generation for invoices
- State management (React Query)

## 📝 Notes
- Ensure PCI compliance for payment forms
- Implement proper error handling for payment failures
- Focus on clear billing communication to users
- Plan for multi-currency display support
- Consider implementing cost prediction features

---

**Task Owner**: Frontend Engineer + UX Designer
**Reviewer**: Product Manager + Finance Manager
**Created**: 2024-01-20
**Due Date**: 2024-02-28