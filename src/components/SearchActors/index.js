import React, {Component} from "react";

import "./SearchActors.scss";


let t = undefined;

class SearchActors extends Component {
    state = {search: ''};

    onChangeSearch = value => {
        const _this = this;
        _this.setState({search: value});

        if (t) {
            clearTimeout(t);
        }

        t = setTimeout(() => {
            _this.props.onChangeSearch(value)
        }, 1000)
    };

    render() {
        return (
            <form className="search-actors">
                <input className="input-text" placeholder="Поиск" onChange={e => this.onChangeSearch(e.target.value)}/>
                <button
                    className="btn-primary" type="submit"
                    onClick={() => this.props.onChangeSearch(this.state.search)}
                >
                    Искать
                </button>
            </form>
        );
    }
};

export default SearchActors