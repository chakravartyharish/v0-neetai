# TASK-01-09: Institute Profile Management Backend System

## 📋 Task Details
**Task ID**: TASK-01-09
**Story Reference**: STORY-01-03 (Institute Profile Management)
**Sprint**: Sprint 1
**Phase**: Backend
**Priority**: P1 (High)
**Estimated Effort**: 2 days
**Assignee**: Backend Engineer
**Dependencies**: TASK-01-01 (Database Schema), TASK-01-06 (Verification Backend)

## 🎯 Task Description
Develop a comprehensive backend system for institute profile management that allows verified institutes to maintain detailed profiles, manage comprehensive information, track institutional data, and generate public-facing institute profiles with privacy controls and data validation.

## 📋 Acceptance Criteria

### AC-01: Institute Profile Data Management
- [ ] Complete CRUD operations for institute profile information
- [ ] Comprehensive data validation and sanitization
- [ ] Version control and change tracking for profile data
- [ ] Bulk data import/export capabilities
- [ ] Profile completeness scoring and recommendations

### AC-02: Advanced Profile Features
- [ ] Multi-media content management (photos, videos, brochures)
- [ ] Social media integration and link management
- [ ] Accreditation and certification tracking
- [ ] Awards and recognition management
- [ ] Historical data and milestone tracking

### AC-03: Public Profile Generation
- [ ] Dynamic public profile page generation
- [ ] SEO optimization with meta tags and structured data
- [ ] Privacy controls for sensitive information
- [ ] Custom URL slug generation and management
- [ ] Profile analytics and visitor tracking

### AC-04: Profile Search and Discovery
- [ ] Advanced search with multiple filters and criteria
- [ ] Location-based search with geo-coordinates
- [ ] Specialization and program-based filtering
- [ ] Rating and review integration
- [ ] Featured and premium profile management

### AC-05: Integration and Compliance
- [ ] Integration with verification system for data validation
- [ ] GDPR compliance with data protection controls
- [ ] Audit logging for all profile changes
- [ ] API rate limiting and access controls
- [ ] Data backup and recovery mechanisms

## 🔧 Technical Specifications

### Database Schema Extensions

