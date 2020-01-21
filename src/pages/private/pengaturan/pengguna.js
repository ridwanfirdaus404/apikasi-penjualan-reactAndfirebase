import React, { useRef, useState } from 'react';

import { useFirebase } from '../../../components/FirebaseProvider'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import { useSnackbar } from 'notistack';

import isEmail from 'validator/lib/isEmail';

import useStyles from './styles/pengguna';

function Pengguna() {

    const { enqueueSnackbar } = useSnackbar()
    const { user } = useFirebase();
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState({
        displayName: '',
        email: '',
        password: ''
    });
    const displayNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const classes = useStyles();
    const saveDisplayName = async (e) => {
        const displayName = displayNameRef.current.value;

        if (!displayName) {
            setError({
                displayName: 'Nama Wajib Diisi'
            })
        }
        else if (displayName !== user.displayName) {
            setError({
                displayName: ''
            })
            setSubmitting(true);
            await user.updateProfile({
                displayName
            })
            setSubmitting(false);
            enqueueSnackbar('Data berhasil diperbarui', { variant: 'success' })
        }

    }

    const updateEmail = async (e) => {
        const email = emailRef.current.value;
        if (!email) {
            setError({
                email: 'Email Wajib Diisi'
            })
        }
        else if (!isEmail(email)) {
            setError({
                email: 'Email Tidak Valid'
            })
        }
        else if (email !== user.email) {
            setError({
                email: ''
            })
            setSubmitting(true);
            try {
                await user.updateEmail(email);
                enqueueSnackbar('Email Berhasil diperbarui', { variant: 'success' });

            } catch (e) {
                let emailError = '';
                switch (e.code) {
                    case 'auth/email-already-in-use':
                        emailError = ' Email Sudah di gunakan oleh pengguna lain';
                        break;
                    case 'auth/invalid-email':
                        emailError = 'Email Tidak Valid'
                        break;
                    case 'auth/requires-recent-login':
                        emailError = "Silahkan Logout kemudian login kembali untuk memperbarui email"
                        break;
                    default:
                        emailError = "Terjadi kesalahan silahkan coba lagi";
                        break;
                }
                setError({
                    email: emailError
                })

            }
            setSubmitting(false)
        }
    }

    const sendEmailVerifikasi = async (e) => {
        const actionCodeSetting = { url: `${window.location.origin}/login` };

        setSubmitting(true);
        await user.sendEmailVerification(actionCodeSetting);
        enqueueSnackbar(`Email verifikasi telah berhasil dikirim ke ${emailRef.current.value}`, { variant: 'success' });
        setSubmitting(false);

    }
    const updatePassword = async (e) => {
        const password = passwordRef.current.value;
        if (!password) {
            setError({
                password: 'Password Wajib diisi'
            })
        }
        else {
            setError({
                password: ''
            })
            setSubmitting(true);
            try {
                await user.updatePassword(password)

                enqueueSnackbar('Password Berhasil diupdate', { variant: 'success' })
            }
            catch (e) {
                let errorPassword = '';

                switch (e.code) {
                    case 'auth/weak-password':
                        errorPassword = 'Password Terlalu Lemah';
                        break;
                    case 'auth/requires-recent-login':
                        errorPassword = 'Silahkan Logout, Kemudian login kembali untuk memperbarui password';
                        break;
                    default:
                        errorPassword = 'Terjadi kesalahan silahkan coba lagi';
                        break;

                }
                setError({
                    password: errorPassword
                })
            }
            setSubmitting(false)
        }

    }
    return (
        <div className={classes.pengaturanPengguna}>
            <TextField
                id="displayName"
                name="displayName"
                label="Nama"
                inputProps={{
                    ref: displayNameRef,
                    onBlur: saveDisplayName
                }}
                margin="normal"
                defaultValue={user.displayName}
                disabled={isSubmitting}
                helperText={error.displayName}
                error={error.displayName ? true : false}
            />
            <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                margin="normal"
                defaultValue={user.email}
                inputProps={{
                    ref: emailRef,
                    onBlur: updateEmail
                }}
                disabled={isSubmitting}
                helperText={error.email}
                error={error.email ? true : false}
            />
            {
                user.emailVerified ?
                    <Typography variant="subtitle1" color="primary">Email Sudah Terverifikasi</Typography>
                    :
                    <Button
                        variant="outlined"
                        onClick={sendEmailVerifikasi}
                        disabled={isSubmitting}
                    >Kirim Email Verifikasi</Button>
            }
            <TextField
                id="password"
                name="password"
                label="Password Baru"
                type="password"
                margin="normal"
                inputProps={{
                    ref: passwordRef,
                    onBlur: updatePassword
                }}
                autoComplete="new-password"
                disabled={isSubmitting}
                helperText={error.password}
                error={error.password ? true : false}

            >

            </TextField>
        </div>
    )
}

export default Pengguna;