import { apiClient } from './api';

export const courseService = {
  getAllCourses: async (level = null) => {
    const params = level ? { level } : {};
    const response = await apiClient.get('/courses', { params });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  }
};