import React from 'react'
import { createGame } from './fetch-utils';

export default class CreatePage extends React.Component {
    state = {
        name: '',
        avgplayers: 0,
        fun: true,
        category_id: 1,
    }

    handleNameChange = e => {
        this.setState({ name: e.target.value });
    }

    handleCategoryChange = e => {
        this.setState({ category_id: e.target.value });
    }

    handlePlayerChange = e => {
        this.setState({ avgplayers: e.target.value });
    }
    
    handleFunChange = e => {
        this.setState({ Fun: e.target.value });
    }

    handleSubmit = async e => {
        e.preventDefault();

        await createGame({
            name: this.state.name,
            avgplayers: this.state.avgplayers,
            fun: this.state.fun,
            category_id: this.state.category_id
        });

        this.props.history.push('/')
    }

    render() {
        return (
            <div>
                <h2>Create item</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name
                        <input onChange={this.handleNameChange} />
                    </label>
                    <label>
                        Average Players
                        <input type='number' onChange={this.handlePlayerChange} />
                    </label>
                    <label>
                        Fun?
                        <input type='boolean' onChange={this.handleFunChange} />
                    </label>
                    <label>
                        Category
                        <select onChange={this.handleCategoryChange}>
                            <option value="1">FPS</option>
                            <option value="2">Horror</option>
                            <option value="3">Survival</option>
                            <option value="4">Adventure</option>
                        </select>
                    </label>
                    <button>Create!</button>
                </form>
            </div>
        )
    }
}