import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from 'formik';
import styled from 'styled-components';
import axios from 'axios';
import * as Yup from 'yup';

const OnboardForm = props => {

    const Input = styled.input`
        display: block;
        width: 100%;
        height: 20px;
        border-radius: 5px;
        padding: 5px 2px;
        border: ${props => props.border || 'none'}
    `

    const Labels = styled.label`{
        display: block;
    }`

    const Terms = styled.label`{
        display: block;
        font-size: 12px;
        margin-top: 1px;
    }`

    const Button = styled.button`{
        display: block;
        margin-top: 5px;
        font-size: 10px;
        padding: 10px;
        text-align: center;
        color: #fff;
        background: #000;
    }`

    const [users, setUsers] = useState([]);

    useEffect(() => {
        if(props.status) {
            setUsers([...users, props.status])
        }
    }, [props.status])

    return (
        <div className='form-wrapper'>
            <Form className='form'>
                <Labels htmlFor='name'>Name</Labels>
                <Field component={Input} type='name' name='name' placeholder='Name' border={props.errors.name && '1.5px solid red'}/>
                {props.touched.name && props.errors.name && (
                    <Terms>{props.errors.name}</Terms>
                )}
                <Labels htmlFor='name'>Email</Labels>
                <Field component={Input} type='email' name='email' placeholder='example@test.com'/>
                {props.touched.email && props.errors.email && (
                    <Terms>{props.errors.email}</Terms>
                )}
                <Labels htmlFor='name'>Password</Labels>
                <Field component={Input} type='password' name='password'/>
                {props.touched.password && props.errors.password && (
                    <Terms>{props.errors.password}</Terms>
                )}
                <Terms>
                    <Field type='checkbox' name='terms' />
                    I have read and agree with the Terms of Service
                    {props.touched.terms && props.errors.terms && (
                        <p>{props.errors.terms}</p>
                    )}
                </Terms><br/>
                <Button type='submit'>Submit</Button>
            </Form>
            {users.map(user => (
                <ul key={user.id}>
                    <li>{props.status.name}</li>
                </ul>
            ))}
        </div>
    )
}

const myMapPropsToValues = (props) => {
    const returnObj = {
        name: props.name || '',
        email: props.email || '',
        password: props.password || '',
        terms: props.terms || false
    } 

    return returnObj;
}

const myHandleSubmit = (values, { setStatus }) => {
    console.log('You have pressed submit');
    axios
        .post('https://reqres.in/api/users', values)
        .then(res => {
            console.log(res);
            setStatus(res.data)
        })
        .catch(err => {
            console.log(err);
        })
}

const yupSchema = Yup.object().shape({
    name: Yup.string().required('Name required'),
    email: Yup.string().email('Invalid Email').required('Email required'),
    password: Yup.string().min(5, 'Too Short').required('Password required'),
    terms: Yup.bool().oneOf([true], 'Please agree to the Terms of Service')
})

const formikObj = {
    mapPropsToValues: myMapPropsToValues,
    handleSubmit: myHandleSubmit,
    validationSchema: yupSchema
}

const formikFormHOC = withFormik(formikObj);

const myOnboardForm = formikFormHOC(OnboardForm);

export default myOnboardForm;