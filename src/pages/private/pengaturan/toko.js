import React, { useState, useEffect } from 'react';


//import material ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

//import style
import useStyles from './styles/toko';
//import validator
import isURL from 'validator/lib/isURL';

//import firebase hook
import { useFirebase } from '../../../components/FirebaseProvider'

import { useDocument } from "react-firebase-hooks/firestore";
import { useSnackbar } from 'notistack';

import AppPageLoading from '../../../components/AppPageLoading';

//import react-router
import { Prompt } from 'react-router-dom';

function Toko() {
    const classes = useStyles();
    const { firestore, user } = useFirebase();
    const tokoDoc = firestore.doc(`toko/${user.uid}`)
    const [snapshot, loading] = useDocument(tokoDoc);
    const { enqueueSnackbar } = useSnackbar();


    const [form, setForm] = useState({
        nama: '',
        alamat: '',
        telp: '',
        website: ''
    });
    const [error, setError] = useState({
        nama: '',
        alamat: '',
        telp: '',
        website: ''
    })

    const [isSubmitting, setSubmitting] = useState(false);
    const [isSomethingChange, setSomethingChange] = useState(false);

    useEffect(() => {
        if (snapshot) {
            setForm(snapshot.data())
        }
    }, [snapshot])

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            [e.target.name]: ''
        })
        setSomethingChange(true);
    }
    const validate = () => {
        const newError = { ...error };

        if (!form.nama) {
            newError.nama = 'Nama Wajib Diisi'
        }
        if (!form.alamat) {
            newError.alamat = 'Alamat Wajib Diisi'
        }
        if (!form.telp) {
            newError.telp = 'Telphone Wajib Diisi'
        }
        if (!form.website) {
            newError.website = 'Website Wajib Diisi'
        } else if (!isURL(form.website)) {
            newError.website = 'Website Tidak Valid'
        }

        return newError;
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const findErrors = validate();
        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        }
        else {
            setSubmitting(true);
            try {

                await tokoDoc.set(form, { merge: true });
                setSomethingChange(false)
                enqueueSnackbar('Data Toko Berhasil Disimpan', { variant: 'success' })
            }
            catch (e) {
                enqueueSnackbar(e.message, { variant: 'error' })
            }
            setSubmitting(false);
        }
    }
    if (loading) {
        return <AppPageLoading></AppPageLoading>
    }
    return <div className={classes.pengaturanToko}>
        <form onSubmit={handleSubmit} noValidate>
            <TextField
                id="nama"
                name="nama"
                label="Nama Toko"
                margin="normal"
                required
                fullWidth
                value={form.nama}
                disabled={isSubmitting}
                onChange={handleChange}
                error={error.nama ? true : false}
                helperText={error.nama}
            />
            <TextField
                id="alamat"
                name="alamat"
                label="Alamat Toko"
                margin="normal"
                required
                multiline
                fullWidth
                rowsMax={3}
                value={form.alamat}
                disabled={isSubmitting}
                onChange={handleChange}
                error={error.alamat ? true : false}
                helperText={error.alamat}
            />
            <TextField
                id="telp"
                name="telp"
                label="No Telphone Toko"
                margin="normal"
                required
                fullWidth
                value={form.telp}
                disabled={isSubmitting}
                onChange={handleChange}
                error={error.telp ? true : false}
                helperText={error.telp}
            />
            <TextField
                id="website"
                name="website"
                label="Website Toko"
                margin="normal"
                required
                fullWidth
                value={form.website}
                disabled={isSubmitting}
                onChange={handleChange}
                error={error.website ? true : false}
                helperText={error.website}
            />
            <Button
                className={classes.actionButton}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || !isSomethingChange}
            >
                Simpan
            </Button>
        </form>
        <Prompt
            when={isSomethingChange}
            message="Terdapat perubahan yang belum disimpan, apakah anda yakin ingin meninggalkan halaman ini?"
        />
    </div>
}

export default Toko;