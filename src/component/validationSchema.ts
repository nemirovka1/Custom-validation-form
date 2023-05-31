import * as Yup from 'yup'
export default Yup.object().shape({
    name: Yup.string().matches(/^[^0-9]*$/, 'Numbers are not allowed').required('Name is required'),
    birthdayDate: Yup.string().required('Birthday Date is required'),
    sex:Yup.string().required('Sex is required'),
    city:Yup.string().required('City is required'),
    doctorSpecialty:Yup.string(),
    doctor:Yup.string().required('Doctor is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobileNumber:Yup.string().matches(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/, 'Phone number is not valid').min(10, 'Min 10').max(10, 'Max 10').required('Mobile phone is required'),
})