```sql
-- Institute profiles comprehensive table
CREATE TABLE institute_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID REFERENCES institutes(id) UNIQUE NOT NULL,
    
    -- Basic Profile Information
    profile_status ENUM('draft', 'published', 'archived', 'suspended') DEFAULT 'draft',
    profile_completeness_score DECIMAL(3,2) DEFAULT 0.00,
    public_profile_enabled BOOLEAN DEFAULT false,
    custom_url_slug VARCHAR(100) UNIQUE,
    
    -- Detailed Information
    detailed_description TEXT,
    mission_statement TEXT,
    vision_statement TEXT,
    values_statement TEXT,
    history_overview TEXT,
    unique_selling_points JSONB DEFAULT '[]',
    
    -- Academic Information
    academic_programs JSONB DEFAULT '{}', -- {program_name: {duration, description, fees, etc.}}
    specializations JSONB DEFAULT '[]',
    study_materials JSONB DEFAULT '[]',
    teaching_methodologies JSONB DEFAULT '[]',
    success_rate_statistics JSONB DEFAULT '{}',
    
    -- Faculty Information
    total_faculty_count INTEGER DEFAULT 0,
    faculty_qualifications JSONB DEFAULT '{}',
    faculty_experience_stats JSONB DEFAULT '{}',
    notable_faculty JSONB DEFAULT '[]',
    
    -- Infrastructure & Facilities
    total_area_sqft INTEGER,
    classroom_count INTEGER DEFAULT 0,
    laboratory_count INTEGER DEFAULT 0,
    library_details JSONB DEFAULT '{}',
    technology_infrastructure JSONB DEFAULT '{}',
    amenities JSONB DEFAULT '[]',
    accessibility_features JSONB DEFAULT '[]',
    
    -- Location & Contact Enhancement
    campus_locations JSONB DEFAULT '[]', -- Multiple campuses
    transportation_access JSONB DEFAULT '{}',
    nearby_landmarks JSONB DEFAULT '[]',
    
    -- Media & Visual Content
    logo_url VARCHAR(500),
    banner_images JSONB DEFAULT '[]',
    facility_photos JSONB DEFAULT '[]',
    virtual_tour_url VARCHAR(500),
    promotional_videos JSONB DEFAULT '[]',
    brochures_documents JSONB DEFAULT '[]',
    
    -- Social Media & Online Presence
    website_url VARCHAR(500),
    social_media_links JSONB DEFAULT '{}',
    online_reviews_summary JSONB DEFAULT '{}',
    testimonials JSONB DEFAULT '[]',
    news_mentions JSONB DEFAULT '[]',
    
    -- Achievements & Recognition
    accreditations JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    awards JSONB DEFAULT '[]',
    rankings JSONB DEFAULT '[]',
    partnerships JSONB DEFAULT '[]',
    
    -- Student Information
    current_student_count INTEGER DEFAULT 0,
    student_capacity INTEGER DEFAULT 0,
    student_demographics JSONB DEFAULT '{}',
    alumni_network_size INTEGER DEFAULT 0,
    placement_statistics JSONB DEFAULT '{}',
    
    -- Admission Information
    admission_process JSONB DEFAULT '{}',
    eligibility_criteria JSONB DEFAULT '{}',
    fee_structure JSONB DEFAULT '{}',
    scholarship_programs JSONB DEFAULT '[]',
    admission_calendar JSONB DEFAULT '{}',
    
    -- SEO & Discovery
    meta_title VARCHAR(200),
    meta_description TEXT,
    keywords JSONB DEFAULT '[]',
    structured_data JSONB DEFAULT '{}',
    search_visibility BOOLEAN DEFAULT true,
    
    -- Analytics & Performance
    profile_views_count INTEGER DEFAULT 0,
    profile_shares_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0,
    conversion_metrics JSONB DEFAULT '{}',
    
    -- Compliance & Moderation
    content_moderation_status ENUM('approved', 'pending', 'rejected') DEFAULT 'pending',
    moderation_notes TEXT,
    gdpr_consent BOOLEAN DEFAULT false,
    data_processing_consent BOOLEAN DEFAULT false,
    
    -- Timestamps and Versioning
    profile_version INTEGER DEFAULT 1,
    published_at TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Profile change history for audit and version control
CREATE TABLE institute_profile_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_profile_id UUID REFERENCES institute_profiles(id),
    
    -- Change Information
    change_type ENUM('create', 'update', 'publish', 'unpublish', 'archive') NOT NULL,
    changed_fields JSONB DEFAULT '[]', -- Array of field names that changed
    old_values JSONB DEFAULT '{}', -- Previous values of changed fields
    new_values JSONB DEFAULT '{}', -- New values of changed fields
    
    -- Change Metadata
    changed_by UUID REFERENCES auth.users(id),
    change_reason TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Version Information
    version_before INTEGER NOT NULL,
    version_after INTEGER NOT NULL,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Profile media management
CREATE TABLE institute_profile_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_profile_id UUID REFERENCES institute_profiles(id),
    
    -- Media Information
    media_type ENUM('image', 'video', 'document', 'audio') NOT NULL,
    media_category ENUM('logo', 'banner', 'facility', 'promotional', 'document', 'testimonial') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER, -- in bytes
    mime_type VARCHAR(100),
    
    -- Media Metadata
    title VARCHAR(255),
    description TEXT,
    alt_text VARCHAR(255), -- for accessibility
    caption TEXT,
    
    -- Display Options
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    
    -- Processing Information
    processing_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    thumbnails JSONB DEFAULT '{}', -- URLs of different sized thumbnails
    metadata_extracted JSONB DEFAULT '{}', -- EXIF, duration, etc.
    
    -- Moderation
    moderation_status ENUM('approved', 'pending', 'rejected') DEFAULT 'pending',
    moderation_reason TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Profile search optimization
CREATE TABLE institute_profile_search_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_profile_id UUID REFERENCES institute_profiles(id) UNIQUE,
    
    -- Search Text (for full-text search)
    search_content TSVECTOR,
    search_keywords TEXT[], -- Extracted keywords for search
    
    -- Location Data
    geo_coordinates POINT, -- PostGIS point for location-based search
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    postal_code VARCHAR(20),
    
    -- Category and Classification
    institute_categories TEXT[],
    programs_offered TEXT[],
    specializations TEXT[],
    target_exams TEXT[],
    
    -- Quality Scores (for ranking)
    overall_rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    verification_score DECIMAL(3,2) DEFAULT 0.00,
    profile_quality_score DECIMAL(3,2) DEFAULT 0.00,
    
    -- Search Metrics
    search_impressions INTEGER DEFAULT 0,
    search_clicks INTEGER DEFAULT 0,
    click_through_rate DECIMAL(5,4) DEFAULT 0.0000,
    
    last_indexed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_institute_profiles_status ON institute_profiles(profile_status);
CREATE INDEX idx_institute_profiles_slug ON institute_profiles(custom_url_slug);
CREATE INDEX idx_institute_profiles_completeness ON institute_profiles(profile_completeness_score);
CREATE INDEX idx_institute_profiles_published ON institute_profiles(public_profile_enabled, published_at);

CREATE INDEX idx_profile_media_category ON institute_profile_media(media_category, display_order);
CREATE INDEX idx_profile_media_featured ON institute_profile_media(is_featured, is_public);

CREATE INDEX idx_search_data_location ON institute_profile_search_data USING GIST(geo_coordinates);
CREATE INDEX idx_search_data_rating ON institute_profile_search_data(overall_rating DESC);
CREATE INDEX idx_search_data_content ON institute_profile_search_data USING GIN(search_content);

-- Full-text search index
CREATE INDEX idx_search_keywords ON institute_profile_search_data USING GIN(search_keywords);
```

