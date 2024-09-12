import { DtoNewStudent, Student } from "@/@core/types";
import { PROGRAM } from './../@core/types';

export const useStudentStore = defineStore('student', () => {

  const studentsList = ref<Student[]>()
  const currentEmail = ref(null)
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
      console.log(loading.value);

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
    return await useApi(`/user/delete`).delete(email)
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
  async function getPendingStudents() {
    return await useApi(`/user/pending-students`).get();
  }

  //👉 - Set Current Email
  function setCurrentStudentEmail(email: string) {
    currentEmail.value = email
  }

  //👉 - Set Current Email
  function getCurrentStudentEmail() {
    return currentEmail.value
  }


  return { studentsList, currentStudent, currentEmail, loading, error, updateOne, approvingStudentRegistration, banStudentRegistration, declineStudentRegistration, getPendingStudents, deleteUserByEmail, getAllStudents, addOne, getStudentByCode, getStudentsByProgram, getStudentByEmail, setCurrentStudentEmail, getCurrentStudentEmail }
})
