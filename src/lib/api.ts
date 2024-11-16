import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface UserProfile {
  name: string;
  email: string;
  skills_offering: Array<{
    name: string;
    proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  skills_seeking: string[];
  availability: Array<{
    day_of_week: string;
    time_slot: string;
  }>;
}

export interface MatchedUser {
  id: number;
  name: string;
  avatar_url: string;
  rating: number;
  skills_offering: string[];
  skills_seeking: string[];
  matching_availability_slots: number;
}

const api = {
  createUser: async (userData: UserProfile) => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  findMatches: async (userId: number): Promise<MatchedUser[]> => {
    const response = await axios.get(`${API_URL}/users/${userId}/matches`);
    return response.data;
  }
};

export default api;