### API Implementation

```typescript
// app/api/institutes/[id]/profile/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const includePrivate = searchParams.get('includePrivate') === 'true';
    const version = searchParams.get('version');

    const user = await getCurrentUser();
    
    // Check access permissions
    if (includePrivate) {
      await verifyInstituteAccess(user.id, params.id, 'manager');
    }

    let query = supabase
      .from('institute_profiles')
      .select(`
        *,
        institute_profile_media(
          id, media_type, media_category, file_url, title, description, 
          alt_text, display_order, is_featured, thumbnails
        ),
        institute_profile_search_data(
          overall_rating, review_count, geo_coordinates, city, state
        )
      `)
      .eq('institute_id', params.id);

    // Filter private data for public requests
    if (!includePrivate) {
      query = query.eq('public_profile_enabled', true);
    }

    // Handle version-specific requests
    if (version) {
      query = query.eq('profile_version', parseInt(version));
    }

    const { data: profile, error } = await query.single();
    if (error) throw new DatabaseError('Failed to fetch profile', error);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found or not accessible' },
        { status: 404 }
      );
    }

    // Calculate dynamic metrics
    const enhancedProfile = {
      ...profile,
      completeness_analysis: calculateCompletenessAnalysis(profile),
      seo_score: calculateSEOScore(profile),
      public_metrics: includePrivate ? calculatePrivateMetrics(profile) : null,
      next_steps: includePrivate ? generateProfileImprovementSuggestions(profile) : null
    };

    // Log profile view for analytics
    if (!includePrivate) {
      await logProfileView(params.id, request);
    }

    return NextResponse.json({
      success: true,
      data: enhancedProfile
    });

  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profileData = await request.json();
    const user = await getCurrentUser();
    
    // Verify institute access
    await verifyInstituteAccess(user.id, params.id, 'manager');

    // Validate profile data
    const validatedData = profileUpdateSchema.parse(profileData);

    // Get current profile for change tracking
    const { data: currentProfile } = await supabase
      .from('institute_profiles')
      .select('*')
      .eq('institute_id', params.id)
      .single();

    if (!currentProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Calculate completeness score
    const completenessScore = calculateProfileCompleteness(validatedData);
    
    // Prepare update data
    const updateData = {
      ...validatedData,
      profile_completeness_score: completenessScore,
      profile_version: currentProfile.profile_version + 1,
      last_updated_at: new Date().toISOString()
    };

    // Update profile in transaction
    const { data: updatedProfile, error } = await supabase
      .from('institute_profiles')
      .update(updateData)
      .eq('institute_id', params.id)
      .select()
      .single();

    if (error) throw new DatabaseError('Failed to update profile', error);

    // Log profile changes
    await logProfileChange(currentProfile, updatedProfile, user.id, validatedData);

    // Update search data
    await updateSearchData(params.id, updatedProfile);

    // Generate SEO data if profile is published
    if (updatedProfile.public_profile_enabled) {
      await generateSEOData(updatedProfile);
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    return handleApiError(error);
  }
}

// app/api/institutes/[id]/profile/media/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const user = await getCurrentUser();
    
    await verifyInstituteAccess(user.id, params.id, 'manager');

    const file = formData.get('file') as File;
    const mediaType = formData.get('mediaType') as string;
    const mediaCategory = formData.get('mediaCategory') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    // Validate file
    const validation = await validateMediaFile(file, mediaType);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Upload file to storage
    const uploadResult = await uploadMediaFile(file, {
      instituteId: params.id,
      category: mediaCategory
    });

    if (!uploadResult.success) {
      throw new Error('Failed to upload file');
    }

    // Create media record
    const { data: mediaRecord, error } = await supabase
      .from('institute_profile_media')
      .insert({
        institute_profile_id: await getProfileIdByInstituteId(params.id),
        media_type: mediaType,
        media_category: mediaCategory,
        file_name: file.name,
        file_url: uploadResult.url,
        file_size: file.size,
        mime_type: file.type,
        title,
        description,
        processing_status: 'completed'
      })
      .select()
      .single();

    if (error) throw new DatabaseError('Failed to create media record', error);

    // Process thumbnails and metadata in background
    processMediaInBackground(mediaRecord.id);

    return NextResponse.json({
      success: true,
      data: mediaRecord,
      message: 'Media uploaded successfully'
    });

  } catch (error) {
    return handleApiError(error);
  }
}

// app/api/institutes/[id]/profile/publish/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    await verifyInstituteAccess(user.id, params.id, 'admin');

    // Get current profile
    const { data: profile } = await supabase
      .from('institute_profiles')
      .select('*')
      .eq('institute_id', params.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Validate profile completeness for publishing
    const completenessCheck = validateProfileForPublishing(profile);
    if (!completenessCheck.canPublish) {
      return NextResponse.json({
        error: 'Profile incomplete for publishing',
        missingFields: completenessCheck.missingFields,
        suggestions: completenessCheck.suggestions
      }, { status: 400 });
    }

    // Generate custom URL slug if not exists
    let customSlug = profile.custom_url_slug;
    if (!customSlug) {
      customSlug = await generateUniqueSlug(profile.institute_id);
    }

    // Update profile to published state
    const { data: publishedProfile, error } = await supabase
      .from('institute_profiles')
      .update({
        profile_status: 'published',
        public_profile_enabled: true,
        custom_url_slug: customSlug,
        published_at: new Date().toISOString(),
        profile_version: profile.profile_version + 1
      })
      .eq('institute_id', params.id)
      .select()
      .single();

    if (error) throw new DatabaseError('Failed to publish profile', error);

    // Update search index
    await updateSearchData(params.id, publishedProfile);

    // Generate SEO metadata
    await generateSEOData(publishedProfile);

    // Log publication event
    await logProfileChange(profile, publishedProfile, user.id, { action: 'publish' });

    return NextResponse.json({
      success: true,
      data: {
        ...publishedProfile,
        public_url: `${process.env.NEXT_PUBLIC_APP_URL}/institutes/${customSlug}`
      },
      message: 'Profile published successfully'
    });

  } catch (error) {
    return handleApiError(error);
  }
}

// app/api/institutes/search/route.ts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const location = searchParams.get('location');
    const specialization = searchParams.get('specialization');
    const programs = searchParams.get('programs');
    const rating = searchParams.get('rating');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'relevance';

    // Build search query
    let searchQuery = supabase
      .from('institute_profile_search_data')
      .select(`
        *,
        institute_profiles(
          id, institute_id, detailed_description, logo_url, 
          custom_url_slug, profile_completeness_score
        )
      `)
      .eq('institute_profiles.public_profile_enabled', true);

    // Apply text search
    if (query) {
      searchQuery = searchQuery.textSearch('search_content', query);
    }

    // Apply location filter
    if (location) {
      const locationCoords = await geocodeLocation(location);
      if (locationCoords) {
        // Search within 50km radius
        searchQuery = searchQuery
          .filter('geo_coordinates', 'st_dwithin', 
            `POINT(${locationCoords.lng} ${locationCoords.lat})::geography,50000`);
      }
    }

    // Apply specialization filter
    if (specialization) {
      searchQuery = searchQuery.contains('specializations', [specialization]);
    }

    // Apply programs filter
    if (programs) {
      const programsList = programs.split(',');
      searchQuery = searchQuery.overlaps('programs_offered', programsList);
    }

    // Apply rating filter
    if (rating) {
      const minRating = parseFloat(rating);
      searchQuery = searchQuery.gte('overall_rating', minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        searchQuery = searchQuery.order('overall_rating', { ascending: false });
        break;
      case 'reviews':
        searchQuery = searchQuery.order('review_count', { ascending: false });
        break;
      case 'distance':
        if (location) {
          // Sort by distance (requires locationCoords)
        }
        break;
      default: // relevance
        if (query) {
          searchQuery = searchQuery.order('search_impressions', { ascending: false });
        }
        break;
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    searchQuery = searchQuery.range(offset, offset + limit - 1);

    const { data: searchResults, error } = await searchQuery;
    if (error) throw new DatabaseError('Search failed', error);

    // Log search query for analytics
    await logSearchQuery(query, location, searchResults?.length || 0);

    // Calculate additional metrics
    const enhancedResults = searchResults?.map(result => ({
      ...result,
      distance: location ? calculateDistance(location, result.geo_coordinates) : null,
      matchScore: calculateMatchScore(query, result)
    })) || [];

    return NextResponse.json({
      success: true,
      data: {
        results: enhancedResults,
        pagination: {
          page,
          limit,
          total: enhancedResults.length,
          hasMore: enhancedResults.length === limit
        },
        filters: {
          query,
          location,
          specialization,
          programs,
          rating
        }
      }
    });

  } catch (error) {
    return handleApiError(error);
  }
}
```

