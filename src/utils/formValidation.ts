import { object, string, type InferType } from 'yup'

export const signInValidation = object({
    email: string().email('Invalid email').required('Field is required'),
    password: string()
        .min(8, 'Must be at least 8 characters')
        .required('Field is required'),
})

export type SchemaSignInValidation = InferType<typeof signInValidation>

export const signUpValidation = object({
    firstName: string().required('First name is required'),
    displayName: string().required('Display name is required'),
    city: string().required('City is required'),
    postcode: string()
        .matches(/^\d{5}$/, 'Invalid postcode format')
        .required('Postcode is required'),
    email: string().email('Invalid email').required('Field is required'),
    password: string()
        .min(8, 'Must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[^A-Z0-9]/i, 'Password must contain at least one special character')
        .required('Field is required'),
})

export type SchemaSignUpValidation = InferType<typeof signUpValidation>

export const forgotPasswordValidation = object({
    email: string().email('Invalid email').required('Field is required'),
})

export type SchemaForgotPasswordValidation = InferType<typeof forgotPasswordValidation>

export const resetPasswordValidation = object({
    password: string()
        .min(8, 'Must be at least 8 characters')
        .required('Field is required'),
})

export type SchemaResetPasswordValidation = InferType<typeof resetPasswordValidation>

export type RegistrationStep = 'personal' | 'location' | 'credentials'
