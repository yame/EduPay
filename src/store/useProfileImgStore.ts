import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfileImgStore = defineStore('profileImg', () => {
  const profileImgUrl = ref<string | null>(null); // Initialize with null for better type safety

  async function getProfilePicture(email: string) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/profile-picture?email=${email}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${useCookie('accessToken').value}`,
        },
      });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'images/png' }))
      profileImgUrl.value = url; // Update profileImgUrl with the fetched data
      return response; // Return the response for further use if needed
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      throw error; // Re-throw the error for handling in the component
    }
  }

  async function updateProfilePicture(email: string, file: File) {
    console.log('Updating profile picture for:', email);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('photo', file);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/user/${email}/update-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${useCookie('accessToken').value}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      // Optionally update profileImgUrl with the new image URL if returned by the API
      profileImgUrl.value = response.data; // Assuming the API returns the new image URL
      return response;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error; // Re-throw the error for handling in the component
    }
  }

  return {
    profileImgUrl,
    getProfilePicture,
    updateProfilePicture,
  };
});
