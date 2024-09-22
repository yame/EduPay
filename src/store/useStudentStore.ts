import { DtoNewStudent, Student } from "@/@core/types";
import axios from 'axios';
import { PROGRAM } from './../@core/types';

export const useStudentStore = defineStore('student', () => {

  const studentsList = ref<Student[]>()
  const pendingStudents = ref<Student[]>()
  const currentEmail = ref('')
  const currentStudent = ref<Student>()
  const loading = ref(true)
  const error = ref('')

  //👉 - Get All Student 
  async function getAllStudents(currentPage?: Number, itemsPerPage?: Number, programId?: string, code?: string, lastName?: string, firstName?: string) {
    try {
      const { data, error: hasError, isFetching } = await useApi(createUrl('/user/student', {
        query: {
          page: (currentPage - 1),
          size: itemsPerPage,
          programID: programId,
          code: code,
          lastName: lastName,
          firstName: firstName
        }
      })
      )
      studentsList.value = data.value as Student[]
      loading.value = isFetching.value

      error.value = hasError.value
    } catch (error) {
      console.log(error)
    }
  }

  //👉 - Add Student 
  async function addOne(newStudent: DtoNewStudent) {
    return await useApi('/user/student/new').post(newStudent)
  }

  //👉 - Update Student
  async function updateOne(newStudent: DtoNewStudent) {
    return await useApi('/user/student/update').put(newStudent)
  }

  //👉 - Find all students by program
  async function getStudentsByProgram(program: PROGRAM) {
    try {
      const { data, error: hasError, isFetching } = await useApi(`/user/student/program/${program}`)
      studentsList.value = data.value as Student[]
      loading.value = isFetching.value
      error.value = hasError.value
    } catch (error) {
      console.log(error)
    }
  }

  //👉 - Find student by his code
  async function getStudentByCode(code: string) {
    try {
      const { data, error: hasError, isFetching } = await useApi(`/user/student/code/${code}`)
      currentStudent.value = data.value as Student
      loading.value = isFetching.value
      error.value = hasError.value
    } catch (error) {
      console.log(error)
    }
  }

  //👉 - Get student by his email
  async function getStudentByEmail(email: string) {
    try {
      const { data, error: hasError, isFetching } = await useApi(`/user/student/email/${email}`)
      currentStudent.value = data.value as Student
      loading.value = isFetching.value
      error.value = hasError.value
    } catch (error) {
      console.log(error)
    }
  }

  //👉 - Delete student by his Email
  async function deleteUserByEmail(email: string) {
    return await useApi(`/user/delete?email=${email}`).delete()
  }

  //👉 - Ban student registration
  async function banStudentRegistration(email: string) {
    return await useApi(`/user/ban`).post(email)
  }

  //👉 - Approvig student registration
  async function approvingStudentRegistration(email: string) {
    return await useApi(`/user/approve`).post(email)
  }

  //👉 - Decline student registration
  async function declineStudentRegistration(email: string) {
    return await useApi(`/user/approve`).post(email)
  }

  //👉 - Get List student pending
  async function getPendingStudents(currentPage?: Number, itemsPerPage?: Number, email?: String) {
    try {
      const { data, error: hasError, isFetching } = await useApi(createUrl('/user/pending-students', {
        query: {
          page: (currentPage - 1),
          size: itemsPerPage,
          email: email
          // programID: programId,
          // code: code,
          // lastName: lastName,
          // firstName: firstName
        }
      })
      )
      pendingStudents.value = data.value as Student[]
      loading.value = isFetching.value

      error.value = hasError.value
    } catch (error) {
      console.log(error)
    }
  }


  //👉 - Get List student pending by email
  async function getPendingStudentsByEmail(email: string) {
    return await useApi(`/user/pending-student/${email}`).get();
  }


  //👉 - Load Students From Excel
  async function uploadStudentFile(file: File) {
    console.log(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/students/load-from-excel`, formData, {
        headers: {
          Authorization: `Bearer ${useCookie('accessToken').value}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;

    } catch (error) {
      console.error('Error uploading file:');

      if (error.response && error.response.data) {
        console.log(error);
        console.warn(error.response);

        const errorMessage = error.response.data.message
        if (!errorMessage)
          throw error.response.data
        else
          throw errorMessage
      } else {
        console.error('Error message:', error.message);
      }
    }
  }






  //👉 - Set Current Email
  function setCurrentStudentEmail(email: string) {
    console.log(currentEmail.value);

    currentEmail.value = email
  }

  //👉 - Set Current Email
  function getCurrentStudentEmail() {
    console.log(currentEmail.value);

    return currentEmail.value
  }




  //👉 - Toggle Account 
  async function toggleEnableUserAccount(email: string) {
    return await useApi('/user/toggle-account-status?email=' + email).patch()
  }


  return { studentsList, currentStudent, currentEmail, loading, error, pendingStudents, updateOne, approvingStudentRegistration, banStudentRegistration, declineStudentRegistration, getPendingStudents, deleteUserByEmail, getAllStudents, addOne, getStudentByCode, getStudentsByProgram, getStudentByEmail, setCurrentStudentEmail, getCurrentStudentEmail, toggleEnableUserAccount, getPendingStudentsByEmail, uploadStudentFile }
})
