import React, {Component} from "react";
import photo_dflt from "../../img/user.png";
import FilterActors from "../../components/FilterActors";
import SearchActors from "../../components/SearchActors";
import AddActor from "../../components/AddActor";
import axios from "axios";
import moment from "moment";
import { Link } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';
import functions from "../../functions";
import Loader from "../../components/Loader";
import edit from "../../img/edit.svg";
import remove from "../../img/delete.svg";


import "./ListActors.scss";



const busy_types = {
    1: 'Учусь',
    2: 'Работаю',
    3: 'Учусь и работаю',
    4: 'Полностью свободен'
};
const CardActor = props => {
    const {id, photo, name, dateOfBirth, phone, email, status, place, child, tools,
        languages, freeTime, creativeAchievements, stageExperience, studioExperience, onRemoveActor,
        choreography, eyeСolor, hairColor, growth, weight, size, character, limitations, onClickAvatar} = props;
    let freeTimeArray = [], freeTimeText = '';

    if (freeTime.weekdays_morning || freeTime.weekdays_noon || freeTime.weekdays_evening) {
        if (freeTime.weekdays_morning)
            freeTimeArray.push('утро');

        if (freeTime.weekdays_noon)
            freeTimeArray.push('день');

        if (freeTime.weekdays_evening)
            freeTimeArray.push('вечер');

        freeTimeText = `Будни (${freeTimeArray.join(', ')})`;
    }

    if (freeTime.weekend_morning || freeTime.weekend_noon || freeTime.weekend_evening) {
        if (freeTime.weekend_morning)
            freeTimeArray.push('утро');

        if (freeTime.weekend_noon)
            freeTimeArray.push('день');

        if (freeTime.weekend_evening)
            freeTimeArray.push('вечер');

        freeTimeText = freeTimeText ? freeTimeText + `, выходные (${freeTimeArray.join(', ')})` : `Выходные (${freeTimeArray.join(', ')})`;
    }

    return <div className="card-actor">
        <div className="card-actor__photo"
             style={{background: `url(${photo && photo[0] ? ('"' + photo[0].link + '"') : photo_dflt}) center / cover no-repeat`}}
             onClick={() => photo && photo[0] ? onClickAvatar() : null}
        />
        <div className="card-actor__info">
            <div className="row">
                <div className="key">Ф.И.О.</div>
                <div className="value">{name}</div>
            </div>
            <div className="row">
                <div className="key">Дата рождения</div>
                <div className="value">{dateOfBirth}</div>
            </div>
            <div className="row">
                <div className="key">Контакты</div>
                <div className="value">
                    {phone ? <a className="link" href={`tel:${phone}`}>{phone}</a> : null}
                    {phone && email ? ', ' : ''}
                    {email ? <a className="link" href={`mailto:${email}`}>{email}</a> : null}
                </div>
            </div>
            <div className="row">
                <div className="key">В данный момент</div>
                <div className="value">{status}</div>
            </div>
            <div className="row">
                <div className="key">Место работы / учебы</div>
                <div className="value">{place}</div>
            </div>
            <div className="row">
                <div className="key">Дети</div>
                <div className="value">{child}</div>
            </div>
            <div className="row">
                <div className="key">Музыкальные инструменты</div>
                <div className="value">{tools}</div>
            </div>
            <div className="row">
                <div className="key">Языки</div>
                <div className="value">{languages}</div>
            </div>
            <div className="row">
                <div className="key">Наличие свободного времени</div>
                <div className="value">{freeTimeText}</div>
            </div>
            <div className="row">
                <div className="key">Творческие достижения</div>
                <div className="value">{creativeAchievements}</div>
            </div>
            <div className="row">
                <div className="key">Опыт работы на сцене</div>
                <div className="value">{stageExperience}</div>
            </div>
            <div className="row">
                <div className="key">Опыт студийной работы</div>
                <div className="value">{studioExperience}</div>
            </div>
            <div className="row">
                <div className="key">Хореография</div>
                <div className="value">{choreography}</div>
            </div>
            <div className="row">
                <div className="key">Цвет глаз</div>
                <div className="value">{eyeСolor}</div>
            </div>
            <div className="row">
                <div className="key">Цвет волос</div>
                <div className="value">{hairColor}</div>
            </div>
            <div className="row">
                <div className="key">Рост</div>
                <div className="value">{growth}</div>
            </div>
            <div className="row">
                <div className="key">Вес</div>
                <div className="value">{weight}</div>
            </div>
            <div className="row">
                <div className="key">Объем груди/талии/бёдер</div>
                <div className="value">{size}</div>
            </div>
            <div className="row">
                <div className="key">Характер. Ваши достоинства</div>
                <div className="value">{character}</div>
            </div>
            <div className="row">
                <div className="key">Ваши недостатки</div>
                <div className="value">{limitations}</div>
            </div>
            <Link to={`/${id}`} id="edit_actors">
                <img src={edit} alt="" />
            </Link>
            <a className="link" onClick={() => onRemoveActor()} id="remove_actor">
                <img src={remove} alt="" />
            </a>
        </div>
    </div>
};

