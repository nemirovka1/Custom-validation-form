import React, {useCallback, useEffect, useMemo, useState} from 'react'
import './styles/customFormStyles.css'
import { Form, Formik } from 'formik'
import validationSchema from "./validationSchema"
import axios from "axios"
import { isUserAdult } from "../assets/helpers"
import { FormFieldTypes } from "../assets/types"
import {FormField} from "./FormField"

const CustomForm = () => {
    const [cityList, setCityList] = useState([])
    const [doctorSpeciality, setDoctorSpeciality] = useState([])
    const [doctorList, setDoctorList] = useState([])
    const [currentFormSettings, setCurrentFormSettings] = useState([])
    const [availableDoctorList, setAvailableDoctorList] = useState([])
    const [filterSpeciality, setFilterSpeciality] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const [cityResponse, specialityResponse, doctorResponse] = await Promise.all([
                    axios.get('https://run.mocky.io/v3/9fcb58ca-d3dd-424b-873b-dd3c76f000f4'),
                    axios.get('https://run.mocky.io/v3/e8897b19-46a0-4124-8454-0938225ee9ca'),
                    axios.get('https://run.mocky.io/v3/3d1c993c-cd8e-44c3-b1cb-585222859c21')
                ])
                setCityList(cityResponse.data)
                setDoctorSpeciality(specialityResponse.data)
                setFilterSpeciality(specialityResponse.data)
                setDoctorList(doctorResponse.data)
                setAvailableDoctorList(doctorResponse.data)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])


    const initialValues: FormFieldTypes = {
        name: '',
        birthdayDate: null,
        sex: '',
        email: '',
        city: '',
        doctorSpecialty: '',
        doctor: '',
        mobileNumber: '',
    }
    const onHandleSubmit = async (values: FormFieldTypes) => {
        console.log({values})
        return values
    }

    const uniqueCurrentSetting = useMemo(() => Array.from(new Map(currentFormSettings.map((obj) => [obj.name, obj])).values()),[currentFormSettings])

    useEffect(()=> {
        onHandleFilterAvailableDoctor()
    }, [uniqueCurrentSetting])

    const onHandleFilterAvailableDoctor = () => {
        let filteredDoctorList = [...doctorList]
        let filteredSpeciality = [...doctorSpeciality]

        uniqueCurrentSetting.forEach((el) => {
           if (el.name === 'birthdayDate') {
                const checkAge = isUserAdult(el.value)
                filteredDoctorList = checkAge
                    ? filteredDoctorList.filter((el) => !el.isPediatrician)
                    : filteredDoctorList.filter((el) => el.isPediatrician)
            } else if (el.name === 'city') {
                filteredDoctorList = filteredDoctorList.filter((doctor) => el.value.toString() === doctor.cityId.toString())
            } else if (el.name === 'sex') {
                const gender = el.value === 'male' ? 'Male' : 'Female'
                const filteredSpecialities = filteredSpeciality.filter(
                    (speciality) => speciality?.params?.gender === gender || !speciality?.params?.gender
                )
                const filteredSpecialtyIds = filteredSpecialities.map((speciality) => speciality.id)
                filteredDoctorList = filteredDoctorList.filter((doctor) =>
                    filteredSpecialtyIds.includes(doctor.specialityId)
                )
                setFilterSpeciality(filteredSpecialities)
            } else if (el.name === 'doctorSpecialty') {
                filteredDoctorList = filteredDoctorList.filter((doctor) => el.value === doctor.specialityId)
            }
        })
        setAvailableDoctorList(filteredDoctorList)
    }

    const handleCheckDoctorField = (setFieldValue: any , value: string | number) => {
        const selectedDoctor = doctorList.find((doctor) => doctor.id === value)
        if (selectedDoctor) {
            setFieldValue('city', selectedDoctor.cityId)
            setFieldValue('doctorSpecialty', selectedDoctor.specialityId)
        }
   }

    return (
        <div className="form">
            <Formik
                initialValues={initialValues}
                onSubmit={onHandleSubmit}
                validationSchema={validationSchema}
            >
                {({ values, handleChange, handleSubmit, setFieldValue, isSubmitting, errors, touched}: any) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="form-container">
                            <FormField
                                label="Name"
                                placeholder="Kateryna"
                                name="name"
                                type="text"
                                required
                                value={values.name}
                                onChange={handleChange}
                            />
                            <FormField
                                label="Birthday Date"
                                name="birthdayDate"
                                type="date"
                                required
                                value={values.birthdayDate}
                                onChange={(event) => {
                                    setFieldValue('birthdayDate', event.target.value)
                                    setCurrentFormSettings([...currentFormSettings, {name: 'birthdayDate', value: event.target.value}])
                                }}
                            />
                            <label>
                                Sex
                                <select
                                    name="sex"
                                    required
                                    className={touched.city && errors.city ? 'error' : ''}
                                    onChange={(event) => {
                                        setFieldValue('sex', event.target.value)
                                        setCurrentFormSettings([...currentFormSettings, {name: 'sex', value: event.target.value}])
                                    }}
                                >
                                    <option>-Select sex-</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {touched.sex && errors.sex && (
                                    <div className="error-message">{errors.sex}</div>
                                )}
                            </label>
                            <label> City
                                <select
                                    name="city"
                                    value={values.city}
                                    required
                                    className={touched.city && errors.city ? 'error' : ''}
                                    onChange={(event) => {
                                        setFieldValue('city', event.target.value)
                                        setCurrentFormSettings([...currentFormSettings, {name: 'city', value: event.target.value}])
                                    }}
                                >
                                    <option>-Select City-</option>
                                    {cityList.map((el) => (
                                        <option value={el.id}>{el.name}</option>
                                    ))}
                                </select>
                                {touched.city && errors.city && (
                                    <div className="error-message">{errors.city}</div>
                                )}
                            </label>
                            <label> Doctor Specialty
                                <select
                                    name="doctorSpecialty"
                                    value={values.doctorSpecialty}
                                    onChange={(event) => {
                                        setFieldValue('doctorSpecialty', event.target.value)
                                        setCurrentFormSettings([...currentFormSettings, {name: 'doctorSpecialty', value: event.target.value}])
                                    }}>
                                    <option> -Select Doctor Speciality- </option>
                                    {filterSpeciality.map((el) => (
                                        <option value={el.id}>{el.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label> Doctor
                                <select
                                    name="doctor"
                                    value={values.doctor}
                                    required
                                    className={touched.city && errors.city ? 'error' : ''}
                                    onChange={(event) => {
                                        setFieldValue('doctor', event.target.value)
                                        handleCheckDoctorField(setFieldValue, event.target.value)
                                        setCurrentFormSettings([...currentFormSettings, {name: 'doctor', value: event.target.value}])
                                    }}
                                >
                                    <option> - Select Doctor - </option>
                                    {availableDoctorList.map((el) => (
                                        <option value={el.id}>{el.name} {el.surname}</option>
                                    ))}
                                </select>
                                {touched.doctor && errors.doctor && (
                                    <div className="error-message">{errors.doctor}</div>
                                )}
                                {availableDoctorList.length === 0 && <p className="error-message">Not available doctor for this settings</p>}
                            </label>
                            <FormField
                                label="Email"
                                name="email"
                                placeholder="kateryna.nemirovskay@gmail.com"
                                type="email"
                                value={values.email}
                                onChange={handleChange}
                                required
                            />
                            <FormField
                                label="Mobile Number"
                                name="mobileNumber"
                                type="tel"
                                placeholder="066 213 97 52"
                                value={values.mobileNumber}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" className="form-container_btn" disabled={isSubmitting}>
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}


export default CustomForm;