### Service Layer Implementation

```typescript
// services/ProfileManagementService.ts
export class ProfileManagementService {
  async calculateProfileCompleteness(profileData: any): Promise<number> {
    const requiredFields = [
      'detailed_description',
      'mission_statement',
      'academic_programs',
      'faculty_qualifications',
      'total_faculty_count',
      'classroom_count',
      'contact_info',
      'logo_url'
    ];

    const optionalFields = [
      'vision_statement',
      'values_statement',
      'history_overview',
      'virtual_tour_url',
      'website_url',
      'social_media_links',
      'accreditations',
      'awards'
    ];

    let score = 0;
    let totalPossible = 0;

    // Check required fields (70% weight)
    requiredFields.forEach(field => {
      totalPossible += 7;
      if (this.isFieldComplete(profileData[field])) {
        score += 7;
      }
    });

    // Check optional fields (30% weight)
    optionalFields.forEach(field => {
      totalPossible += 3;
      if (this.isFieldComplete(profileData[field])) {
        score += 3;
      }
    });

    return Math.round((score / totalPossible) * 100) / 100;
  }

  private isFieldComplete(fieldValue: any): boolean {
    if (fieldValue === null || fieldValue === undefined) return false;
    if (typeof fieldValue === 'string') return fieldValue.trim().length > 0;
    if (Array.isArray(fieldValue)) return fieldValue.length > 0;
    if (typeof fieldValue === 'object') return Object.keys(fieldValue).length > 0;
    if (typeof fieldValue === 'number') return fieldValue > 0;
    return !!fieldValue;
  }

  async generateProfileImprovementSuggestions(profile: any): Promise<string[]> {
    const suggestions: string[] = [];

    if (!profile.detailed_description || profile.detailed_description.length < 200) {
      suggestions.push('Add a comprehensive description (at least 200 characters)');
    }

    if (!profile.logo_url) {
      suggestions.push('Upload a professional institute logo');
    }

    if (!profile.banner_images || profile.banner_images.length === 0) {
      suggestions.push('Add banner images to showcase your institute');
    }

    if (!profile.facility_photos || profile.facility_photos.length < 3) {
      suggestions.push('Upload facility photos (minimum 3 recommended)');
    }

    if (!profile.virtual_tour_url) {
      suggestions.push('Consider adding a virtual tour for better engagement');
    }

    if (!profile.website_url) {
      suggestions.push('Add your institute website URL');
    }

    if (!profile.social_media_links || Object.keys(profile.social_media_links).length === 0) {
      suggestions.push('Connect your social media profiles');
    }

    if (profile.profile_completeness_score < 0.8) {
      suggestions.push('Complete missing profile sections to improve visibility');
    }

    return suggestions;
  }

  async generateSEOData(profile: any): Promise<void> {
    // Generate meta title
    const metaTitle = this.generateMetaTitle(profile);
    
    // Generate meta description
    const metaDescription = this.generateMetaDescription(profile);
    
    // Generate keywords
    const keywords = this.extractKeywords(profile);
    
    // Generate structured data
    const structuredData = this.generateStructuredData(profile);

    // Update profile with SEO data
    await supabase
      .from('institute_profiles')
      .update({
        meta_title: metaTitle,
        meta_description: metaDescription,
        keywords: keywords,
        structured_data: structuredData
      })
      .eq('id', profile.id);
  }

  private generateMetaTitle(profile: any): string {
    const instituteName = profile.institutes?.name || 'Institute';
    const location = profile.institutes?.address?.city || '';
    const specialization = profile.specializations?.[0] || 'Education';
    
    return `${instituteName} - ${specialization} Institute in ${location}`.substring(0, 60);
  }

  private generateMetaDescription(profile: any): string {
    const instituteName = profile.institutes?.name || 'Our Institute';
    const description = profile.detailed_description || '';
    const location = profile.institutes?.address?.city || '';
    
    const baseDescription = description.length > 100 
      ? description.substring(0, 100) + '...'
      : description;
    
    return `${instituteName} in ${location}. ${baseDescription}`.substring(0, 160);
  }

  private extractKeywords(profile: any): string[] {
    const keywords = new Set<string>();
    
    // Add institute name
    if (profile.institutes?.name) {
      keywords.add(profile.institutes.name.toLowerCase());
    }
    
    // Add location
    if (profile.institutes?.address?.city) {
      keywords.add(profile.institutes.address.city.toLowerCase());
    }
    
    // Add specializations
    if (profile.specializations) {
      profile.specializations.forEach((spec: string) => keywords.add(spec.toLowerCase()));
    }
    
    // Add programs
    if (profile.academic_programs) {
      Object.keys(profile.academic_programs).forEach(program => 
        keywords.add(program.toLowerCase())
      );
    }
    
    return Array.from(keywords);
  }

  private generateStructuredData(profile: any): any {
    return {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": profile.institutes?.name,
      "description": profile.detailed_description,
      "url": `${process.env.NEXT_PUBLIC_APP_URL}/institutes/${profile.custom_url_slug}`,
      "logo": profile.logo_url,
      "image": profile.banner_images || [],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": profile.institutes?.address?.street,
        "addressLocality": profile.institutes?.address?.city,
        "addressRegion": profile.institutes?.address?.state,
        "postalCode": profile.institutes?.address?.pincode,
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": profile.institutes?.contact_info?.phone,
        "email": profile.institutes?.contact_info?.email
      },
      "sameAs": Object.values(profile.social_media_links || {}),
      "aggregateRating": profile.institute_profile_search_data?.overall_rating ? {
        "@type": "AggregateRating",
        "ratingValue": profile.institute_profile_search_data.overall_rating,
        "reviewCount": profile.institute_profile_search_data.review_count
      } : undefined
    };
  }

  async updateSearchData(instituteId: string, profileData: any): Promise<void> {
    // Extract searchable content
    const searchContent = this.extractSearchableContent(profileData);
    
    // Generate keywords
    const keywords = this.extractKeywords(profileData);
    
    // Get geo coordinates
    const geoCoordinates = await this.getGeoCoordinates(profileData);
    
    // Calculate quality scores
    const qualityScores = this.calculateQualityScores(profileData);

    await supabase
      .from('institute_profile_search_data')
      .upsert({
        institute_profile_id: profileData.id,
        search_content: searchContent,
        search_keywords: keywords,
        geo_coordinates: geoCoordinates,
        city: profileData.institutes?.address?.city,
        state: profileData.institutes?.address?.state,
        institute_categories: this.extractCategories(profileData),
        programs_offered: Object.keys(profileData.academic_programs || {}),
        specializations: profileData.specializations || [],
        profile_quality_score: qualityScores.profile,
        verification_score: qualityScores.verification,
        last_indexed_at: new Date().toISOString()
      });
  }

  private extractSearchableContent(profileData: any): string {
    const content = [
      profileData.institutes?.name,
      profileData.detailed_description,
      profileData.mission_statement,
      profileData.vision_statement,
      JSON.stringify(profileData.academic_programs),
      JSON.stringify(profileData.specializations),
      JSON.stringify(profileData.unique_selling_points)
    ].filter(Boolean).join(' ');

    return content.toLowerCase();
  }
}

// services/MediaProcessingService.ts
export class MediaProcessingService {
  async processMediaInBackground(mediaId: string): Promise<void> {
    try {
      const media = await this.getMediaById(mediaId);
      
      if (media.media_type === 'image') {
        await this.generateImageThumbnails(media);
        await this.extractImageMetadata(media);
      } else if (media.media_type === 'video') {
        await this.generateVideoThumbnails(media);
        await this.extractVideoMetadata(media);
      }

      // Update processing status
      await supabase
        .from('institute_profile_media')
        .update({
          processing_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', mediaId);

    } catch (error) {
      console.error('Media processing failed:', error);
      
      await supabase
        .from('institute_profile_media')
        .update({
          processing_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', mediaId);
    }
  }

  async generateImageThumbnails(media: any): Promise<void> {
    const sizes = [
      { name: 'small', width: 150, height: 150 },
      { name: 'medium', width: 300, height: 300 },
      { name: 'large', width: 600, height: 600 }
    ];

    const thumbnails: Record<string, string> = {};

    for (const size of sizes) {
      const thumbnailUrl = await this.resizeImage(media.file_url, size);
      thumbnails[size.name] = thumbnailUrl;
    }

    await supabase
      .from('institute_profile_media')
      .update({ thumbnails })
      .eq('id', media.id);
  }
}
```

