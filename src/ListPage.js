import React from 'react'
import { getAllGames } from './fetch-utils'
import { Link } from 'react-router-dom';
export default class ListPage extends React.Component {
    state = {
        games: []
    }

    componentDidMount = async () => {
        const games = await getAllGames();

        this.setState({ games: games })
    }

    render() {
        return (
            <div className="games">
                {
                    this.state.games.map(game => <Link to={`/games/${game.id}`}>
                    <div className="game">
                        <p>{game.name}</p>
                        <p>{game.avgplayers}</p>
                        <p>{game.fun}</p>
                        <p>{game.category}</p>
                    </div>
                    </Link>)
                }
            </div>
        )
    }
}