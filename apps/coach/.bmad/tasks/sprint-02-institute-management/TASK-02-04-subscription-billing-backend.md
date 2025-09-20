# TASK-02-04: Subscription & Billing Management Backend System

## 📋 Task Details
**Task ID**: TASK-02-04
**Story Reference**: STORY-01-06 (Subscription & Billing Management)
**Sprint**: Sprint 2
**Phase**: Backend
**Priority**: P0 (Critical)
**Estimated Effort**: 4 days
**Assignee**: Backend Engineer + Payment Integration Specialist
**Dependencies**: TASK-01-01 (Database Schema), TASK-02-02 (Staff & Role Management Backend)

## 🎯 Task Description
Implement a comprehensive subscription and billing management system that handles multiple payment methods, subscription plans, usage tracking, billing cycles, invoice generation, payment processing, dunning management, and compliance with financial regulations while ensuring secure handling of payment data and PCI compliance.

## 📋 Acceptance Criteria

### AC-01: Subscription Plan Management
- [ ] Create, update, and manage subscription plans with flexible pricing
- [ ] Support for tiered pricing, usage-based billing, and custom enterprise plans
- [ ] Plan feature restrictions and usage limits enforcement
- [ ] Plan migration and upgrade/downgrade workflows
- [ ] Promotional pricing and discount management

### AC-02: Payment Processing Integration
- [ ] Multiple payment gateway integrations (Stripe, Razorpay, PayPal)
- [ ] Secure payment method storage and tokenization
- [ ] Automated recurring payment processing
- [ ] Payment retry logic and failed payment handling
- [ ] Refund and chargeback management

### AC-03: Billing and Invoicing System
- [ ] Automated invoice generation and delivery
- [ ] Usage tracking and metered billing calculations
- [ ] Tax calculation and compliance (GST, VAT)
- [ ] Invoice customization and branding
- [ ] Payment receipt and acknowledgment generation

### AC-04: Subscription Lifecycle Management
- [ ] Trial period management and conversion tracking
- [ ] Subscription suspension, resumption, and cancellation
- [ ] Dunning management for failed payments
- [ ] Account downgrades and service limitations
- [ ] Contract and custom billing arrangements

### AC-05: Financial Reporting and Analytics
- [ ] Revenue recognition and reporting
- [ ] Payment analytics and churn analysis
- [ ] Subscription metrics and KPI tracking
- [ ] Financial forecasting and projections
- [ ] Compliance reporting and audit trails

## 🔧 Technical Specifications

### Database Schema Design

