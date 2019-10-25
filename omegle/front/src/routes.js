import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import Main from './pages/main/'
import Text from './pages/text/'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Main}/>
            <Route exact path='/text' component={Text}/>

        </Switch>
    
    </BrowserRouter>
)

export default Routes