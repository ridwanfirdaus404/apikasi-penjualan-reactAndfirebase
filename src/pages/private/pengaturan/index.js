import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Pengguna from "./pengguna";
import Toko from "./toko";

//material-ui
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

//import styles
import useStyles from './styles/style';

function Pengaturan(props) {
    const classes = useStyles();
    const { location, history } = props;
    const handleChangeTab = (event, value) => {
        history.push(value);
    }

    return (
        <Paper square>
            <Tabs
                value={location.pathname}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChangeTab}
            >
                <Tab label="Pengguna" value="/pengaturan/pengguna"></Tab>
                <Tab label="Toko" value="/pengaturan/toko"></Tab>
            </Tabs>
            <div className={classes.tabContent}>
                <Switch>
                    <Route path="/pengaturan/pengguna" component={Pengguna}></Route>
                    <Route path="/pengaturan/toko" component={Toko}></Route>
                    <Redirect to="/pengaturan/pengguna"></Redirect>
                </Switch>
            </div>
        </Paper>

    )
}
export default Pengaturan;