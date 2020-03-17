import React from 'react';

import './styles.css';

export default function DevItem(props) { 

    const { dev } = props; // você deve pegar o nome da propriedade no html

    return (
        <li className="dev-item">
            <header>
            <img src={dev.avatar_url} alt={dev.name} />
            <div className="user-info">
                <strong>{dev.name}</strong>
                <span>{dev.techs.join(', ')}</span>
            </div>
            </header>
            <p>{dev.bio}</p>
            <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
        </li>
    )
}