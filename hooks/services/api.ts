import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration - UPDATE THIS WITH YOUR ACTUAL IP ADDRESS
const API_BASE_URL =  'http://10.176.40.51:4000/api' //'https://quickspin.nexusmwi.com/api';  

class ApiService {
  private async getAuthHeaders() {
    try {
      const token = await AsyncStorage.getItem('token');
      return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  private async handleResponse(response: Response) {
  console.log('API Response status:', response.status);
  console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    let errorMessage = 'Network request failed';
    try {
      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
    } catch (error) {
      console.error('Error parsing error response:', error);
      errorMessage = `HTTP error! status: ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  
  try {
    const data = await response.json();
    console.log('API Response data received');
    return data;
  } catch (error) {
    console.error('Error parsing successful response:', error);
    throw new Error('Invalid JSON response from server');
  }
}

  private async fetchWithTimeout(url: string, options: RequestInit, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: any) {
    console.log('Registering user...');
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async login(credentials: { email: string; password: string }) {
    console.log('Logging in...');
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  async getProfile() {
    console.log('Getting profile...');
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/auth/profile`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Services endpoints
  async getServices() {
    console.log('Fetching services...');
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  // Orders endpoints
  async createOrder(orderData: any) {
    console.log('Creating order...');
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return this.handleResponse(response);
  }

  async getOrders() {
    console.log('Fetching orders...');
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/orders`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getOrderById(orderId: string) {
    console.log('Fetching order by ID...');
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/orders/${orderId}`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Tracking endpoints
  async getTracking(orderId: string) {
    console.log('Fetching tracking...');
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/tracking/${orderId}`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

// Export both named and default
export const apiService = new ApiService();
export default apiService;