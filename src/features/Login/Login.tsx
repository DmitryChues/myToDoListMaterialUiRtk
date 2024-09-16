import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useAppDispatch } from 'app/store'
import { useFormik } from 'formik'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { loginTC, selectIsLoggedIn } from './authSlice'

export type LoginData = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: boolean
}

type Error = {
  email?: string
  password?: string
}

export const Login = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: (values) => {
      const errors: Error = {}
      if (!values.email) {
        errors.email = 'Required'
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = 'Invalid email address'
      }
      if (!values.password) {
        errors.password = 'Required'
      } else if (values.password.length < 6) {
        errors.password = 'Must be 6 characters or more'
      }
      return errors
    },
    onSubmit: (values) => {
      //formik.resetForm()
      dispatch(loginTC(values))
    },
  })

  if (isLoggedIn) {
    return <Navigate to={'/todolists'} />
  }

  return (
    <Grid
      container
      justifyContent={'center'}
    >
      <Grid
        item
        justifyContent={'center'}
      >
        <FormControl>
          <FormLabel>
            <p>
              To log in get registered{' '}
              <a
                href={'https://social-network.samuraijs.com/'}
                target={'_blank'}
                rel='noreferrer'
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
          <form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <TextField
                label={(formik.touched.email && formik.errors.email) || 'Email'}
                margin='normal'
                error={formik.touched.email && !!formik.errors.email}
                //name='email'
                //value={formik.values.email}
                //onBlur={formik.handleBlur}
                //onChange={formik.handleChange}
                {...formik.getFieldProps('email')}
              />
              <TextField
                type='password'
                label={
                  (formik.touched.password && formik.errors.password) ||
                  'Password'
                }
                margin='normal'
                error={formik.touched.password && !!formik.errors.password}
                //name='password'
                //value={formik.values.password}
                //onBlur={formik.handleBlur}
                //onChange={formik.handleChange}
                {...formik.getFieldProps('password')}
              />
              <FormControlLabel
                label={'Remember me'}
                control={
                  <Checkbox
                    //name='rememberMe'
                    //value={formik.values.rememberMe}
                    //onChange={formik.handleChange}
                    checked={formik.values.rememberMe}
                    {...formik.getFieldProps('rememberMe')}
                  />
                }
              />
              <Button
                type={'submit'}
                variant={'contained'}
                color={'primary'}
              >
                Sign in
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid>
  )
}
