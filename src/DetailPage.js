import React from 'react'
import { createGame, getAllCategories, getOneGame, updateGame } from './fetch-funcs';

export default class DetailPage extends React.Component {
    state = {
        name: '',
        avgplayers: 0,
        fun: true,
        category_id: 1,
        categories: []
    }

    componentDidMount = async () => {
        const id = this.props.match.params.id;
        const game = await getOneGame(id);
        const categories = await getAllCategories();
        this.setState({
            name: game.name,
            avgplayers: game.avgplayers,
            fun: game.fun,
            category_id: game.category_id,
            categories: categories
        })
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
        this.setState({ fun: e.target.value });
    }

    handleSubmit = async e => {
        e.preventDefault();

        await updateGame(this.props.match.params.id, {
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
                <h2>Update item</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name
                        <input value={this.state.name} onChange={this.handleNameChange} />
                    </label>
                    <label>
                        Average Players
                        <input
                        value={this.state.avgplayers} type='number' onChange={this.handlePlayerChange} />
                    </label>
                    <label>
                        Fun
                        <input
                        value={this.state.fun} type='boolean' onChange={this.handleFunChange} />
                    </label>
                    <label>
                        Category
                        <select onChange={this.handleCategoryChange}>
                            {this.state.categories.map(category => 
                                <option
                                    selected={category.id === this.state.category_id} 
                                    value={category.id}>
                                    {category.category}
                                </option>)}
                        </select>
                    </label>
                    <button>Update!</button>
                </form>
            </div>
        )
    }
}