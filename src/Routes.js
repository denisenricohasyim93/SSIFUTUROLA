import React from 'react';
import {
    Stack,
    Scene,
    Router
} from 'react-native-router-flux';
import Main from "./containers/Main";

export default class Routes extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <Router>
                <Stack key="root">
                    <Scene key="main" component={Main} initial={true} hideNavBar={true} />
                </Stack>
            </Router>
        )
    }
}
