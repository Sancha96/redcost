import React from 'react';
import ListActors from './pages/ListActors';
import Actor from './pages/Actor';
import { Route, Switch } from 'react-router-dom';



const PageWrapper = props => {
    const children = React.Children.map(props.children, function (child) {
        return React.cloneElement(child, {...props})
    });

    return (
        <div className={`page-wrapper`}>
            {children}
        </div>
    )
};

const App = (props) => {
    return (
        <PageWrapper {...props}>
            <Switch>
                <Route exact path="/" component={ListActors} />
                <Route exact path='/:number' component={Actor}/>
            </Switch>
        </PageWrapper>
    )
};

export default App