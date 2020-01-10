import React, { useState } from 'react';

//import komponen material ui
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

//import useStyle
import useStyles from './style';

//import react dom
import { Link, Redirect } from 'react-router-dom';

//import validator
import isEmail from 'validator/lib/isEmail';

//import firbsae hook
import { useFirebase } from '../../components/FirebaseProvider';

//import appLoading
import AppLoading from '../../components/Apploading';

function Login(props) {
    const { location } = props;
    const classes = useStyles();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState({
        email: '',
        password: ''
    })

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            ...error,
            [e.target.name]: ''
        })
    }

    const [isSubmitting, setSubmitting] = useState(false);

    const { auth, user, loading } = useFirebase()

    const validate = () => {
        const newError = { ...error };
        if (!form.email) {
            newError.email = 'Email Wajib Diisi';
        }
        else if (!isEmail(form.email)) {
            newError.email = 'Email Tidak Valid';
        }

        if (!form.password) {
            newError.password = 'Password Wajib Diisi';
        }

        return newError;
    }
    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')
        ) {
            setError(findErrors);
        }
        else {
            try {
                setSubmitting(true)
                await
                    auth.signInWithEmailAndPassword(form.email, form.password)
            } catch (e) {
                const newError = {}

                switch (e.code) {
                    case 'auth/user-not-found':
                        newError.email = 'Email tidak terdaftar';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email Tidak Valid';
                        break;
                    case 'auth/wrong-password':
                        newError.password = 'Password Salah';
                        break;
                    case 'auth/user-disabled':
                        newError.email = 'Pengguna di blokir'
                        break;
                    default:
                        newError.email = 'Terjadi Kesalahan Silahkan Coba Lagi'
                        break;
                }

                setError(newError);
                setSubmitting(false);
            }

        }
    }

    if (loading) {
        return <AppLoading />
    }
    if (user) {
        const redirectTo = location.state && location.state.from && location.state.from.pathname ?
            location.state.from.pathname : '/'
        return <Redirect to={redirectTo} />
    }

    console.log(user)
    return (
        <Container maxWidth="xs">
            <Paper
                className={classes.paper}>
                <Typography
                    variant="h5"
                    component="h1"
                    className={classes.title}>Login</Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        margin="normal"
                        label="Alamat Email"
                        fullWidth
                        required
                        value={form.email}
                        onChange={handleChange}
                        helperText={error.email}
                        error={error.email ? true : false}
                        disabled={isSubmitting}
                    > </TextField>
                    <TextField
                        id="password"
                        type="password"
                        name="password"
                        margin="normal"
                        label="Password"
                        fullWidth
                        required
                        value={form.password}
                        onChange={handleChange}
                        helperText={error.password}
                        error={error.password ? true : false}
                        disabled={isSubmitting}
                    > </TextField>
                    <Grid container className={classes.buttons}>
                        <Grid item xs>
                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                color="primary"
                                variant="contained"
                                size="large"
                            >Login</Button>
                        </Grid>
                        <Grid item>
                            <Button
                                disabled={isSubmitting}
                                component={Link}
                                variant="contained"
                                size="large"
                                to="/registrasi"
                            >Daftar</Button>
                        </Grid>
                    </Grid>
                    <div className={classes.forgotPassword}>
                        <Typography component={Link} to="/lupa-password">
                            Lupa Password?
                        </Typography>
                    </div>
                </form>

            </Paper>
        </Container>
    )
}

export default Login;