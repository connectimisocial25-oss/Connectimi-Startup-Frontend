import API from "./api";

/**
 * Project API service wrapper
 */

export const createProject = async (formData) => {
  const response = await API.post("/projects", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getProject = async (projectId) => {
  const response = await API.get(`/projects/${projectId}`);
  return response.data;
};

export const updateProject = async (projectId, projectData) => {
  const response = await API.put(`/projects/${projectId}`, projectData);
  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await API.delete(`/projects/${projectId}`);
  return response.data;
};

export const getUserProjects = async (userId, params = {}) => {
  const response = await API.get(`/projects/user/${userId}`, { params });
  return response.data;
};

const projectApi = {
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getUserProjects,
};

export default projectApi;
