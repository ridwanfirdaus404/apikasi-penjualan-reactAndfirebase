import React, { useState, useEffect } from 'react';

//import material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useDocument } from 'react-firebase-hooks/firestore'
import { useSnackbar } from 'notistack'
import useStyles from './styles/edit'
import AppPageLoading from '../../../components/AppPageLoading'
function EditProduk({ match }) {
    const classes = useStyles();
    const { firestore, user } = useFirebase();
    const { enqueueSnackbar } = useSnackbar();
    const produkDoc = firestore.doc(`toko/${user.uid}/produk/${match.params.produkId}`)
    const [snapshot, loading] = useDocument(produkDoc)
    const [form, setForm] = useState({
        nama: '',
        sku: '',
        harga: 0,
        stok: 0,
        deskripsi: ''
    })
    const [error, setError] = useState({
        nama: '',
        sku: '',
        harga: '',
        stok: '',
        deskripsi: ''
    });

    const [isSubmitting, setSubmitting] = useState(false);


    useEffect(() => {
        if (snapshot) {
            setForm(currentForm => ({
                ...currentForm,
                ...snapshot.data()
            }));
        }

    }, [snapshot])
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

    const validate = () => {
        const newError = { ...error };
        if (!form.nama) {
            newError.nama = "Nama Produk Wajib Diisi"
        }
        if (!form.harga) {
            newError.harga = "Harga Produk Wajib Diisi"
        }
        if (!form.stok) {
            newError.stok = "Stok Produk Wajib Diisi"
        }
        return newError;
    }
    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();
        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        }
        else {
            setSubmitting(true);
            try {
                await produkDoc.set(form, { merge: true })
                enqueueSnackbar('Data Produk Berhasil Disimpan', { variant: 'success' })
            }
            catch (e) {
                enqueueSnackbar(e.message, { variant: 'error' })

            }
            setSubmitting(false);
        }
    }

    const handleUploadFile = (e) => {
        const file = e.target.files[0];
        if (file.type !== 'image/png' || file.type !== 'image/jpeg') {
            setError(error => ({
                ...error,
                foto: `Tipe File Tidak Didukung ${file.type}`
            }))
        } else if (file.size >= 512000) {
            setError(error => ({
                ...error,
                foto: `Ukuran File Terlalu Besar > 500KB`
            }))
        }
        else {
            const reader = new FileReader();
            reader.onabort = () => {
                setError(error => ({
                    ...error,
                    foto: `Proses Pembacaan File Dibatalkan`
                }))
            }
            reader.onerror = () => {
                setError(error => ({
                    ...error,
                    foto: `Foto File Tidak Dapat Dibaca`
                }))
            }
            reader.onload = () => {

                setError(error => ({
                    ...error,
                    foto: ``
                }))
                try {

                }
                catch (e) {

                }
            }
            reader.readAsDataURL(file);

        }

    }

    if (loading) {
        return <AppPageLoading></AppPageLoading>
    }
    return <div>
        <Typography variant="h5" component="h1">Edit Produk : {form.nama}</Typography>
        <Grid container alignItems="center" justify="center">
            <Grid item xs={12} sm={6}>
                <form id="produk-form" onSubmit={handleSubmit}
                    noValidate>
                    <TextField
                        id="nama"
                        name="nama"
                        label="Nama Produk"
                        margin="normal"
                        fillWidth
                        required
                        value={form.nama}
                        onChange={handleChange}
                        helperText={error.nama}
                        error={error.nama ? true : false}
                        disabled={isSubmitting}
                    ></TextField>
                    <TextField
                        id="sku"
                        name="sku"
                        label="SKU Produk"
                        margin="normal"
                        fillWidth
                        value={form.sku}
                        onChange={handleChange}
                        helperText={error.sku}
                        error={error.sku ? true : false}
                        disabled={isSubmitting}
                    ></TextField>
                    <TextField
                        id="harga"
                        name="harga"
                        label="Harga Produk"
                        margin="normal"
                        required
                        type="number"
                        fillWidth
                        value={form.harga}
                        onChange={handleChange}
                        helperText={error.harga}
                        error={error.harga ? true : false}
                        disabled={isSubmitting}
                    ></TextField>
                    <TextField
                        id="stok"
                        name="stok"
                        required
                        label="Stok Produk"
                        margin="normal"
                        type="number"
                        fillWidth
                        value={form.stok}
                        onChange={handleChange}
                        helperText={error.stok}
                        error={error.stok ? true : false}
                        disabled={isSubmitting}
                    ></TextField>
                    <TextField
                        id="deskripsi"
                        name="deskripsi"
                        label="Deskripsi Produk"
                        margin="normal"
                        multiline
                        rowsMax={3}
                        fillWidth
                        value={form.deskripsi}
                        onChange={handleChange}
                        helperText={error.deskripsi}
                        error={error.deskripsi ? true : false}
                        disabled={isSubmitting}
                    ></TextField>
                </form>
            </Grid>
            <Grid item xs={12} sm={6}>
                <div className={classes.uploadFotoProduk}>
                    <input
                        className={classes.hideInputFile}
                        type="file"
                        id="upload-foto-produk"
                        accept="image/jpeg,image/png"
                        onChange={handleUploadFile}
                    />
                    <label htmlFor="upload-foto-produk">
                        <Button
                            variant="outlined"
                            component="span"
                        >
                            Upload Foto Produk
                    </Button>
                    </label>
                    {error.foto &&
                        <Typography color="error">{error.foto}
                        </Typography>}
                </div>
            </Grid>
            <Grid item xs={12}>
                <Button color="primary"
                    disabled={isSubmitting}
                    form="produk-form"
                    type="submit"
                    variant="contained"
                >Simpan</Button>
            </Grid>
        </Grid>
    </div>
}

export default EditProduk;