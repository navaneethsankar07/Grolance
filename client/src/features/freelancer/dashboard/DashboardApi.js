import axiosInstance from "../../../api/axiosInstance"

export const fetchRecommendedProjects = async()=>{
    const {data} = await axiosInstance.get('/profile/freelancer/recommended-projects/');
    return data;
}

export const fetchTodos = async () => {
    const {data} = await axiosInstance.get('/profile/todos/');
    return data;
}


export const createTodo = async (todoData) => {
    const { data } = await axiosInstance.post('/profile/todos/', todoData);
    return data;
};

export const deleteTodo = async (id) => {
    const { data } = await axiosInstance.delete(`/profile/todos/${id}/`);
    return data;
};

export const completeTodo = async (id) => {
    const { data } = await axiosInstance.post(`/profile/todos/${id}/mark-complete/`);
    return data;
};