import React, { useState } from 'react';

//import floating button  material ui
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';


//page component
import AddDialog from './add'
import useStyles from './styles/grid';
function GridProduk() {

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const classes = useStyles();


    return <><h1>Halaman Grid Produk</h1>
        <Fab
            className={classes.fab}
            color="primary"
            onClick={(e) => {
                setOpenAddDialog(true);
            }}
        >

            <AddIcon />
        </Fab>
        <AddDialog
            open={openAddDialog}
            handleClose={() => {
                setOpenAddDialog(false)
            }}
        />
    </>
}

export default GridProduk;