```sql
-- Subscription plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Plan Information
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Pricing Structure
    pricing_model ENUM('flat_rate', 'tiered', 'usage_based', 'hybrid', 'custom') NOT NULL,
    base_price DECIMAL(12,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'INR',
    billing_interval ENUM('monthly', 'quarterly', 'yearly', 'custom') NOT NULL,
    billing_interval_count INTEGER DEFAULT 1,
    
    -- Usage Limits and Features
    features JSONB NOT NULL DEFAULT '{}', -- Feature flags and limits
    usage_limits JSONB NOT NULL DEFAULT '{}', -- Usage quotas and restrictions
    overage_pricing JSONB DEFAULT '{}', -- Pricing for usage overages
    
    -- Plan Configuration
    trial_period_days INTEGER DEFAULT 0,
    setup_fee DECIMAL(10,2) DEFAULT 0.00,
    cancellation_fee DECIMAL(10,2) DEFAULT 0.00,
    
    -- Availability and Status
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true, -- Public vs private plans
    available_from DATE,
    available_until DATE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscription plan tiers (for tiered pricing)
CREATE TABLE subscription_plan_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE,
    
    -- Tier Configuration
    tier_name VARCHAR(100) NOT NULL,
    tier_order INTEGER NOT NULL,
    
    -- Pricing
    price_per_unit DECIMAL(10,4) NOT NULL,
    included_units INTEGER DEFAULT 0,
    max_units INTEGER, -- NULL for unlimited
    
    -- Tier Conditions
    minimum_quantity INTEGER DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(plan_id, tier_order)
);

-- Institute subscriptions
CREATE TABLE institute_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID REFERENCES institutes(id) NOT NULL,
    plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
    
    -- Subscription Details
    subscription_external_id VARCHAR(255), -- External payment provider ID
    status ENUM(
        'trial', 'active', 'past_due', 'canceled', 'unpaid', 
        'paused', 'expired', 'pending_activation'
    ) NOT NULL DEFAULT 'pending_activation',
    
    -- Billing Information
    current_period_start DATE NOT NULL,
    current_period_end DATE NOT NULL,
    next_billing_date DATE,
    
    -- Trial Information
    trial_start DATE,
    trial_end DATE,
    
    -- Pricing Override (for custom pricing)
    custom_pricing JSONB DEFAULT '{}',
    discount_applied DECIMAL(5,2) DEFAULT 0.00, -- Percentage discount
    
    -- Usage and Limits
    current_usage JSONB DEFAULT '{}', -- Current period usage
    usage_alerts_sent JSONB DEFAULT '[]', -- Track sent usage alerts
    
    -- Subscription Lifecycle
    started_at TIMESTAMP DEFAULT NOW(),
    canceled_at TIMESTAMP,
    cancellation_reason TEXT,
    pause_collection BOOLEAN DEFAULT false,
    
    -- Payment Information
    payment_method_id UUID REFERENCES payment_methods(id),
    collection_method ENUM('charge_automatically', 'send_invoice') DEFAULT 'charge_automatically',
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID REFERENCES institutes(id) NOT NULL,
    
    -- Payment Method Details
    type ENUM('card', 'bank_account', 'wallet', 'upi', 'net_banking') NOT NULL,
    provider ENUM('stripe', 'razorpay', 'paypal', 'other') NOT NULL,
    provider_payment_method_id VARCHAR(255) NOT NULL,
    
    -- Card Information (encrypted/tokenized)
    card_last4 VARCHAR(4),
    card_brand VARCHAR(20),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    
    -- Bank Account Information
    bank_name VARCHAR(255),
    account_last4 VARCHAR(4),
    account_type VARCHAR(20),
    
    -- Status and Verification
    is_verified BOOLEAN DEFAULT false,
    is_default BOOLEAN DEFAULT false,
    
    -- Security
    fingerprint VARCHAR(255), -- Unique identifier for duplicate detection
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(institute_id, provider_payment_method_id)
);

-- Billing cycles and invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID REFERENCES institutes(id) NOT NULL,
    subscription_id UUID REFERENCES institute_subscriptions(id),
    
    -- Invoice Identification
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_external_id VARCHAR(255), -- External provider invoice ID
    
    -- Invoice Details
    status ENUM(
        'draft', 'open', 'paid', 'past_due', 'canceled', 
        'uncollectible', 'void'
    ) NOT NULL DEFAULT 'draft',
    
    -- Amounts (in smallest currency unit, e.g., paisa for INR)
    subtotal_amount INTEGER NOT NULL DEFAULT 0,
    tax_amount INTEGER NOT NULL DEFAULT 0,
    discount_amount INTEGER NOT NULL DEFAULT 0,
    total_amount INTEGER NOT NULL DEFAULT 0,
    amount_paid INTEGER NOT NULL DEFAULT 0,
    amount_remaining INTEGER NOT NULL DEFAULT 0,
    
    -- Currency and Tax
    currency VARCHAR(3) DEFAULT 'INR',
    tax_percent DECIMAL(5,2) DEFAULT 0.00,
    tax_details JSONB DEFAULT '{}',
    
    -- Billing Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Important Dates
    due_date DATE,
    finalized_at TIMESTAMP,
    paid_at TIMESTAMP,
    voided_at TIMESTAMP,
    
    -- Invoice Content
    line_items JSONB NOT NULL DEFAULT '[]',
    description TEXT,
    footer TEXT,
    
    -- Payment Information
    payment_method_id UUID REFERENCES payment_methods(id),
    payment_attempts INTEGER DEFAULT 0,
    next_payment_attempt TIMESTAMP,
    
    -- PDF and Delivery
    invoice_pdf_url VARCHAR(500),
    hosted_invoice_url VARCHAR(500),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoice line items (detailed breakdown)
CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    
    -- Line Item Details
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit_price INTEGER NOT NULL, -- In smallest currency unit
    amount INTEGER NOT NULL, -- quantity * unit_price
    
    -- Product/Service Information
    plan_id UUID REFERENCES subscription_plans(id),
    usage_type VARCHAR(100), -- 'subscription', 'overage', 'one_time', 'setup_fee'
    period_start DATE,
    period_end DATE,
    
    -- Tax Information
    tax_amount INTEGER DEFAULT 0,
    tax_rates JSONB DEFAULT '[]',
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID REFERENCES institutes(id) NOT NULL,
    invoice_id UUID REFERENCES invoices(id),
    subscription_id UUID REFERENCES institute_subscriptions(id),
    
    -- Transaction Identification
    transaction_external_id VARCHAR(255) NOT NULL,
    provider ENUM('stripe', 'razorpay', 'paypal', 'other') NOT NULL,
    
    -- Transaction Details
    type ENUM('payment', 'refund', 'chargeback', 'adjustment') NOT NULL,
    status ENUM('pending', 'succeeded', 'failed', 'canceled', 'requires_action') NOT NULL,
    
    -- Amount Information
    amount INTEGER NOT NULL, -- In smallest currency unit
    currency VARCHAR(3) DEFAULT 'INR',
    fee_amount INTEGER DEFAULT 0, -- Payment processing fees
    net_amount INTEGER NOT NULL, -- amount - fee_amount
    
    -- Payment Method Used
    payment_method_id UUID REFERENCES payment_methods(id),
    payment_method_details JSONB DEFAULT '{}',
    
    -- Transaction Timeline
    initiated_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    failed_at TIMESTAMP,
    
    -- Failure Information
    failure_code VARCHAR(100),
    failure_message TEXT,
    failure_reason VARCHAR(100),
    
    -- Risk and Fraud
    risk_score INTEGER, -- 0-100 risk score
    risk_level ENUM('low', 'medium', 'high') DEFAULT 'low',
    
    -- Metadata and Receipts
    receipt_url VARCHAR(500),
    receipt_number VARCHAR(100),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(provider, transaction_external_id)
);

-- Usage tracking for metered billing
CREATE TABLE usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID REFERENCES institutes(id) NOT NULL,
    subscription_id UUID REFERENCES institute_subscriptions(id) NOT NULL,
    
    -- Usage Details
    usage_type VARCHAR(100) NOT NULL, -- 'students', 'api_calls', 'storage', etc.
    quantity DECIMAL(15,6) NOT NULL,
    unit VARCHAR(50) NOT NULL, -- 'count', 'gb', 'hours', etc.
    
    -- Time Information
    usage_timestamp TIMESTAMP NOT NULL,
    recorded_at TIMESTAMP DEFAULT NOW(),
    
    -- Billing Information
    is_billable BOOLEAN DEFAULT true,
    unit_price DECIMAL(10,4), -- Price per unit at time of usage
    
    -- Aggregation Tracking
    aggregated BOOLEAN DEFAULT false,
    billing_period_start DATE,
    billing_period_end DATE,
    
    -- Source Information
    source_system VARCHAR(100), -- Which system generated this usage
    source_reference VARCHAR(255), -- Reference to source record
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Subscription usage summaries (for performance)
CREATE TABLE subscription_usage_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES institute_subscriptions(id) NOT NULL,
    
    -- Summary Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    summary_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    
    -- Usage Aggregations
    usage_data JSONB NOT NULL DEFAULT '{}', -- Aggregated usage by type
    
    -- Billing Information
    billable_amount DECIMAL(12,2) DEFAULT 0.00,
    overage_amount DECIMAL(12,2) DEFAULT 0.00,
    
    -- Status
    is_finalized BOOLEAN DEFAULT false,
    finalized_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(subscription_id, period_start, summary_type)
);

-- Coupons and discounts
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Coupon Identification
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Discount Configuration
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    
    -- Application Rules
    applies_to ENUM('all_plans', 'specific_plans', 'first_time_only') DEFAULT 'all_plans',
    applicable_plan_ids JSONB DEFAULT '[]',
    max_redemptions INTEGER, -- NULL for unlimited
    max_redemptions_per_customer INTEGER DEFAULT 1,
    
    -- Validity Period
    valid_from TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,
    
    -- Usage Tracking
    times_redeemed INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Coupon redemptions tracking
CREATE TABLE coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES coupons(id) NOT NULL,
    institute_id UUID REFERENCES institutes(id) NOT NULL,
    subscription_id UUID REFERENCES institute_subscriptions(id),
    
    -- Redemption Details
    discount_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    
    -- Application
    applied_to_invoice_id UUID REFERENCES invoices(id),
    
    redeemed_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(coupon_id, institute_id, subscription_id)
);

-- Dunning management (for failed payments)
CREATE TABLE dunning_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES institute_subscriptions(id) NOT NULL,
    invoice_id UUID REFERENCES invoices(id) NOT NULL,
    
    -- Dunning Configuration
    attempt_number INTEGER NOT NULL,
    max_attempts INTEGER DEFAULT 3,
    
    -- Communication
    communication_type ENUM('email', 'sms', 'in_app', 'webhook') NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    message_template VARCHAR(100),
    
    -- Status and Results
    status ENUM('pending', 'sent', 'delivered', 'failed', 'bounced') DEFAULT 'pending',
    sent_at TIMESTAMP,
    
    -- Next Actions
    next_attempt_at TIMESTAMP,
    escalation_level ENUM('warning', 'urgent', 'final_notice', 'suspension') DEFAULT 'warning',
    
    -- Results
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Financial reporting aggregations
CREATE TABLE financial_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Report Details
    report_type ENUM('revenue', 'churn', 'cohort', 'subscription_metrics') NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Report Data
    data JSONB NOT NULL DEFAULT '{}',
    
    -- Generation Info
    generated_at TIMESTAMP DEFAULT NOW(),
    generated_by VARCHAR(255),
    
    -- Cache Control
    expires_at TIMESTAMP,
    
    UNIQUE(report_type, period_start, period_end)
);

-- Create indexes for performance
CREATE INDEX idx_institute_subscriptions_institute ON institute_subscriptions(institute_id);
CREATE INDEX idx_institute_subscriptions_status ON institute_subscriptions(status);
CREATE INDEX idx_institute_subscriptions_billing_date ON institute_subscriptions(next_billing_date);

CREATE INDEX idx_invoices_institute ON invoices(institute_id);
CREATE INDEX idx_invoices_subscription ON invoices(subscription_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

CREATE INDEX idx_payment_transactions_institute ON payment_transactions(institute_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_provider ON payment_transactions(provider, transaction_external_id);

CREATE INDEX idx_usage_records_subscription ON usage_records(subscription_id);
CREATE INDEX idx_usage_records_timestamp ON usage_records(usage_timestamp);
CREATE INDEX idx_usage_records_billing_period ON usage_records(billing_period_start, billing_period_end);

CREATE INDEX idx_dunning_attempts_subscription ON dunning_attempts(subscription_id);
CREATE INDEX idx_dunning_attempts_next_attempt ON dunning_attempts(next_attempt_at);
```

