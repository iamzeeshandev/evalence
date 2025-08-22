import { GFilterPagination, GPagination } from "@/types/common/params-types";

export interface GetUserRequest extends GFilterPagination {
  hospitalId?: number;
}

export interface UserResponse {
  users: User[];
  meta: GPagination;
}

export interface User {
  id: number;
  userName: string;
  userRole: UserRole;
  email: string;
  phoneNumber: string;
  displayName: string;
  password: string;
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  isActive: boolean;
  emailConfirmed: boolean;
  isFirstLogin: boolean;
  isNotificationEnabled: boolean;
  photoBase64: string;
  photoThumbnailPath: string;
  organizationName: string;
  isLoggedIn: boolean;
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  createdOn: string;
  mPin: number;
  roleId: number | null;
  isProfileRemoved: boolean;
  isAssociated: boolean;
  roleResponseDto: RoleResponseDto;
}

export interface RoleResponseDto {
  id: number;
  name: string;
}

export interface SingleUser {
  firstName: string;
  lastName: string;
  isActive: boolean;
  isFirstLogin: boolean;
  streetAddress: any;
  city: any;
  state: any;
  zipcode: any;
  isNotificationEnabled: boolean;
  photoBase64: any;
  photoThumbnailPath: string;
  lat: any;
  long: any;
  createdOn: string;
  isLoggedIn: any;
  mPin: number;
  isForceLoggedOut: boolean;
  userTypeId: number;
  claims: any;
  logins: any;
  tokens: any;
  userRoles: UserRole[];
  doctorSalutations: any[];
  doctorHospitals: any;
  userHospitals: any;
  loginLogs: any;
  userOrganizations: any[];
  organizationDoctors: any;
  organizationUsers: any;
  eventCalendarDoctors: any;
  consultForms: any;
  userHospitalTeams: any;
  consultFormTimelines: any;
  userConsultChats: any;
  organizationDBQDoctors: any;
  doctorAvailability: any;
  doctorGlobalSetting: any;
  doctorSpeciality: any;
  doctorAppointment: any;
  organizationDBQPatients: any;
  patientDoctorAppointment: any;
  dbqPatientInvites: any;
  userDeviceTokens: any;
  userUsedPassword: any;
  id: number;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: any;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: any;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface UserRole {
  role: Role;
  userId: number;
  roleId: number;
}

export interface Role {
  userRoles: any[];
  roleClaims: any;
  displayName: string;
  isSystemRole: boolean;
  organizationId: any;
  hospitalId: any;
  userTypeId: number;
  id: number;
  name: string;
  normalizedName: string;
  concurrencyStamp: string;
}

export interface DoctorSalutationResponse {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  isActive?: boolean;
  photoBase64?: string;
  activationUrl?: string;
}

export interface UpdateUserRequest extends CreateUserRequest {
  id: number;
}
