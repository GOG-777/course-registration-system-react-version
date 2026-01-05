import { apiClient } from './api';

export const enrollmentService = {
  getMyCourses: async () => {
    const response = await apiClient.get('/enrollments/my-courses');
    return response.data;
  },

  enrollCourse: async (courseId) => {
    const response = await apiClient.post('/enrollments/enroll', { course_id: courseId });
    return response.data;
  },

  dropCourse: async (courseId) => {
    const response = await apiClient.put(`/enrollments/drop/${courseId}`);
    return response.data;
  }
};