import { ChangePWDTO, DtoNewStudent } from './../@core/types';


import axios from 'axios';

interface Credentials {
  email: string,
  password: string
}


// interface User{
//   email : string,
//   role : string,
//   email : string
//   }

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const loading = ref(false)
  const error = ref('')
  const accessToken = ref(null)

  // Watch for changes and update cookies
  watch(accessToken, (newToken) => {
    useCookie('accessToken').value = newToken;
  });

  watch(currentUser, (newUser) => {
    useCookie('userData').value = newUser;
  });

  //👉 - Get All Student 
  async function login(credentials: Credentials) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login?username=${credentials.email}&password=${credentials.password}`)
      setToken(response.data.access_token)
      return response.data.access_token
    } catch (err) {
      error.value = err?.message
    }
  }

  //👉 - Get All Student 
  async function getCurrentUser() {
    try {
      loading.value = true
      const { data, isFetching, error: isError } = await useApi('/auth/profile')
      setCurrentUser(data.value)
      loading.value = isFetching.value
      error.value = isError.value
      return currentUser.value?.credentials?.claims

    } catch (err) {
      console.log(err);
    }
  }
  //👉 - Register new Student
  async function register(payload: DtoNewStudent) {
    console.log("hi");

    return await useApi('/user/register').post(payload)
  }


  //👉 - Get All Student 
  async function logout() {
    try {

      setCurrentUser(null);
      setToken(null);
      useCookie('accessToken').value = null;
      useCookie('userData').value = null;

      // return await useApi('/auth/logout').post()
    } catch (err) {
      error.value = err?.message;
    }
  }

  //👉 - Reset the password to the default value (123456) 
  async function resetPasswordToDefault(email: string) {
    return await useApi(`/user/${email}/reset-pw`).put();
  }

  //👉 - Change user password
  async function changePassword(changePWDTO: ChangePWDTO) {
    console.log(changePWDTO);

    return await useApi(`/user/change-pw`).put(changePWDTO);
  }


  function setCurrentUser(currUser) {
    currentUser.value = currUser
  }

  function setToken(token) {
    accessToken.value = token
  }

  function getUserData() {
    return currentUser.value
  }

  function getToken() {
    return accessToken.value
  }

  //👉 - Approve Registration
  async function approveRegistration(email: string) {
    return await useApi('/user/approve?email=' + email).post()
  }

  //👉 - Decline Registration
  async function declineRegistration(email: string) {
    return await useApi('/user/decline?email=' + email).post()
  }

  //👉 - Ban Registration
  async function banRegistration(email: string) {
    return await useApi('/user/ban?email=' + email).post()
  }


  return {
    currentUser, loading, error, accessToken, register, setCurrentUser, setToken, login, logout, getUserData, getToken, getCurrentUser, resetPasswordToDefault, changePassword, approveRegistration, declineRegistration, banRegistration
  }
})
