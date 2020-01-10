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

//import notistack hook
import { useSnackbar } from 'notistack'

function LupaPassword() {
    const classes = useStyles();
    const [form, setForm] = useState({
        email: ''
    });

    const [error, setError] = useState({
        email: ''
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

    const { auth, user, loading } = useFirebase();

    const { enqueueSnackbar } = useSnackbar();

    const validate = () => {
        const newError = { ...error };
        if (!form.email) {
            newError.email = 'Email Wajib Diisi';
        }
        else if (!isEmail(form.email)) {
            newError.email = 'Email Tidak Valid';
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
                const actionCodeSettings = {
                    url: `${window.location.origin}/login`
                }
                await auth.sendPasswordResetEmail(form.email, actionCodeSettings)
                enqueueSnackbar(`Cek Kotak Masuk Email: ${form.email}, sebuah tautan untuk mereset password telah dikirim`, {
                    variant: 'success'
                })
                setSubmitting(false);
            } catch (e) {
                const newError = {}

                switch (e.code) {
                    case 'auth/user-not-found':
                        newError.email = 'Email Tidak Terdaftar';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email Tidak Valid';
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
        return <Redirect to="/" />
    }

    console.log(user)
    return (
        <Container maxWidth="xs">
            <Paper
                className={classes.paper}>
                <Typography
                    variant="h5"
                    component="h1"
                    className={classes.title}>Lupa Password</Typography>
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
                    <Grid container className={classes.buttons}>
                        <Grid item xs>
                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                color="primary"
                                variant="contained"
                                size="large"
                            >Kirim</Button>
                        </Grid>
                        <Grid item>
                            <Button
                                disabled={isSubmitting}
                                component={Link}
                                variant="contained"
                                size="large"
                                to="/login"
                            >Login</Button>
                        </Grid>
                    </Grid>
                </form>

            </Paper>
        </Container>
    )
}

export default LupaPassword;