### API Implementation

```typescript
// app/api/institutes/[id]/subscriptions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, verifyInstituteAccess } from '@/lib/auth';
import { SubscriptionService } from '@/services/SubscriptionService';
import { PaymentGatewayFactory } from '@/services/PaymentGatewayFactory';
import { subscriptionSchema } from '@/lib/validators/subscription';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    await verifyInstituteAccess(user.id, params.id, 'manager');

    const { searchParams } = new URL(request.url);
    const includeUsage = searchParams.get('includeUsage') === 'true';
    const includeBilling = searchParams.get('includeBilling') === 'true';

    const subscriptionService = new SubscriptionService();
    const subscription = await subscriptionService.getInstituteSubscription(
      params.id,
      { includeUsage, includeBilling }
    );

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Failed to fetch subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    await verifyInstituteAccess(user.id, params.id, 'admin');

    const body = await request.json();
    const validatedData = subscriptionSchema.parse(body);

    const subscriptionService = new SubscriptionService();
    
    // Create subscription with payment provider
    const subscription = await subscriptionService.createSubscription({
      instituteId: params.id,
      planId: validatedData.planId,
      paymentMethodId: validatedData.paymentMethodId,
      trialDays: validatedData.trialDays,
      couponCode: validatedData.couponCode,
      customPricing: validatedData.customPricing,
      metadata: {
        created_by: user.id,
        source: 'dashboard'
      }
    });

    return NextResponse.json({
      success: true,
      data: subscription,
      message: 'Subscription created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to create subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

// app/api/institutes/[id]/subscriptions/[subscriptionId]/route.ts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; subscriptionId: string } }
) {
  try {
    const user = await getCurrentUser();
    await verifyInstituteAccess(user.id, params.id, 'admin');

    const body = await request.json();
    const { action, ...updateData } = body;

    const subscriptionService = new SubscriptionService();

    let result;
    switch (action) {
      case 'upgrade':
      case 'downgrade':
        result = await subscriptionService.changeSubscriptionPlan({
          subscriptionId: params.subscriptionId,
          newPlanId: updateData.planId,
          prorationBehavior: updateData.prorationBehavior || 'create_prorations',
          effectiveDate: updateData.effectiveDate
        });
        break;

      case 'pause':
        result = await subscriptionService.pauseSubscription({
          subscriptionId: params.subscriptionId,
          pauseCollections: updateData.pauseCollections || true,
          resumeDate: updateData.resumeDate
        });
        break;

      case 'resume':
        result = await subscriptionService.resumeSubscription({
          subscriptionId: params.subscriptionId,
          prorationBehavior: updateData.prorationBehavior
        });
        break;

      case 'cancel':
        result = await subscriptionService.cancelSubscription({
          subscriptionId: params.subscriptionId,
          cancelAtPeriodEnd: updateData.cancelAtPeriodEnd || true,
          cancellationReason: updateData.reason
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Subscription ${action} successful`
    });

  } catch (error) {
    console.error(`Failed to ${action} subscription:`, error);
    return NextResponse.json(
      { error: `Failed to ${action} subscription` },
      { status: 500 }
    );
  }
}

