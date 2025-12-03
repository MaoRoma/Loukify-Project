/**
 * API Configuration
 * 
 * This file provides a centralized way to make API calls to the backend.
 * All API requests go through this configuration, making it easy to:
 * - Change the API URL in one place
 * - Add authentication tokens automatically
 * - Handle errors consistently
 * - Add request/response logging if needed
 */

import { supabase } from '../supabase/client';

// Get API base URL from environment variable or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Helper function to get the current session token from Supabase
 */
const getAuthToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    if (!session?.access_token) {
      console.warn('No active session or access token found');
      return null;
    }
    return session.access_token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Helper function to make API requests
 * Automatically adds authentication token and handles errors
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  // Get token from Supabase session
  const token = await getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });

    // Handle authentication errors specifically
    if (response.status === 401) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: 'Authentication failed', message: 'Please log in to continue' };
      }
      
      // If we're on the client side and get a 401, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      
      throw new Error(errorData.error || errorData.message || 'Authentication required');
    }

    // Handle 404 - route not found
    if (response.status === 404) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: 'Endpoint not found', message: `The endpoint ${endpoint} does not exist` };
      }
      throw new Error(errorData.error || errorData.message || `API Error: 404 Not Found - ${endpoint}`);
    }

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      return { success: true };
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Enhanced error logging
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('API Request failed - Network error. Is the backend server running?', {
        endpoint,
        baseUrl: API_BASE_URL,
        fullUrl: `${API_BASE_URL}${endpoint}`
      });
      throw new Error(`Cannot connect to backend server. Make sure it's running on ${API_BASE_URL}`);
    }
    console.error('API Request failed:', error);
    throw error;
  }
};

/**
 * API endpoints object
 * Provides easy access to all backend endpoints
 */
export const api = {
  // Products API
  products: {
    getAll: () => apiRequest('/api/products'),
    getById: (id: string) => apiRequest(`/api/products/${id}`),
    create: (data: {
      product_name: string;
      product_description?: string;
      product_price: number;
      product_category?: string;
      product_status?: string;
      product_image?: string;
    }) => apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => apiRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => apiRequest(`/api/products/${id}`, {
      method: 'DELETE',
    }),
  },

  // Customers API
  customers: {
    getAll: () => apiRequest('/api/customers'),
    getById: (id: string) => apiRequest(`/api/customers/${id}`),
    create: (data: {
      customer_name: string;
      customer_email: string;
      customer_phone?: string;
      customer_location?: string;
    }) => apiRequest('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => apiRequest(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => apiRequest(`/api/customers/${id}`, {
      method: 'DELETE',
    }),
  },

  // Orders API
  orders: {
    getAll: () => apiRequest('/api/orders'),
    getById: (id: string) => apiRequest(`/api/orders/${id}`),
    create: (data: {
      customer_id: string;
      total_price: number;
      date?: string;
    }) => apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => apiRequest(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => apiRequest(`/api/orders/${id}`, {
      method: 'DELETE',
    }),
  },

  // Settings API
  settings: {
    get: () => apiRequest('/api/settings'),
    getById: (id: string) => apiRequest(`/api/settings/${id}`),
    create: (data: {
      first_name: string;
      last_name: string;
      email_address: string;
      phone_number?: string;
      store_name: string;
      store_description?: string;
      store_url?: string;
    }) => apiRequest('/api/settings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => apiRequest(`/api/settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => apiRequest(`/api/settings/${id}`, {
      method: 'DELETE',
    }),
  },

  // Templates API
  templates: {
    getAll: () => apiRequest('/api/templates'),
    getById: (id: string) => apiRequest(`/api/templates/${id}`),
    create: (data: {
      template_name: string;
      theme_part?: any;
      header_part?: any;
      section_part?: any;
      footer_part?: any;
    }) => apiRequest('/api/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => apiRequest(`/api/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => apiRequest(`/api/templates/${id}`, {
      method: 'DELETE',
    }),
  },

  // Store Templates API (Seller's customized store)
  storeTemplates: {
    get: () => apiRequest('/api/store-templates'),
    getById: (id: string) => apiRequest(`/api/store-templates/${id}`),
    getBySubdomain: (subdomain: string) => apiRequest(`/api/store-templates/subdomain/${subdomain}`),
    save: (data: {
      base_template_id?: string;
      theme_part?: any;
      header_part?: any;
      section_part?: any;
      footer_part?: any;
      store_name?: string;
      store_subdomain?: string;
    }) => apiRequest('/api/store-templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    publish: (data?: { store_subdomain?: string }) => apiRequest('/api/store-templates/publish', {
      method: 'PUT',
      body: JSON.stringify(data || {}),
    }),
    unpublish: () => apiRequest('/api/store-templates/unpublish', {
      method: 'PUT',
    }),
    delete: () => apiRequest('/api/store-templates', {
      method: 'DELETE',
    }),
  },
};