class ListActors extends Component {
    constructor(props) {
        super(props);

        this.photos = {};
        this.filter = {};
        this.state = {
            actors: [],
            loader: true,
            isOpenLightbox: false,
            photoIndex: 0,
            actor_id: undefined
        }
    }

    componentDidMount() {
        axios.get(`${functions.getHref()}photo`, functions.getAxiosHeaders())
            .then(response => {
                if (response.status === 200) {
                    response.data.map(photo => {
                        if (!this.photos[photo.actor_id])
                            this.photos[photo.actor_id] = [];

                        this.photos[photo.actor_id].push(photo);
                    });
                    this.getData();
                }
            })
            .catch(() => {
                alert('Произошла ошибка');
            })

    }

    getData(search = '') {
        this.setState({loader: true});
        this.filter.text_filter = search;

        const params = [];
        Object.keys(this.filter).map(key => {
            if (key === 'eye_color' || key === 'hair_color' || key === 'languages' || key === 'musical_instruments')
                this.filter[key].map(item => params.push(`${key}=${item}`));
            else
                params.push(`${key}=${this.filter[key]}`)
        });

        axios.get(`${functions.getHref()}actors?${params.join('&')}`, functions.getAxiosHeaders())
            .then(response => {
                if (response.status === 200) {
                    response.data.map(actor => {
                        let dateOfBirth = moment(actor.birth_date).format('DD.MM.YYYY');
                        if (dateOfBirth.indexOf('01.01.0001') !== -1 || dateOfBirth.indexOf('01.01.1970') !== -1)
                            dateOfBirth = '';

                        actor.birth_date = dateOfBirth;
                        actor.size = [actor.breast_volume, actor.waist, actor.hips];
                        actor.size = actor.size.join('/');
                        actor.photos = this.photos[actor.id]
                    });

                    this.setState({actors: response.data, loader: false})
                }
            })
            .catch(() => {
                alert('Произошла ошибка');
                this.setState({loader: false})
            })
    }

    onRemoveActor(id) {
        const {actors} = this.state;
        const isSure = window.confirm('Вы уверены, что хотите удалить выбранного актёра?');

        if (isSure) {
            axios.delete(`${functions.getHref()}actors/${id}`, functions.getAxiosHeaders())
                .then(response => {
                    if (response.status === 200) {
                        const actor = actors.find(actor => Number(actor.id) === Number(id));

                        actors.splice(actors.indexOf(actor), 1);

                        this.setState(actors);
                    }
                })
        }
    }

    render() {
        const {actors, loader, isOpenLightbox, photoIndex, actor_id} = this.state;
        const img_links = actor_id && this.photos[actor_id] ? this.photos[actor_id].map(photo => photo.link) : [];

        return (
            <div className="page actors">
                <div className="list-actors">
                    <SearchActors onChangeSearch={search => this.getData(search)} />
                    { loader ? <Loader/> : null }
                    {
                        actors.map((actor, key) => {
                            return <CardActor
                                id={actor.id}
                                key={key}
                                photo={actor.photos}
                                name={actor.fio}
                                dateOfBirth={actor.birth_date}
                                phone={actor.phone}
                                email={actor.email}
                                status={busy_types[actor.busy_type_id]}
                                place={actor.busy_place}
                                child={actor.children}
                                tools={actor.musical_instruments.join(', ')}
                                languages={actor.languages.join(', ')}
                                freeTime={actor.free_time}
                                creativeAchievements={actor.creation}
                                stageExperience={actor.scene}
                                studioExperience={actor.studio}
                                choreography={actor.choreography}
                                eyeСolor={actor.eye_color.join(', ')}
                                hairColor={actor.hair_color}
                                growth={actor.height}
                                weight={actor.weight}
                                size={actor.size}
                                character={actor.character}
                                limitations={actor.disadvantages}
                                onClickAvatar={() =>
                                    this.setState({isOpenLightbox: true, photoIndex: 0, actor_id: actor.id})}
                                onRemoveActor={() => this.onRemoveActor(actor.id)}
                            />
                        })
                    }
                </div>
                <FilterActors onFilterData={filter => {
                    this.filter = filter;
                    this.getData()
                }} />

                {isOpenLightbox && (
                    <Lightbox
                        mainSrc={img_links[photoIndex]}
                        nextSrc={img_links[(photoIndex + 1) % img_links.length]}
                        prevSrc={img_links[(photoIndex + img_links.length - 1) % img_links.length]}
                        onCloseRequest={() => this.setState({ isOpenLightbox: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + img_links.length - 1) % img_links.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + 1) % img_links.length,
                            })
                        }
                    />
                )}

                <AddActor {...this.props} />
            </div>
        );
    }
}

export default ListActors