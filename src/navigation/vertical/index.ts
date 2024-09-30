
import type { VerticalNavItems } from '@layouts/types'
import home from './home'
import payments from './payments'
import student_menu from './student_menu'
import students from './students'
import users from './users'

export default [...home, ...payments, ...students, ...users, ...student_menu] as VerticalNavItems
