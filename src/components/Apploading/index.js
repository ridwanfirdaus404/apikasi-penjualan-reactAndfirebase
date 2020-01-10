import React from 'react';

//material-ui
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import useStyle from './style';

function AppLoading() {
    const classes = useStyle();
    return (
        <Container maxWidth='xs'>
            <div className={classes.loadingBox}>
                <Typography
                    variant="h6"
                    component="h2"
                    className={classes.title}
                >
                    Aplikasi Penjualan
                </Typography>
                <LinearProgress></LinearProgress>
            </div>

        </Container>
    )
}

export default AppLoading;