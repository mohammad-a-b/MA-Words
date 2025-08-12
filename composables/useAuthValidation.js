import { required, email, minLength, maxLength, helpers } from '@vuelidate/validators'

export const useAuthValidation = () => {
  const getEmailRules = () => ({
    required: helpers.withMessage('ایمیل الزامی است', required),
    email: helpers.withMessage('لطفاً یک ایمیل معتبر وارد کنید', email)
  })

  const getPasswordRules = (isSignup = false) => ({
    required: helpers.withMessage('رمز عبور الزامی است', required),
    minLength: helpers.withMessage(
      isSignup ? 'برای ثبت‌نام، رمز عبور باید حداقل ۸ کاراکتر باشد' : 'رمز عبور باید حداقل ۶ کاراکتر باشد',
      isSignup ? minLength(8) : minLength(6)
    )
  })

  const getCommentRules = () => ({
    name: {
      required: helpers.withMessage('نام الزامی است', required),
      minLength: helpers.withMessage('نام باید حداقل ۲ کاراکتر باشد', minLength(2)),
      maxLength: helpers.withMessage('نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد', maxLength(50))
    },
    email: {
      required: helpers.withMessage('ایمیل الزامی است', required),
      email: helpers.withMessage('لطفاً یک ایمیل معتبر وارد کنید', email)
    },
    content: {
      required: helpers.withMessage('متن نظر الزامی است', required),
      minLength: helpers.withMessage('متن نظر باید حداقل ۱۰ کاراکتر باشد', minLength(10)),
      maxLength: helpers.withMessage('متن نظر نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد', maxLength(1000))
    }
  })

  const getValidationRules = (isSignup = false) => ({
    email: getEmailRules(),
    password: getPasswordRules(isSignup),
    ...(isSignup
      ? {
          confirmPassword: {
            required: helpers.withMessage('تکرار رمز عبور الزامی است', required),
            sameAsPassword: helpers.withMessage(
              'رمز عبور و تکرار آن مطابقت ندارند',
              (value, vm) => value === vm.password
            )
          }
        }
      : {})
  })

  return {
    getEmailRules,
    getPasswordRules,
    getCommentRules,
    getValidationRules
  }
} 