'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  Palette, 
  CreditCard,
  Check,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  Crown,
  Zap,
  Star,
} from 'lucide-react';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import type { InstituteRegistrationForm, SubscriptionTier } from '@/types';

// Validation schemas
const instituteInfoSchema = z.object({
  name: z.string().min(2, 'Institute name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid phone number is required'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  website: z.string().url().optional().or(z.literal('')),
  admin_name: z.string().min(2, 'Admin name is required'),
  admin_email: z.string().email('Valid admin email is required'),
});

const brandingSchema = z.object({
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Valid hex color required'),
  secondary_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Valid hex color required'),
});

interface Step {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function OnboardPage(): JSX.Element {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<InstituteRegistrationForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    admin_name: '',
    admin_email: '',
    subscription_tier: 'white_label',
    branding: {
      primary_color: '#3B82F6',
      secondary_color: '#EF4444',
    },
    settings: {
      timezone: 'Asia/Kolkata',
      academic_year_start: '2024-04-01',
      academic_year_end: '2025-03-31',
      default_batch_size: 30,
      allow_parent_access: true,
      enable_notifications: true,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps: Step[] = [
    {
      id: 1,
      title: 'Institute Information',
      description: 'Basic details about your coaching institute',
      completed: currentStep > 1,
    },
    {
      id: 2,
      title: 'Branding & Customization',
      description: 'Customize the look and feel of your portal',
      completed: currentStep > 2,
    },
    {
      id: 3,
      title: 'Subscription Plan',
      description: 'Choose the plan that fits your needs',
      completed: currentStep > 3,
    },
    {
      id: 4,
      title: 'Payment Setup',
      description: 'Configure your payment and billing information',
      completed: false,
    },
  ];

  const subscriptionPlans = [
    {
      id: 'white_label' as SubscriptionTier,
      name: 'White Label Solution',
      description: 'Complete branded solution for large institutes',
      price: '₹5,00,000',
      billingPeriod: 'Setup Fee',
      monthlyFee: '₹99 per student/month',
      minStudents: 100,
      popular: true,
      features: [
        'Custom branding & themes',
        'Dedicated support team',
        'Analytics portal access',
        '20 hours teacher training',
        'Custom domain mapping',
        'White-label mobile app',
        'Priority feature requests',
      ],
      icon: Crown,
      color: 'bg-gradient-to-r from-purple-600 to-blue-600',
    },
    {
      id: 'integration' as SubscriptionTier,
      name: 'Integration Package',
      description: 'API access and teacher dashboard',
      price: '₹50,000',
      billingPeriod: 'per month',
      monthlyFee: 'Teacher Dashboard: ₹25,000/month',
      minStudents: 0,
      popular: false,
      features: [
        'Question bank API access',
        'AI tutoring API integration',
        'Advanced analytics API',
        'Webhook support',
        'Teacher dashboard access',
        'Progress tracking tools',
        'Parent communication system',
      ],
      icon: Zap,
      color: 'bg-gradient-to-r from-green-600 to-teal-600',
    },
    {
      id: 'basic' as SubscriptionTier,
      name: 'School Partnership',
      description: 'Institutional license for schools',
      price: '₹2,00,000',
      billingPeriod: 'per year',
      monthlyFee: 'Unlimited students included',
      minStudents: 0,
      popular: false,
      features: [
        'Complete curriculum integration',
        'Teacher training & support',
        'Parent communication system',
        'School-wide analytics',
        'Custom content creation',
        'Multi-language support',
        '2-year minimum contract',
      ],
      icon: Star,
      color: 'bg-gradient-to-r from-orange-600 to-red-600',
    },
  ];

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1:
        try {
          instituteInfoSchema.parse({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            website: formData.website,
            admin_name: formData.admin_name,
            admin_email: formData.admin_email,
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            error.errors.forEach((err) => {
              if (err.path[0]) {
                newErrors[err.path[0] as string] = err.message;
              }
            });
          }
        }
        break;
        
      case 2:
        try {
          brandingSchema.parse(formData.branding);
        } catch (error) {
          if (error instanceof z.ZodError) {
            error.errors.forEach((err) => {
              if (err.path[0]) {
                newErrors[`branding.${err.path[0]}`] = err.message;
              }
            });
          }
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (): void => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = (): void => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateCurrentStep()) return;
    
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to dashboard after successful onboarding
      router.push('/dashboard?onboarded=true');
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (): JSX.Element => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Institute Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Excellence Coaching Institute"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Institute Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="info@excellence.edu"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Website (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="https://excellence.edu"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                {errors.website && <p className="text-sm text-red-600">{errors.website}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  placeholder="123 Education Street, Knowledge City, State - 560001"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full min-h-[100px] pl-10 pt-3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Primary Administrator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Dr. Rajesh Kumar"
                      value={formData.admin_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, admin_name: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                  {errors.admin_name && <p className="text-sm text-red-600">{errors.admin_name}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="admin@excellence.edu"
                      value={formData.admin_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, admin_email: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                  {errors.admin_email && <p className="text-sm text-red-600">{errors.admin_email}</p>}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Palette className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold">Customize Your Brand</h3>
              <p className="text-gray-600">Choose colors that represent your institute</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.branding.primary_color}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        branding: { ...prev.branding, primary_color: e.target.value }
                      }))}
                      className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <Input
                      value={formData.branding.primary_color}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        branding: { ...prev.branding, primary_color: e.target.value }
                      }))}
                      className="flex-1"
                    />
                  </div>
                  {errors['branding.primary_color'] && (
                    <p className="text-sm text-red-600">{errors['branding.primary_color']}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secondary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.branding.secondary_color}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        branding: { ...prev.branding, secondary_color: e.target.value }
                      }))}
                      className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <Input
                      value={formData.branding.secondary_color}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        branding: { ...prev.branding, secondary_color: e.target.value }
                      }))}
                      className="flex-1"
                    />
                  </div>
                  {errors['branding.secondary_color'] && (
                    <p className="text-sm text-red-600">{errors['branding.secondary_color']}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Preview</h4>
                <div className="border rounded-lg p-4 bg-white">
                  <div 
                    className="h-16 rounded-t-lg flex items-center px-4"
                    style={{ backgroundColor: formData.branding.primary_color }}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full mr-3"></div>
                    <div className="text-white">
                      <div className="font-semibold">{formData.name || 'Your Institute'}</div>
                      <div className="text-xs opacity-80">Coach Portal</div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: formData.branding.secondary_color }}
                      ></div>
                      <div className="text-sm">Sample navigation item</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: formData.branding.secondary_color }}
                      ></div>
                      <div className="text-sm">Another menu item</div>
                    </div>
                    <div 
                      className="mt-4 px-3 py-2 rounded text-white text-sm text-center"
                      style={{ backgroundColor: formData.branding.primary_color }}
                    >
                      Sample Button
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold">Choose Your Plan</h3>
              <p className="text-gray-600">Select the subscription that best fits your institute</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => {
                const IconComponent = plan.icon;
                const isSelected = formData.subscription_tier === plan.id;
                
                return (
                  <Card 
                    key={plan.id}
                    className={cn(
                      'relative cursor-pointer transition-all duration-200 hover:shadow-lg',
                      isSelected ? 'ring-2 ring-primary shadow-lg' : '',
                      plan.popular ? 'border-primary' : ''
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, subscription_tier: plan.id }))}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <div className={`mx-auto w-12 h-12 rounded-full ${plan.color} flex items-center justify-center mb-4`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      
                      <div className="text-center pt-4">
                        <div className="text-3xl font-bold text-gray-900">
                          {plan.price}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {plan.billingPeriod}
                        </div>
                        {plan.monthlyFee && (
                          <div className="text-sm text-gray-600 mt-1">
                            {plan.monthlyFee}
                          </div>
                        )}
                        {plan.minStudents > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Minimum {plan.minStudents} students
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {isSelected && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Selected</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CreditCard className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold">Payment Setup</h3>
              <p className="text-gray-600">Configure your billing and payment information</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Selected Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const selectedPlan = subscriptionPlans.find(p => p.id === formData.subscription_tier);
                    return selectedPlan ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <selectedPlan.icon className="h-6 w-6 text-primary" />
                          <div>
                            <div className="font-medium">{selectedPlan.name}</div>
                            <div className="text-sm text-gray-600">{selectedPlan.description}</div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span>Setup Fee:</span>
                            <span className="font-semibold">{selectedPlan.price}</span>
                          </div>
                          {selectedPlan.monthlyFee && (
                            <div className="flex justify-between items-center">
                              <span>Monthly Fee:</span>
                              <span className="font-semibold">{selectedPlan.monthlyFee}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Payment processing will be set up after account creation. 
                            You'll receive an invoice and payment instructions via email.
                          </p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to NEETAI Coach Portal</h1>
          <p className="text-gray-600 mt-2">Let's set up your coaching institute in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium',
                  currentStep === step.id 
                    ? 'border-primary bg-primary text-white' 
                    : step.completed 
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                )}>
                  {step.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'h-1 w-16 mx-2',
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <div className="font-medium text-gray-900">
                Step {currentStep}: {steps[currentStep - 1].title}
              </div>
              <div className="text-sm text-gray-600">
                {steps[currentStep - 1].description}
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}