import React, {Component} from "react";
import Spinner from 'react-loader-spinner';

export default class Loader extends Component {
    render() {
        return(
            <Spinner
                className="loader"
                type="Oval"
                color="#e90f29"
                height={80}
                width={80}
            />
        );
    }
}