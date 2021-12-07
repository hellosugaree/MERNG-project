import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useForm } from '../../utilities/hooks';
import { LOGIN_USER } from '../../gql/gql';
import { AuthContext } from '../../context/auth';
import { ModalContext } from '../../context/modal';
import { Form } from 'semantic-ui-react';
import FormError from '../FormError';

const LoginForm = props => {

  const context = useContext(AuthContext);
  const { closeModal } = useContext(ModalContext);
  const { setValues, handleChange, onSubmit, handleFormErrors, values, errors } = useForm(loginUserCallback, {username: '', password: ''});

  const [loginSuccess, setLoginSuccess] = useState(false);

  const [login, { loading }] = useMutation(LOGIN_USER, {
    update(_, result){
      context.login(result.data.login);
      setLoginSuccess(true);
      setValues({username: '', password: ''});

      setTimeout(() => closeModal(), 2000);

      if (props.noRedirect) {
        return null;
      }
      props.history.push('/');
    },
    onError(err) {
      handleFormErrors(err);
    }
  });

  function loginUserCallback() {
    login({variables: values});
  }

  return (
    <div  style={{...props.style}}>
      <Form error={ errors ? true : false } onSubmit={onSubmit} className={loading ? 'loading' : ''}>
        <Form.Input 
          required 
          label='Username' 
          placeholder='Username' 
          type="text"
          name='username'
          autoComplete='username'
          value={values.username}
          onChange={handleChange}
          error={errors.errorFields && errors.errorFields.username}
        />
        <Form.Input required label='Password' placeholder='Password' 
          type="password"
          name='password'
          autoComplete='current-password'
          value={values.password}
          onChange={handleChange}
          error={errors.errorFields && errors.errorFields.password}
        />
        {Object.keys(errors).length > 0 && (<FormError errors={errors.errorMessages} />)}
        <Form.Button 
          fluid 
          color='teal' 
          type="submit" 
          style={{fontSize: 20, padding: 10}}
        >
          Log in
        </Form.Button>
        <div style={{display: loginSuccess ? '' : 'none', border: '1px solid lightgrey', padding: 10, fontSize: '16px', marginBottom: 20}}>
          You have successfully logged in
        </div>
      </Form>
    </div>
  );
};

export default withRouter(LoginForm);