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
        // isloggedin : this.props.isloggedIn
        // if islogin true => initial = true
        // false => false
        this.state = {
            initial : true // Asyncstorage.getItem('isLoggedIn')
        }
    }
    render() {
        return(
            <Router>
                <Stack key="root">
                    {/* scene login initial={this.state.initial} */}
                    {/* scene main detail */}
                    {/* scene register */}
                    <Scene key="main" component={Main} initial={this.state.initial} hideNavBar={true} />
                </Stack>
            </Router>
        )
    }
}