## 🧪 Testing Requirements

### Unit Tests
```typescript
describe('ProfileManagementService', () => {
  test('calculates profile completeness correctly', async () => {
    const completeProfile = createCompleteProfileData();
    const score = await profileService.calculateProfileCompleteness(completeProfile);
    expect(score).toBeGreaterThan(0.8);
  });

  test('generates appropriate improvement suggestions', async () => {
    const incompleteProfile = createIncompleteProfileData();
    const suggestions = await profileService.generateProfileImprovementSuggestions(incompleteProfile);
    expect(suggestions).toContain('Upload a professional institute logo');
  });

  test('generates SEO-optimized metadata', async () => {
    const profile = createTestProfile();
    await profileService.generateSEOData(profile);
    expect(profile.meta_title).toBeDefined();
    expect(profile.meta_title.length).toBeLessThanOrEqual(60);
  });
});
```

## 📊 Success Metrics
- Profile completeness calculation accuracy > 95%
- SEO metadata generation success rate > 99%
- Media processing completion rate > 98%
- Search query response time < 300ms
- Profile update response time < 500ms

## 📋 Definition of Done
- [ ] All CRUD operations implemented for profiles
- [ ] Profile completeness scoring system functional
- [ ] Media management system operational
- [ ] Public profile generation working
- [ ] Search and discovery features implemented
- [ ] SEO optimization complete
- [ ] Version control and audit logging functional
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests complete
- [ ] Performance benchmarks met

## 🔗 Dependencies
- TASK-01-01 (Database Schema)
- TASK-01-06 (Verification System)
- Media storage service (AWS S3/Cloudinary)
- Image processing service
- Geocoding service
- Search indexing service

## ⚡ Performance Optimization
- Database indexing for search queries
- Image thumbnail generation
- Search result caching
- Lazy loading for media content
- Background processing for heavy operations

## 📝 Notes
- Implement GDPR compliance for data handling
- Consider implementing content moderation
- Plan for multi-language profile support
- Prepare for advanced analytics integration
- Design for high-volume profile management

---

**Task Owner**: Backend Engineer
**Reviewer**: Tech Lead + Product Manager
**Created**: 2024-01-20
**Due Date**: 2024-02-15