
import type { VerticalNavItems } from '@layouts/types'
import admins from './admins'
import home from './home'
import payments from './payments'
import student_menu from './student_menu'
import students from './students'
import users from './users'

export default [...home, ...payments, ...admins, ...students, ...users, ...student_menu] as VerticalNavItems
