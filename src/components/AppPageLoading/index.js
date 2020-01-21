import React from 'react';

//material-ui
import CircularProgress from '@material-ui/core/CircularProgress';

import useStyle from './style';

function AppPageLoading() {
    const classes = useStyle();
    return (
        <div className={classes.loadingBox}>
            <CircularProgress></CircularProgress>
        </div>

    )
}

export default AppPageLoading;