// app/api/institutes/[id]/billing/invoices/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    await verifyInstituteAccess(user.id, params.id, 'manager');

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const subscriptionService = new SubscriptionService();
    const invoices = await subscriptionService.getInstituteBillingHistory({
      instituteId: params.id,
      status,
      page,
      limit,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    });

    return NextResponse.json({
      success: true,
      data: invoices
    });

  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// app/api/institutes/[id]/billing/usage/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    await verifyInstituteAccess(user.id, params.id, 'manager');

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'current';
    const usageType = searchParams.get('usageType');

    const subscriptionService = new SubscriptionService();
    const usage = await subscriptionService.getInstituteUsageData({
      instituteId: params.id,
      period,
      usageType
    });

    return NextResponse.json({
      success: true,
      data: usage
    });

  } catch (error) {
    console.error('Failed to fetch usage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

// app/api/payment-methods/route.ts
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const { instituteId, paymentMethodData, provider = 'stripe' } = body;
    
    await verifyInstituteAccess(user.id, instituteId, 'admin');

    const paymentGateway = PaymentGatewayFactory.create(provider);
    const paymentMethod = await paymentGateway.createPaymentMethod({
      customerId: instituteId,
      paymentMethodData
    });

    return NextResponse.json({
      success: true,
      data: paymentMethod,
      message: 'Payment method added successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to add payment method:', error);
    return NextResponse.json(
      { error: 'Failed to add payment method' },
      { status: 500 }
    );
  }
}

// app/api/webhooks/[provider]/route.ts
export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || 
                     request.headers.get('x-razorpay-signature') || '';

    const webhookService = new WebhookService();
    await webhookService.handleWebhook({
      provider: params.provider as PaymentProvider,
      payload: body,
      signature
    });

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error(`Webhook error for ${params.provider}:`, error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
```

### Service Layer Implementation

```typescript
// services/SubscriptionService.ts
import { supabase } from '@/lib/supabase';
import { PaymentGatewayFactory } from './PaymentGatewayFactory';
import { UsageTrackingService } from './UsageTrackingService';
import { InvoiceService } from './InvoiceService';

export class SubscriptionService {
  private usageService = new UsageTrackingService();
  private invoiceService = new InvoiceService();

  async createSubscription(params: {
    instituteId: string;
    planId: string;
    paymentMethodId: string;
    trialDays?: number;
    couponCode?: string;
    customPricing?: any;
    metadata?: any;
  }): Promise<InstituteSubscription> {
    const { 
      instituteId, 
      planId, 
      paymentMethodId, 
      trialDays, 
      couponCode, 
      customPricing,
      metadata 
    } = params;

    try {
      // Get subscription plan details
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (planError || !plan) {
        throw new Error('Subscription plan not found');
      }

      // Get payment method details
      const { data: paymentMethod, error: pmError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('id', paymentMethodId)
        .eq('institute_id', instituteId)
        .single();

      if (pmError || !paymentMethod) {
        throw new Error('Payment method not found');
      }

      // Calculate subscription dates
      const now = new Date();
      const trialStart = trialDays && trialDays > 0 ? now : null;
      const trialEnd = trialStart ? 
        new Date(trialStart.getTime() + (trialDays * 24 * 60 * 60 * 1000)) : null;
      
      const periodStart = trialEnd || now;
      const periodEnd = this.calculatePeriodEnd(periodStart, plan.billing_interval, plan.billing_interval_count);

      // Create subscription with payment provider
      const paymentGateway = PaymentGatewayFactory.create(paymentMethod.provider);
      const externalSubscription = await paymentGateway.createSubscription({
        customerId: instituteId,
        planId: plan.code,
        paymentMethodId: paymentMethod.provider_payment_method_id,
        trialPeriodDays: trialDays,
        couponCode,
        metadata
      });

      // Apply coupon if provided
      let discountApplied = 0;
      if (couponCode) {
        const coupon = await this.validateAndApplyCoupon(couponCode, instituteId, planId);
        discountApplied = coupon.discount_value;
      }

      // Create subscription record
      const { data: subscription, error: subError } = await supabase
        .from('institute_subscriptions')
        .insert({
          institute_id: instituteId,
          plan_id: planId,
          subscription_external_id: externalSubscription.id,
          status: trialDays ? 'trial' : 'active',
          current_period_start: periodStart.toISOString().split('T')[0],
          current_period_end: periodEnd.toISOString().split('T')[0],
          next_billing_date: periodEnd.toISOString().split('T')[0],
          trial_start: trialStart?.toISOString().split('T')[0],
          trial_end: trialEnd?.toISOString().split('T')[0],
          payment_method_id: paymentMethodId,
          custom_pricing: customPricing,
          discount_applied: discountApplied,
          metadata
        })
        .select()
        .single();

      if (subError) {
        // Rollback external subscription if local creation fails
        await paymentGateway.cancelSubscription(externalSubscription.id);
        throw new Error('Failed to create subscription record');
      }

      // Initialize usage tracking
      await this.usageService.initializeUsageTracking(subscription.id, plan.features);

      // Send confirmation email
      await this.sendSubscriptionConfirmation(subscription);

      return subscription;

    } catch (error) {
      console.error('Subscription creation failed:', error);
      throw error;
    }
  }

  async changeSubscriptionPlan(params: {
    subscriptionId: string;
    newPlanId: string;
    prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
    effectiveDate?: Date;
  }): Promise<InstituteSubscription> {
    const { subscriptionId, newPlanId, prorationBehavior = 'create_prorations', effectiveDate } = params;

    try {
      // Get current subscription
      const { data: subscription } = await supabase
        .from('institute_subscriptions')
        .select('*, subscription_plans(*), payment_methods(*)')
        .eq('id', subscriptionId)
        .single();

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Get new plan
      const { data: newPlan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', newPlanId)
        .single();

      if (!newPlan) {
        throw new Error('New subscription plan not found');
      }

      // Update subscription with payment provider
      const paymentGateway = PaymentGatewayFactory.create(subscription.payment_methods.provider);
      const updatedExternalSubscription = await paymentGateway.updateSubscription({
        subscriptionId: subscription.subscription_external_id,
        planId: newPlan.code,
        prorationBehavior,
        effectiveDate
      });

      // Calculate new billing period
      const newPeriodEnd = this.calculatePeriodEnd(
        new Date(subscription.current_period_start),
        newPlan.billing_interval,
        newPlan.billing_interval_count
      );

      // Update local subscription record
      const { data: updatedSubscription } = await supabase
        .from('institute_subscriptions')
        .update({
          plan_id: newPlanId,
          current_period_end: newPeriodEnd.toISOString().split('T')[0],
          next_billing_date: newPeriodEnd.toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      // Update usage limits based on new plan
      await this.usageService.updateUsageLimits(subscriptionId, newPlan.features);

      // Generate proration invoice if needed
      if (prorationBehavior === 'create_prorations' || prorationBehavior === 'always_invoice') {
        await this.invoiceService.generateProrationInvoice({
          subscriptionId,
          oldPlan: subscription.subscription_plans,
          newPlan,
          changeDate: new Date()
        });
      }

      // Log plan change
      await this.logSubscriptionEvent({
        subscriptionId,
        eventType: 'plan_changed',
        eventData: {
          from_plan: subscription.plan_id,
          to_plan: newPlanId,
          proration_behavior: prorationBehavior
        }
      });

      return updatedSubscription;

    } catch (error) {
      console.error('Plan change failed:', error);
      throw error;
    }
  }

  async pauseSubscription(params: {
    subscriptionId: string;
    pauseCollections?: boolean;
    resumeDate?: Date;
  }): Promise<InstituteSubscription> {
    const { subscriptionId, pauseCollections = true, resumeDate } = params;

    try {
      const { data: subscription } = await supabase
        .from('institute_subscriptions')
        .select('*, payment_methods(*)')
        .eq('id', subscriptionId)
        .single();

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Pause subscription with payment provider
      const paymentGateway = PaymentGatewayFactory.create(subscription.payment_methods.provider);
      await paymentGateway.pauseSubscription({
        subscriptionId: subscription.subscription_external_id,
        pauseCollections,
        resumeDate
      });

      // Update local subscription record
      const { data: updatedSubscription } = await supabase
        .from('institute_subscriptions')
        .update({
          status: 'paused',
          pause_collection: pauseCollections,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      // Pause usage tracking
      await this.usageService.pauseUsageTracking(subscriptionId);

      // Log pause event
      await this.logSubscriptionEvent({
        subscriptionId,
        eventType: 'subscription_paused',
        eventData: {
          pause_collections: pauseCollections,
          resume_date: resumeDate?.toISOString()
        }
      });

      return updatedSubscription;

    } catch (error) {
      console.error('Subscription pause failed:', error);
      throw error;
    }
  }

  async processRecurringPayments(): Promise<void> {
    try {
      // Get subscriptions due for billing
      const { data: subscriptions } = await supabase
        .from('institute_subscriptions')
        .select('*, payment_methods(*), subscription_plans(*)')
        .eq('status', 'active')
        .lte('next_billing_date', new Date().toISOString().split('T')[0]);

      for (const subscription of subscriptions || []) {
        try {
          await this.processSingleSubscriptionBilling(subscription);
        } catch (error) {
          console.error(`Failed to process billing for subscription ${subscription.id}:`, error);
          await this.handleBillingFailure(subscription, error);
        }
      }

    } catch (error) {
      console.error('Failed to process recurring payments:', error);
    }
  }

  private async processSingleSubscriptionBilling(subscription: any): Promise<void> {
    // Calculate usage charges
    const usageCharges = await this.usageService.calculateUsageCharges(
      subscription.id,
      subscription.current_period_start,
      subscription.current_period_end
    );

    // Generate invoice
    const invoice = await this.invoiceService.generateSubscriptionInvoice({
      subscriptionId: subscription.id,
      periodStart: new Date(subscription.current_period_start),
      periodEnd: new Date(subscription.current_period_end),
      baseAmount: subscription.subscription_plans.base_price,
      usageCharges,
      taxRate: await this.getTaxRate(subscription.institute_id)
    });

    // Process payment
    const paymentGateway = PaymentGatewayFactory.create(subscription.payment_methods.provider);
    const payment = await paymentGateway.processPayment({
      amount: invoice.total_amount,
      currency: invoice.currency,
      customerId: subscription.institute_id,
      paymentMethodId: subscription.payment_methods.provider_payment_method_id,
      description: `Subscription payment for ${subscription.subscription_plans.name}`,
      metadata: {
        subscription_id: subscription.id,
        invoice_id: invoice.id
      }
    });

    // Update subscription for next billing period
    const nextPeriodStart = new Date(subscription.current_period_end);
    const nextPeriodEnd = this.calculatePeriodEnd(
      nextPeriodStart,
      subscription.subscription_plans.billing_interval,
      subscription.subscription_plans.billing_interval_count
    );

    await supabase
      .from('institute_subscriptions')
      .update({
        current_period_start: nextPeriodStart.toISOString().split('T')[0],
        current_period_end: nextPeriodEnd.toISOString().split('T')[0],
        next_billing_date: nextPeriodEnd.toISOString().split('T')[0]
      })
      .eq('id', subscription.id);

    // Update invoice with payment information
    await supabase
      .from('invoices')
      .update({
        status: payment.status === 'succeeded' ? 'paid' : 'past_due',
        paid_at: payment.status === 'succeeded' ? new Date().toISOString() : null,
        payment_attempts: invoice.payment_attempts + 1
      })
      .eq('id', invoice.id);
  }

  private calculatePeriodEnd(start: Date, interval: string, count: number): Date {
    const end = new Date(start);
    
    switch (interval) {
      case 'monthly':
        end.setMonth(end.getMonth() + count);
        break;
      case 'quarterly':
        end.setMonth(end.getMonth() + (3 * count));
        break;
      case 'yearly':
        end.setFullYear(end.getFullYear() + count);
        break;
      default:
        throw new Error(`Unsupported billing interval: ${interval}`);
    }

    return end;
  }

  private async validateAndApplyCoupon(
    couponCode: string, 
    instituteId: string, 
    planId: string
  ): Promise<any> {
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode)
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      throw new Error('Invalid coupon code');
    }

    // Check validity period
    const now = new Date();
    if (coupon.valid_from && now < new Date(coupon.valid_from)) {
      throw new Error('Coupon is not yet valid');
    }
    if (coupon.valid_until && now > new Date(coupon.valid_until)) {
      throw new Error('Coupon has expired');
    }

    // Check usage limits
    if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
      throw new Error('Coupon usage limit exceeded');
    }

    // Check if already used by this customer
    const { data: existingRedemption } = await supabase
      .from('coupon_redemptions')
      .select('id')
      .eq('coupon_id', coupon.id)
      .eq('institute_id', instituteId)
      .single();

    if (existingRedemption && coupon.max_redemptions_per_customer <= 1) {
      throw new Error('Coupon already used by this customer');
    }

    return coupon;
  }

  private async getTaxRate(instituteId: string): Promise<number> {
    // Implement tax rate calculation based on institute location
    // This would typically involve integrating with tax APIs
    return 18; // Default GST rate for India
  }

  private async logSubscriptionEvent(params: {
    subscriptionId: string;
    eventType: string;
    eventData: any;
  }): Promise<void> {
    // Log subscription events for audit and analytics
    await supabase
      .from('subscription_events')
      .insert({
        subscription_id: params.subscriptionId,
        event_type: params.eventType,
        event_data: params.eventData,
        created_at: new Date().toISOString()
      });
  }

  private async sendSubscriptionConfirmation(subscription: any): Promise<void> {
    // Send email confirmation for new subscription
    // Implementation would depend on email service
  }

  private async handleBillingFailure(subscription: any, error: any): Promise<void> {
    // Implement dunning management for failed payments
    // This would involve sending notifications and retrying payments
  }
}

// services/UsageTrackingService.ts
export class UsageTrackingService {
  async trackUsage(params: {
    instituteId: string;
    subscriptionId: string;
    usageType: string;
    quantity: number;
    unit: string;
    timestamp?: Date;
    metadata?: any;
  }): Promise<void> {
    const {
      instituteId,
      subscriptionId,
      usageType,
      quantity,
      unit,
      timestamp = new Date(),
      metadata = {}
    } = params;

    try {
      // Record individual usage event
      await supabase
        .from('usage_records')
        .insert({
          institute_id: instituteId,
          subscription_id: subscriptionId,
          usage_type: usageType,
          quantity,
          unit,
          usage_timestamp: timestamp.toISOString(),
          metadata
        });

      // Update real-time usage summary
      await this.updateUsageSummary(subscriptionId, usageType, quantity, timestamp);

    } catch (error) {
      console.error('Failed to track usage:', error);
      throw error;
    }
  }

  async calculateUsageCharges(
    subscriptionId: string,
    periodStart: string,
    periodEnd: string
  ): Promise<any[]> {
    try {
      // Get subscription plan with pricing
      const { data: subscription } = await supabase
        .from('institute_subscriptions')
        .select('*, subscription_plans(*)')
        .eq('id', subscriptionId)
        .single();

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Get usage records for the billing period
      const { data: usageRecords } = await supabase
        .from('usage_records')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .gte('usage_timestamp', periodStart)
        .lt('usage_timestamp', periodEnd)
        .eq('is_billable', true);

      // Calculate charges based on plan pricing model
      const charges = [];
      const plan = subscription.subscription_plans;
      
      if (plan.pricing_model === 'usage_based' || plan.pricing_model === 'hybrid') {
        const usageByType = this.aggregateUsageByType(usageRecords || []);
        
        for (const [usageType, totalUsage] of Object.entries(usageByType)) {
          const charge = this.calculateUsageCharge(
            usageType,
            totalUsage as number,
            plan.usage_limits,
            plan.overage_pricing
          );
          
          if (charge.amount > 0) {
            charges.push(charge);
          }
        }
      }

      return charges;

    } catch (error) {
      console.error('Failed to calculate usage charges:', error);
      throw error;
    }
  }

  private aggregateUsageByType(usageRecords: any[]): Record<string, number> {
    return usageRecords.reduce((acc, record) => {
      acc[record.usage_type] = (acc[record.usage_type] || 0) + record.quantity;
      return acc;
    }, {});
  }

  private calculateUsageCharge(
    usageType: string,
    totalUsage: number,
    usageLimits: any,
    overagePricing: any
  ): any {
    const limit = usageLimits[usageType] || 0;
    const overageAmount = Math.max(0, totalUsage - limit);
    
    if (overageAmount > 0 && overagePricing[usageType]) {
      const pricePerUnit = overagePricing[usageType].price_per_unit || 0;
      return {
        usage_type: usageType,
        quantity: overageAmount,
        unit_price: pricePerUnit,
        amount: overageAmount * pricePerUnit,
        description: `Overage charges for ${usageType}`
      };
    }

    return { amount: 0 };
  }

  private async updateUsageSummary(
    subscriptionId: string,
    usageType: string,
    quantity: number,
    timestamp: Date
  ): Promise<void> {
    // Update current period usage in subscription record
    const { data: subscription } = await supabase
      .from('institute_subscriptions')
      .select('current_usage')
      .eq('id', subscriptionId)
      .single();

    if (subscription) {
      const currentUsage = subscription.current_usage || {};
      currentUsage[usageType] = (currentUsage[usageType] || 0) + quantity;

      await supabase
        .from('institute_subscriptions')
        .update({
          current_usage: currentUsage,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);
    }
  }
}
```

## 🧪 Testing Requirements

### Unit Tests
```typescript
describe('SubscriptionService', () => {
  describe('createSubscription', () => {
    it('creates subscription with trial period', async () => {
      const params = {
        instituteId: 'inst-123',
        planId: 'plan-basic',
        paymentMethodId: 'pm-123',
        trialDays: 14
      };

      const subscription = await subscriptionService.createSubscription(params);

      expect(subscription.status).toBe('trial');
      expect(subscription.trial_end).toBeDefined();
    });

    it('applies coupon discount correctly', async () => {
      const params = {
        instituteId: 'inst-123',
        planId: 'plan-basic',
        paymentMethodId: 'pm-123',
        couponCode: 'SAVE50'
      };

      const subscription = await subscriptionService.createSubscription(params);

      expect(subscription.discount_applied).toBe(50);
    });
  });

  describe('changeSubscriptionPlan', () => {
    it('upgrades subscription plan correctly', async () => {
      const params = {
        subscriptionId: 'sub-123',
        newPlanId: 'plan-premium',
        prorationBehavior: 'create_prorations'
      };

      const updatedSubscription = await subscriptionService.changeSubscriptionPlan(params);

      expect(updatedSubscription.plan_id).toBe('plan-premium');
    });
  });
});

describe('UsageTrackingService', () => {
  it('tracks usage correctly', async () => {
    const params = {
      instituteId: 'inst-123',
      subscriptionId: 'sub-123',
      usageType: 'students',
      quantity: 10,
      unit: 'count'
    };

    await usageTrackingService.trackUsage(params);

    const usageRecord = await getUsageRecord(params.subscriptionId);
    expect(usageRecord.quantity).toBe(10);
  });

  it('calculates overage charges correctly', async () => {
    const charges = await usageTrackingService.calculateUsageCharges(
      'sub-123',
      '2024-01-01',
      '2024-02-01'
    );

    expect(charges).toHaveLength(1);
    expect(charges[0].usage_type).toBe('students');
    expect(charges[0].amount).toBe(500); // 50 students * 10 per student
  });
});
```

### Integration Tests
```typescript
describe('Subscription Management Integration', () => {
  it('handles complete subscription lifecycle', async () => {
    // Create subscription
    const subscription = await createSubscription({
      instituteId: 'inst-123',
      planId: 'plan-basic'
    });
    expect(subscription.status).toBe('active');

    // Track usage
    await trackUsage({
      subscriptionId: subscription.id,
      usageType: 'students',
      quantity: 100
    });

    // Process billing
    await processRecurringPayments();
    
    const invoice = await getLatestInvoice(subscription.id);
    expect(invoice.status).toBe('paid');

    // Upgrade plan
    const upgraded = await changeSubscriptionPlan({
      subscriptionId: subscription.id,
      newPlanId: 'plan-premium'
    });
    expect(upgraded.plan_id).toBe('plan-premium');
  });
});
```

## 📊 Success Metrics
- Payment processing success rate > 99.5%
- Invoice generation and delivery < 2 minutes
- Usage tracking accuracy > 99.9%
- Subscription lifecycle operations < 5 seconds
- Financial reporting generation < 30 seconds

## 📋 Definition of Done
- [ ] Subscription plan CRUD operations implemented
- [ ] Payment processing with multiple gateways working
- [ ] Usage tracking and metered billing functional
- [ ] Invoice generation and delivery automated
- [ ] Webhook handling for payment events complete
- [ ] Dunning management for failed payments operational
- [ ] Financial reporting and analytics ready
- [ ] Tax calculation and compliance implemented
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests complete
- [ ] Security audit passed
- [ ] PCI compliance verified

## 🔗 Dependencies
- TASK-01-01 (Database Schema)
- TASK-02-02 (Staff & Role Management Backend)
- Payment gateway APIs (Stripe, Razorpay)
- Email service for notifications
- PDF generation service for invoices
- Tax calculation service

## ⚡ Performance Optimization
- Database indexing for billing queries
- Caching for subscription and usage data
- Background processing for billing operations
- Webhook retry mechanisms
- Usage data aggregation optimization

## 📝 Notes
- Ensure PCI DSS compliance for payment data
- Implement proper error handling for payment failures
- Plan for handling high-volume usage tracking
- Consider implementing revenue recognition standards
- Prepare for multi-currency support in future

---

**Task Owner**: Backend Engineer + Payment Integration Specialist
**Reviewer**: Tech Lead + Finance Manager
**Created**: 2024-01-20
**Due Date**: 2024-02-25