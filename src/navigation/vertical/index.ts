
import type { VerticalNavItems } from '@layouts/types'
import home from './home'
import payments from './payments'
import students from './students'

export default [...home,...payments,...students] as VerticalNavItems
