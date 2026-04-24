import api from "./api";

// Fetch all courses (public)
export const fetchCourses = async () => {
  try {
    const response = await api.get("/courses/all");
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch courses:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Create a new course (Teacher/Admin only)
export const createCourse = async (courseData) => {
  try {
    const response = await api.post("/courses/create", courseData);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to create course:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// (Optional) Get current teacher's courses
export const fetchTeacherCourses = async () => {
  try {
    const response = await api.get("/courses/teacher/mycourses");
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch teacher courses:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// (Optional) Find course by ID
export const findCourseById = async (id) => {
  try {
    const response = await api.post("/courses/find", { id });
    return response.data;
  } catch (error) {
    console.error(
      "Failed to find course:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// (Optional) Update a course
export const updateCourse = async (courseData) => {
  try {
    const response = await api.put("/courses/update", courseData);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to update course:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// (Optional) Delete a course
export const deleteCourse = async (id) => {
  try {
    const response = await api.delete("/courses/delete", { data: { id } });
    return response.data;
  } catch (error) {
    console.error(
      "Failed to delete course:",
      error.response?.data || error.message
    );
    throw error;
  }
};
