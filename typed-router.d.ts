/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'unplugin-vue-router/types'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    'root': RouteRecordInfo<'root', '/', Record<never, never>, Record<never, never>>,
    '$error': RouteRecordInfo<'$error', '/:error(.*)', { error: ParamValue<true> }, { error: ParamValue<false> }>,
    'change-password': RouteRecordInfo<'change-password', '/change-password', Record<never, never>, Record<never, never>>,
    'force-change-password': RouteRecordInfo<'force-change-password', '/force-change-password', Record<never, never>, Record<never, never>>,
    'forgot-password': RouteRecordInfo<'forgot-password', '/forgot-password', Record<never, never>, Record<never, never>>,
    'login': RouteRecordInfo<'login', '/login', Record<never, never>, Record<never, never>>,
    'not-authorized': RouteRecordInfo<'not-authorized', '/not-authorized', Record<never, never>, Record<never, never>>,
    'notification': RouteRecordInfo<'notification', '/notification', Record<never, never>, Record<never, never>>,
    'notification-payment-id': RouteRecordInfo<'notification-payment-id', '/notification/payment/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    'notification-registration-email': RouteRecordInfo<'notification-registration-email', '/notification/registration/:email', { email: ParamValue<true> }, { email: ParamValue<false> }>,
    'payment-add': RouteRecordInfo<'payment-add', '/payment/add', Record<never, never>, Record<never, never>>,
    'payment-list': RouteRecordInfo<'payment-list', '/payment/list', Record<never, never>, Record<never, never>>,
    'profile': RouteRecordInfo<'profile', '/profile', Record<never, never>, Record<never, never>>,
    'register': RouteRecordInfo<'register', '/register', Record<never, never>, Record<never, never>>,
    'second-page': RouteRecordInfo<'second-page', '/second-page', Record<never, never>, Record<never, never>>,
    'student-id': RouteRecordInfo<'student-id', '/student/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    'student-add': RouteRecordInfo<'student-add', '/student/add', Record<never, never>, Record<never, never>>,
    'student-details-code': RouteRecordInfo<'student-details-code', '/student/details/:code', { code: ParamValue<true> }, { code: ParamValue<false> }>,
    'student-list': RouteRecordInfo<'student-list', '/student/list', Record<never, never>, Record<never, never>>,
    'student-payments-student': RouteRecordInfo<'student-payments-student', '/student/payments-student', Record<never, never>, Record<never, never>>,
    'user-list-pending': RouteRecordInfo<'user-list-pending', '/user/list-pending', Record<never, never>, Record<never, never>>,
  }
}
