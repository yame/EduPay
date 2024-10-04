import { Rule } from '@/plugins/casl/ability';
import axios from 'axios';
import { ChangePWDTO, DtoNewStudent, EduPayUser } from './../@core/types';

interface Credentials {
  email: string,
  password: string
}



export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<EduPayUser>()
  const userAbilityRules = ref<Rule[]>()
  const loading = ref(false)
  const error = ref('')
  const accessToken = ref<string | null>(null)
  const ws_state = ref<string | null>(null)



  //👉 - Get All Student 
  async function login(credentials: Credentials) {
    loading.value = true;
    let response;
    try {
      response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login?username=${credentials.email}&password=${credentials.password}`)

      //👉 - Set TokenAccess
      setToken(response.data.access_token)

      //👉 - Set CurrentUser
      const { access_token, ...userData } = response.data
      setCurrentUser(userData)

      //👉 - Set UserAbilityRules
      if (userData.roles.includes('ADMIN'))
        setUserAbilityRules([
          { action: "manage", subject: "all" },
          { action: "manage", subject: "ADMIN" },
          { action: "manage", subject: "STUDENT" },
        ])
      else if (userData.roles.includes("STUDENT"))
        setUserAbilityRules([
          { action: "manage", subject: "STUDENT" },
        ])
      else
        setUserAbilityRules([])


      return response.data

    } catch (err) {
      if (axios.isAxiosError(err)) {
        //👉 -  Handle AxiosError and display backend error message
        console.error('AxiosError: ', err.response?.data || 'An error occurred.');
        error.value = err.response?.data
      } else {
        //❗ -  Handle non-Axios errors
        console.error('Error: ', err.message);
      }
    }
    finally {
      loading.value = false;
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
    return await useApi('/user/register').post(payload)
  }


  //👉 - Get All Student 
  async function logout() {
    try {
      return await useApi('/auth/logout').post()
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
    return await useApi(`/user/change-pw`).put(changePWDTO);
  }


  //👉 - Set CurrentUser
  function setCurrentUser(currUser) {
    if (currUser) {
      const { roles, ...userWithoutRoles } = currUser;
      userWithoutRoles.role = isAdmin(roles);
      currentUser.value = userWithoutRoles;
    } else {
      currentUser.value = undefined;
    }
  }

  //👉 - Set AccessToken
  function setToken(token: string | null) {
    accessToken.value = token
  }

  //👉 - Set UserAbilityRules
  function setUserAbilityRules(newUserAbilityRules) {
    userAbilityRules.value = newUserAbilityRules;
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

  //👉 - Toggle Account Status
  async function toogleAccountStatus(email: string) {
    return await useApi('/toggle-account-status?email=' + email).put()
  }

  return {
    currentUser, ws_state, loading, error, accessToken, userAbilityRules, register, setUserAbilityRules, setCurrentUser, setToken, login, logout, getCurrentUser, resetPasswordToDefault, changePassword, approveRegistration, declineRegistration, banRegistration, toogleAccountStatus
  }
}, {
  persist: true
})
