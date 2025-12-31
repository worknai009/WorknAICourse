// services/api.ts
import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.request);
        } else {
            // Error in request setup
            console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Type Definitions matching backend schema
export interface Topic {
    name: string;
    _id?: string;
}

export interface Week {
    label: string;
    title: string;
    topics: Topic[];
    _id?: string;
}

export interface SyllabusPhase {
    month: string;
    title: string;
    desc: string;
    weeks: Week[];
    _id?: string;
}

export interface TechnicalSpec {
    label: string;
    value: string;
    icon: string;
    _id?: string;
}

export interface Course {
    _id: string;
    id: string;
    name: string;
    description: string;
    status: 'Online' | 'Offline' | 'Hybrid';
    language: string;
    originalPrice: number;
    discountedPrice: number;
    certificateImage?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CourseDetail extends Course {
    technicalSpecs: TechnicalSpec[];
    syllabusPhases: SyllabusPhase[];
}

export interface CoursesResponse {
    success: boolean;
    count: number;
    total?: number;
    data: Course[];
    pagination?: {
        page: number;
        limit: number;
        pages: number;
    };
}

export interface CourseResponse {
    success: boolean;
    data: CourseDetail;
}

export interface SearchParams {
    q?: string;
    search?: string;
    fields?: string;
    sort?: string;
    limit?: number;
    page?: number;
    status?: 'Online' | 'Offline' | 'Hybrid';
}

// API Service Class
class CourseAPI {
    /**
     * Get all active courses
     * @param params - Optional query parameters for filtering and pagination
     */
    async getAllCourses(params?: SearchParams): Promise<Course[]> {
        try {
            const response = await apiClient.get<CoursesResponse>('/api/courses', {
                params: {
                    ...params,
                    // Only fetch active courses by default
                    isActive: true,
                },
            });

            // Backend returns { success, count, data }
            if (response.data.success && Array.isArray(response.data.data)) {
                return response.data.data;
            }

            // Fallback to empty array if structure is unexpected
            return [];
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            console.error('API Error in getAllCourses:', axiosError);
            throw new Error(
                axiosError.response?.data?.message ||
                'Failed to fetch courses. Please try again later.'
            );
        }
    }

    /**
     * Get a single course by ID with full details
     * @param id - Course custom ID (not MongoDB _id)
     */
    async getCourseById(id: string): Promise<CourseDetail> {
        try {
            const response = await apiClient.get<CourseResponse>(`/api/courses/${id}`);

            // Backend returns { success, data }
            if (response.data.success && response.data.data) {
                return response.data.data;
            }

            throw new Error('Course not found');
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response?.status === 404) {
                throw new Error('Course not found');
            }

            throw new Error(
                axiosError.response?.data?.message ||
                'Failed to fetch course details. Please try again later.'
            );
        }
    }

    /**
     * Search courses by query
     * @param query - Search query string
     */
    async searchCourses(query: string): Promise<Course[]> {
        try {
            if (!query || query.trim() === '') {
                return [];
            }

            const response = await apiClient.get<CoursesResponse>('/api/courses/search', {
                params: { q: query },
            });

            // Backend returns { success, count, query, data }
            if (response.data.success && Array.isArray(response.data.data)) {
                return response.data.data;
            }

            return [];
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            console.error('API Error in searchCourses:', axiosError);

            // Don't throw error for search, just return empty array
            if (axiosError.response?.status === 400) {
                return [];
            }

            throw new Error(
                axiosError.response?.data?.message ||
                'Failed to search courses. Please try again later.'
            );
        }
    }

    /**
     * Get courses by price range
     * @param min - Minimum price
     * @param max - Maximum price
     */
    async getCoursesByPriceRange(min: number, max: number): Promise<Course[]> {
        try {
            const response = await apiClient.get<CoursesResponse>('/api/courses/price-range', {
                params: { min, max },
            });

            if (response.data.success && Array.isArray(response.data.data)) {
                return response.data.data;
            }

            return [];
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            console.error('API Error in getCoursesByPriceRange:', axiosError);
            throw new Error(
                axiosError.response?.data?.message ||
                'Failed to fetch courses by price range.'
            );
        }
    }

    /**
     * Get courses by status
     * @param status - Course status (Online/Offline/Hybrid)
     */
    async getCoursesByStatus(status: 'Online' | 'Offline' | 'Hybrid'): Promise<Course[]> {
        try {
            const response = await apiClient.get<CoursesResponse>(`/api/courses/status/${status}`);

            if (response.data.success && Array.isArray(response.data.data)) {
                return response.data.data;
            }

            return [];
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            console.error('API Error in getCoursesByStatus:', axiosError);
            throw new Error(
                axiosError.response?.data?.message ||
                'Failed to fetch courses by status.'
            );
        }
    }

    /**
     * Get featured courses
     * @param limit - Number of courses to fetch
     */
    async getFeaturedCourses(limit: number = 6): Promise<Course[]> {
        try {
            const response = await apiClient.get<CoursesResponse>('/api/courses/featured', {
                params: { limit },
            });

            if (response.data.success && Array.isArray(response.data.data)) {
                return response.data.data;
            }

            return [];
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            console.error('API Error in getFeaturedCourses:', axiosError);
            throw new Error(
                axiosError.response?.data?.message ||
                'Failed to fetch featured courses.'
            );
        }
    }

    /**
     * Get course syllabus only
     * @param id - Course custom ID
     */
    async getCourseSyllabus(id: string): Promise<{ id: string; name: string; syllabus: SyllabusPhase[] }> {
        try {
            const response = await apiClient.get<{
                success: boolean;
                data: { id: string; name: string; syllabus: SyllabusPhase[] };
            }>(`/api/courses/${id}/syllabus`);

            if (response.data.success && response.data.data) {
                return response.data.data;
            }

            throw new Error('Syllabus not found');
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            throw new Error(
                axiosError.response?.data?.message ||
                'Failed to fetch course syllabus.'
            );
        }
    }

    /**
     * Create a new course (Admin only)
     * @param courseData - Course data to create
     */
    async createCourse(courseData: Partial<CourseDetail>): Promise<CourseDetail> {
        try {
            const response = await apiClient.post<{ success: boolean; data: CourseDetail; message: string }>(
                '/api/courses',
                courseData
            );

            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string; errors?: string[] }>;

            if (axiosError.response?.status === 400) {
                const errors = axiosError.response.data.errors;
                throw new Error(errors ? errors.join(', ') : axiosError.response.data.message);
            }

            throw new Error(
                axiosError.response?.data?.message ||
                'Failed to create course. Please try again later.'
            );
        }
    }

    /**
     * Update an existing course (Admin only)
     * @param id - Course custom ID
     * @param courseData - Updated course data
     */
    async updateCourse(id: string, courseData: Partial<CourseDetail>): Promise<CourseDetail> {
        try {
            const response = await apiClient.put<{ success: boolean; data: CourseDetail; message: string }>(
                `/api/courses/${id}`,
                courseData
            );

            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string; errors?: string[] }>;

            if (axiosError.response?.status === 404) {
                throw new Error('Course not found');
            }

            if (axiosError.response?.status === 400) {
                const errors = axiosError.response.data.errors;
                throw new Error(errors ? errors.join(', ') : axiosError.response.data.message);
            }

            throw new Error(
                axiosError.response?.data?.message ||
                'Failed to update course. Please try again later.'
            );
        }
    }

    /**
     * Delete a course (soft delete - Admin only)
     * @param id - Course custom ID
     */
    async deleteCourse(id: string): Promise<void> {
        try {
            await apiClient.delete(`/api/courses/${id}`);
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response?.status === 404) {
                throw new Error('Course not found');
            }

            throw new Error(
                axiosError.response?.data?.message ||
                'Failed to delete course. Please try again later.'
            );
        }
    }

    /**
     * Bulk create courses (Admin only)
     * @param courses - Array of course data
     */
    async bulkCreateCourses(courses: Partial<CourseDetail>[]): Promise<CourseDetail[]> {
        try {
            const response = await apiClient.post<{
                success: boolean;
                data: CourseDetail[];
                count: number;
                message: string;
            }>('/api/courses/bulk', { courses });

            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            throw new Error(
                axiosError.response?.data?.message ||
                'Failed to bulk create courses.'
            );
        }
    }
}

// Export singleton instance
const coursesApi = new CourseAPI();
export default coursesApi;