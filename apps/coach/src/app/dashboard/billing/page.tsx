'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Zap,
  Star,
  Crown,
  Receipt,
  Calendar,
  DollarSign,
  Activity,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BillingInfo, Invoice, UsageMetrics, SubscriptionTier } from '@/types';

interface BillingStats {
  current_bill: number;
  next_billing_date: string;
  total_students: number;
  monthly_growth: number;
  api_usage_percent: number;
  storage_used_percent: number;
}

export default function BillingPage(): JSX.Element {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingData = async (): Promise<void> => {
      // Mock API calls - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock billing info
      setBillingInfo({
        id: '1',
        institute_id: 'inst_1',
        subscription_tier: 'white_label',
        billing_cycle: 'monthly',
        monthly_fee: 29700, // ₹297 per student for 100 students
        setup_fee: 500000, // ₹5,00,000 setup fee (already paid)
        current_period_start: '2024-01-01',
        current_period_end: '2024-01-31',
        status: 'active',
        payment_method: 'card',
        next_billing_date: '2024-02-01',
        total_students: 100,
        usage_metrics: {
          api_calls_count: 45230,
          storage_used_gb: 12.5,
          active_users_count: 95,
          tests_conducted_count: 324,
        },
      });

      // Mock invoices
      setInvoices([
        {
          id: 'inv_1',
          institute_id: 'inst_1',
          invoice_number: 'NEETAI-2024-001',
          billing_period_start: '2024-01-01',
          billing_period_end: '2024-01-31',
          subtotal: 29700,
          tax_amount: 5346,
          total_amount: 35046,
          status: 'paid',
          due_date: '2024-01-15',
          paid_at: '2024-01-10',
          created_at: '2024-01-01',
        },
        {
          id: 'inv_2',
          institute_id: 'inst_1',
          invoice_number: 'NEETAI-2024-002',
          billing_period_start: '2023-12-01',
          billing_period_end: '2023-12-31',
          subtotal: 25650,
          tax_amount: 4617,
          total_amount: 30267,
          status: 'paid',
          due_date: '2023-12-15',
          paid_at: '2023-12-12',
          created_at: '2023-12-01',
        },
      ]);

      // Mock stats
      setStats({
        current_bill: 35046,
        next_billing_date: '2024-02-01',
        total_students: 100,
        monthly_growth: 12.5,
        api_usage_percent: 75.4,
        storage_used_percent: 25.0,
      });

      setLoading(false);
    };

    fetchBillingData();
  }, []);

  const getSubscriptionIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'white_label':
        return Crown;
      case 'integration':
        return Zap;
      case 'basic':
        return Star;
      default:
        return Star;
    }
  };

  const getSubscriptionInfo = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'white_label':
        return {
          name: 'White Label Solution',
          description: 'Complete branded solution for large institutes',
          color: 'bg-gradient-to-r from-purple-600 to-blue-600',
        };
      case 'integration':
        return {
          name: 'Integration Package',
          description: 'API access and teacher dashboard',
          color: 'bg-gradient-to-r from-green-600 to-teal-600',
        };
      case 'basic':
        return {
          name: 'School Partnership',
          description: 'Institutional license for schools',
          color: 'bg-gradient-to-r from-orange-600 to-red-600',
        };
      default:
        return {
          name: 'Unknown Plan',
          description: 'Contact support for details',
          color: 'bg-gray-500',
        };
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!billingInfo || !stats) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Billing Information</h3>
          <p className="text-gray-600">Please try again later or contact support.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const subscriptionInfo = getSubscriptionInfo(billingInfo.subscription_tier);
  const SubscriptionIcon = getSubscriptionIcon(billingInfo.subscription_tier);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Subscriptions</h1>
          <p className="text-gray-600">Manage your subscription, billing, and payment information</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View All Invoices
          </Button>
          <Button size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment Method
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Current Bill</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.current_bill)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">{stats.total_students}</p>
                  <div className="flex items-center text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-medium">+{stats.monthly_growth}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">API Usage</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">{stats.api_usage_percent}%</p>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-purple-600 rounded-full"
                      style={{ width: `${stats.api_usage_percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Next Billing</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatDate(stats.next_billing_date)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Subscription */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SubscriptionIcon className="h-5 w-5" />
              <span>Current Subscription</span>
            </CardTitle>
            <CardDescription>Your current plan and billing information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${subscriptionInfo.color}`}>
                <SubscriptionIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{subscriptionInfo.name}</h3>
                <p className="text-sm text-gray-600">{subscriptionInfo.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge 
                    variant={billingInfo.status === 'active' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {billingInfo.status.charAt(0).toUpperCase() + billingInfo.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {billingInfo.billing_cycle === 'monthly' ? 'Monthly' : 'Annual'} billing
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Monthly Fee</span>
                <span className="font-medium">{formatCurrency(billingInfo.monthly_fee)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Students Enrolled</span>
                <span className="font-medium">{billingInfo.total_students}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Per Student Cost</span>
                <span className="font-medium">
                  {formatCurrency(billingInfo.monthly_fee / billingInfo.total_students)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Next Billing Date</span>
                <span className="font-medium">{formatDate(billingInfo.next_billing_date)}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="flex-1">
                Change Plan
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Billing History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Usage Metrics</span>
            </CardTitle>
            <CardDescription>Your current month usage and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">API Calls</span>
                  <span className="text-sm text-gray-600">
                    {billingInfo.usage_metrics.api_calls_count.toLocaleString()} / Unlimited
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(stats.api_usage_percent, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Storage Used</span>
                  <span className="text-sm text-gray-600">
                    {billingInfo.usage_metrics.storage_used_gb} GB / 50 GB
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-600 rounded-full"
                    style={{ width: `${stats.storage_used_percent}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Active Users</span>
                  <span className="text-sm text-gray-600">
                    {billingInfo.usage_metrics.active_users_count} / {billingInfo.total_students}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-purple-600 rounded-full"
                    style={{ width: `${(billingInfo.usage_metrics.active_users_count / billingInfo.total_students) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Tests Conducted</span>
                  <span className="text-sm text-gray-600">
                    {billingInfo.usage_metrics.tests_conducted_count} this month
                  </span>
                </div>
                <div className="flex items-center text-green-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+15% from last month</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Pro Tip:</strong> You're utilizing {stats.api_usage_percent}% of your API capabilities. 
                Consider upgrading if you approach the limits.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Your billing history and payment records</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <Receipt className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{invoice.invoice_number}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(invoice.billing_period_start)} - {formatDate(invoice.billing_period_end)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(invoice.total_amount)}</p>
                    <p className="text-sm text-gray-600">
                      {invoice.paid_at ? `Paid on ${formatDate(invoice.paid_at)}` : `Due ${formatDate(invoice.due_date)}`}
                    </p>
                  </div>
                  
                  <Badge
                    variant={
                      invoice.status === 'paid' 
                        ? 'default' 
                        : invoice.status === 'overdue' 
                          ? 'destructive' 
                          : 'secondary'
                    }
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                  
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Method</span>
          </CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 rounded-full">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-gray-600">Expires 12/2025</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="default">Default</Badge>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Next charge: {formatCurrency(stats.current_bill)} on {formatDate(stats.next_billing_date)}
            </p>
            <Button variant="outline" size="sm">
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}