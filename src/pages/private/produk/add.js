import React, { useState } from 'react'

//import material ui
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

import { useFirebase } from '../../../components/FirebaseProvider'
function AddDialog({ history, open, handleClose }) {

    const { firestore, user } = useFirebase();
    const produkCol = firestore.collection(`toko/${user.uid}/produk`)
    const [nama, setNama] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    const handleSimpan = async e => {
        setSubmitting(true);
        try {
            if (!nama) {
                throw new Error('Nama Produk Wajib Diisi')

            }
            const produkBaru = await produkCol.add({ nama });
            history.push(`produk/edit/${produkBaru.id}`)
        }
        catch (e) {
            setError(e.message);
        }
        setSubmitting(false)
    }
    return <Dialog
        disableBackdropClick={isSubmitting}
        disableEscapeKeyDown={isSubmitting}
        open={open}
        onClose={handleClose}
    >
        <DialogTitle>Buat Produk Baru</DialogTitle>
        <DialogContent dividers>
            <TextField
                id="nama"
                label="Nama Produk"
                value={nama}
                onChange={(e) => {
                    setError('')
                    setNama(e.target.value)
                }}
                helperText={error}
                error={error ? true : false}
                disabled={isSubmitting}
            />
        </DialogContent>
        <DialogActions>
            <Button
                disabled={isSubmitting}
                onClick={handleClose}
            >Batal</Button>
            <Button
                color="primary"
                onClick={handleSimpan}
                disabled={isSubmitting}
            >Simpan</Button>
        </DialogActions>
    </Dialog>

}

AddDialog.prototype = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
}

export default withRouter(AddDialog);