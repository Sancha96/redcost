import React, {Component} from "react";
import axios from "axios";
import functions from "../../functions";
import moment from "moment";
import PhoneInput from "react-phone-number-input";
import TextMask from "react-text-mask";
import emailMask from "text-mask-addons/dist/emailMask";
import Select from "react-select";
import photo_dflt from "../../img/user.png";
import { Link } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';
import DatePicker from "../../components/DatePicker";

import 'react-image-lightbox/style.css';
import "./Actor.scss";



const busy_types = {
    1: 'Учусь',
    2: 'Работаю',
    3: 'Учусь и работаю',
    4: 'Полностью свободен'
};
const customStyles = {
    control: (provided) => ({
        ...provided,
        border: '1px solid #0e0f14',
        borderRadius: 0,
        color: '#0e0f14'
    }),

    indicatorContainer: (provided) => ({
        ...provided,
        color: '#0e0f14'
    }),

    indicatorSeparator: (provided) => ({
        ...provided,
        backgroundColor: '#0e0f14'
    })
};

class Actor extends Component {
    constructor(props) {
        super(props);

        this.onClickSave = this.onClickSave.bind(this);
        this.state = {
            actor_id: props.match.params.number,
            actor: undefined,
            photo: undefined, video: undefined, fio: '',
            dateOfBirth: undefined, phone: '',
            email: '', busy_type: undefined,
            busy_place: '', child: false, tools: [],
            languages: [], creativeAchievements: '',
            stageExperience: false,
            studioExperience: false,
            choreography: false,
            eyeСolor: [],
            hairColor: undefined,
            growth: 0, weight: 0,
            breastVolume: 0, waist: 0,
            hips: 0, character: '', limitations: '',
            child_text: '', studioExperienceText: '',
            stageExperienceText: '', choreographyText: '',
            weekdays: false, weekends: false,
            weekdaysMorning: false, weekdaysNoon: false,
            weekdaysEvening: false, weekendMorning: false,
            weekendNoon: false, weekendEvening: false,
            photoIndex: 0, photos: [], isOpenLightbox: false
        }
    }

    componentDidMount() {
        this.getActor();
        this.getPhotosActor();
    }

    handleFromChange(from) {
        this.setState({ dateOfBirth: from });
    }

    getActor() {
        const {actor_id} = this.state;

        axios.get(`${functions.getHref()}actors/${actor_id}`,functions.getAxiosHeaders())
            .then(response => {
                if (response.status === 200) {
                    const actor = response.data;
                    const birth_date = actor.birth_date.indexOf('0001-01-01') !== -1 ||
                        actor.birth_date.indexOf('1970-01-01') !== -1 || !actor.birth_date ?
                        undefined : moment(actor.birth_date).toDate();
                    const busy_type = actor.busy_type_id ?
                        {value: Number(actor.busy_type_id), label: busy_types[actor.busy_type_id]} : undefined;
                    const tools = actor.musical_instruments.map(inst => ({value: inst, label: inst}));
                    const languages = actor.languages.map(inst => ({value: inst, label: inst}));
                    const eyeСolor = actor.eye_color.map(inst => ({value: inst, label: inst}));
                    const weekdays = !!(actor.free_time.weekdays_morning ||
                        actor.free_time.weekdays_noon || actor.free_time.weekdays_evening);
                    const weekends = !!(actor.free_time.weekend_morning ||
                        actor.free_time.weekend_noon || actor.free_time.weekend_evening);
                    const hairСolor = {value: actor.hair_color, label: actor.hair_color};

                    this.setState({
                        actor, dateOfBirth: birth_date, fio: actor.fio,
                        phone: actor.phone, hairСolor,
                        email: actor.email, eyeСolor,
                        busy_place: actor.busy_place,
                        busy_type, tools, languages,
                        child: !!actor.children.length,
                        child_text: actor.children,
                        stageExperience: !!actor.scene,
                        studioExperience: !!actor.studio,
                        choreography: !!actor.choreography,
                        choreographyText: actor.choreography,
                        studioExperienceText: actor.studio,
                        stageExperienceText: actor.scene,
                        creativeAchievements: actor.creation,
                        growth: actor.height, weight: actor.weight,
                        breastVolume: actor.breast_volume, waist: actor.waist,
                        hips: actor.hips, character: actor.character,
                        limitations: actor.disadvantages,
                        weekdays, weekdaysMorning: actor.free_time.weekdays_morning,
                        weekdaysNoon: actor.free_time.weekdays_noon,
                        weekdaysEvening: actor.free_time.weekdays_evening,
                        weekends, weekendMorning: actor.free_time.weekend_morning,
                        weekendNoon: actor.free_time.weekend_noon,
                        weekendEvening: actor.free_time.weekend_evening,
                    })
                }
            })
            .catch(() => alert('Произошла ошибка'))
    }

    getPhotosActor() {
        const {actor_id} = this.state;

        axios.get(`${functions.getHref()}actors/${actor_id}/photo`, functions.getAxiosHeaders())
            .then(response => {
                if (response.status === 200) {
                    this.setState({photos: response.data})
                }
            })
            .catch(() => alert('Произошла ошибка'));

        // axios.get(`${functions.getHref()}actors/${actor_id}/video`, functions.getAxiosHeaders())
        //     .then(response => {
        //         if (response.status === 200) {
        //             this.setState({videos: response.data})
        //         }
        //     })
        //     .catch(() => alert('Произошла ошибка'))
    }

    handleChangeFiles(selectorFiles, type) {
        if (selectorFiles.length > 5)
            alert('Количество загружаемых файлов не должно превышать 5');
        else {
            const {actor_id, photos} = this.state;
            const links = [];

            for (let i = 0; i < selectorFiles.length; i++){
                const form = new FormData();
                form.append("file", selectorFiles[i]);

                axios.post(`${functions.getHref()}actors/${actor_id}/${type}`, form, {
                    headers: {
                        'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryyrV7KO0BoCBuDbTL'
                    }
                })
                    .then(response => {
                        if (response.status === 200) {
                            const id = Object.keys(response.data)[0];

                            links.push({
                                link: response.data[id],
                                id
                            });

                            const _photos = photos.concat(links);
                            this.setState({
                                photos: _photos
                            })
                        }
                    })
                    .catch(() => alert('При загрузке изображения произошла ошибка'))
            }
        }
    }

    onRemovePhoto(id) {
        const {actor_id, photos} = this.state;

        axios.delete(`${functions.getHref()}actors/${actor_id}/photo/${id}`, functions.getAxiosHeaders())
            .then(response => {
                if (response.status === 200) {
                    const target_img = photos.find(img => Number(img.id) === Number(id));

                    photos.splice(photos.indexOf(target_img), 1);

                    this.setState({photos})
                }
            })
    }

    onClickSave(e) {
        e.preventDefault();

        const {actor_id, fio, dateOfBirth, phone, email, busy_type, busy_place, child, child_text, tools,
            languages, weekdays, weekends, weekdaysMorning, weekdaysNoon, weekdaysEvening, weekendMorning,
            weekendNoon, weekendEvening, creativeAchievements, stageExperience, studioExperience,
            choreography, eyeСolor, hairСolor, growth, weight, waist, hips, character, limitations,
            breastVolume, studioExperienceText, stageExperienceText, choreographyText} = this.state;
        const data = {};

        if (!fio) {
            return false;
        }

        if (growth)
            data.height = Number(growth);

        if (weight)
            data.weight = Number(weight);

        if (breastVolume)
            data.breast_volume = Number(breastVolume);

        if (waist)
            data.waist = Number(waist);

        if (hips)
            data.hips = Number(hips);

        data.fio = fio;
        data.phone = phone;
        data.email = email;

        if (busy_type)
            data.busy_type_id = busy_type.value.toString();

        data.busy_place = busy_place;

        if (child)
            if (child_text)
                data.children = child_text || 'Да';
            else
                data.children = 'Да';

        data.creation = creativeAchievements;

        if (stageExperience)
            if (stageExperienceText)
                data.scene = stageExperienceText || 'Да';
            else
                data.scene = 'Да';

        if (studioExperience)
            if (studioExperienceText)
                data.studio = studioExperienceText || 'Да';
            else
                data.studio = 'Да';

        if (choreography)
            if (choreographyText)
                data.choreography = choreographyText || 'Да';
            else
                data.choreography = 'Да';

        data.character = character;
        data.disadvantages = limitations;
        data.musical_instruments = tools.map(inst => inst.value);
        data.languages = languages.map(lang => lang.value);

        if (eyeСolor)
            data.eye_color = eyeСolor.map(color => color.value);

        if (hairСolor)
            data.hair_color = hairСolor.value;

        data.free_time = {
            weekdays_morning: false,
            weekdays_noon: false,
            weekdays_evening: false,
            weekend_morning: false,
            weekend_noon: false,
            weekend_evening: false
        };

        if (weekdays) {
            data.free_time.weekdays_morning = weekdaysMorning;
            data.free_time.weekdays_noon = weekdaysNoon;
            data.free_time.weekdays_evening = weekdaysEvening;
        }

        if (weekends) {
            data.free_time.weekend_morning = weekendMorning;
            data.free_time.weekend_noon = weekendNoon;
            data.free_time.weekend_evening = weekendEvening;
        }

        data.birth_date = moment(dateOfBirth).add('hours', 12).toDate();

        axios.put(`${functions.getHref()}actors/${actor_id}`, data, functions.getAxiosHeaders())
            .then(response => {
                alert('Изменения успешно сохранены');
            })
            .catch(() => alert('Произошла ошибка'))
    }

    render() {
        const {child, studioExperience, stageExperience, child_text, tools, languages, growth, weight,
            choreography, weekdays, weekends, actor, phone, email, busy_type, eyeСolor, hairСolor, character,
            breastVolume, waist, hips, limitations, weekdaysMorning, weekdaysNoon, weekdaysEvening,
            weekendMorning, weekendNoon, weekendEvening, photos, photoIndex, isOpenLightbox, dateOfBirth} = this.state;
        const FORMAT = 'DD.MM.YYYY';
        const img_links = photos && photos.length ? photos.map(photo => photo.link) : [];

        return (
            <div className="page actor">
                <div className="row" style={{margin: '0 auto 20px', maxWidth: '700px'}}>
                    <Link to={'/'} className="link">{`<-- К списку актёров`}</Link>
                </div>
                <div className="block">
                    {
                        actor ?
                            <form className="profile">
                                <div className="profile__avatar"
                                     style={{background: `url(${img_links[0] ? ('"' + img_links[0] + '"') : photo_dflt}) center / cover no-repeat`}}
                                     onClick={() => img_links[0] ? this.setState({isOpenLightbox: true, photoIndex: 0}) : null}
                                />
                                <table>
                                    <tbody>
                                    <tr className="row">
                                        <td>Ф.И.О.</td>
                                        <td>
                                            <input
                                                className="input-text small"
                                                placeholder="Введите Ф.И.О."
                                                required={true}
                                                defaultValue={actor.fio}
                                                onChange={e => this.setState({fio: e.target.value})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Дата рождения
                                        </td>
                                        <td className="value">
                                            <div className="date-range">
                                                <DatePicker
                                                    from={dateOfBirth}
                                                    handleFromChange={time => this.handleFromChange(time)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td>Номер телефона</td>
                                        <td>
                                            <PhoneInput
                                                displayInitialValueAsLocalNumber
                                                className="input-text small"
                                                placeholder="+7 xxx xxx xx xx"
                                                required={true}
                                                value={phone}
                                                onChange={phone => this.setState({phone})}/>
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td>E-mail</td>
                                        <td>
                                            <TextMask className="input-text small"
                                                      mask={emailMask}
                                                      placeholder="Введите E-mail"
                                                      value={email}
                                                      onChange={e => this.setState({email: e.target.value})}/>
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Деятельность
                                        </td>
                                        <td className="value">
                                            <Select
                                                className="select small"
                                                placeholder="Выберите деятельность"
                                                styles={customStyles} options={[
                                                    {value: '1', label: 'Учусь'},
                                                    {value: '2', label: 'Работаю'},
                                                    {value: '3', label: 'Учусь и работаю'},
                                                    {value: '4', label: 'Полностью свободен'}
                                                ]}
                                                value={busy_type}
                                                onChange={option => this.setState({busy_type: option})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td>Место работы/учёбы</td>
                                        <td>
                                            <input
                                                className="input-text small"
                                                placeholder="Введите место работы/учёбы"
                                                defaultValue={actor.busy_place}
                                                onChange={e => this.setState({busy_place: e.target.value})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Есть ли дети
                                        </td>
                                        <td className="value">
                                            <label className="container">
                                                <input type="checkbox"
                                                       defaultChecked={!!actor.children}
                                                       onChange={e => this.setState({child: e.target.checked})}/>
                                                <span className="checkmark"/>
                                            </label>
                                            {
                                                child ?
                                                    <div style={{marginTop: '15px'}}>
                                                        <input
                                                            className="input-text small"
                                                            placeholder="Пол/возраст"
                                                            defaultValue={child_text}
                                                            onChange={e => this.setState({child_text: e.target.value})}
                                                        />
                                                    </div> :
                                                    null
                                            }
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Музыкальные инструменты
                                        </td>
                                        <td className="value">
                                            <Select
                                                className="select small"
                                                placeholder="Выберите инструменты"
                                                isMulti={true}
                                                styles={customStyles} options={[
                                                    {value: 'Аккордеон', label: 'Аккордеон'},
                                                    {value: 'Альт', label: 'Альт'},
                                                    {value: 'Арфа', label: 'Арфа'},
                                                    {value: 'Балалайка', label: 'Балалайка'},
                                                    {value: 'Барабан', label: 'Барабан'},
                                                    {value: 'Барабаны', label: 'Барабаны'},
                                                    {value: 'Бас-гитара', label: 'Бас-гитара'},
                                                    {value: 'Баян', label: 'Баян'},
                                                    {value: 'Бубен', label: 'Бубен'},
                                                    {value: 'Варган', label: 'Варган'},
                                                    {value: 'Виола', label: 'Виола'},
                                                    {value: 'Виолончель', label: 'Виолончель'},
                                                    {value: 'Волынка', label: 'Волынка'},
                                                    {value: 'Гармонь', label: 'Гармонь'},
                                                    {value: 'Гитара', label: 'Гитара'},
                                                    {value: 'Гусли', label: 'Гусли'},
                                                    {value: 'Дудка', label: 'Дудка'},
                                                    {value: 'Дудук', label: 'Дудук'},
                                                    {value: 'Кларнет', label: 'Кларнет'},
                                                    {value: 'Лира', label: 'Лира'},
                                                    {value: 'Контрабас', label: 'Контрабас'},
                                                    {value: 'Ксилофон', label: 'Ксилофон'},
                                                    {value: 'Маракас', label: 'Маракас'},
                                                    {value: 'Пианино', label: 'Пианино'},
                                                    {value: 'Саксофон', label: 'Саксофон'},
                                                    {value: 'Скрипка', label: 'Скрипка'},
                                                    {value: 'Укулеле', label: 'Укулеле'},
                                                    {value: 'Флейта', label: 'Флейта'},
                                                    {value: 'Фортепиано', label: 'Фортепиано'}
                                                ]}
                                                value={tools}
                                                onChange={options => this.setState({tools: options})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Иностранные языки
                                        </td>
                                        <td className="value">
                                            <Select
                                                className="select small"
                                                placeholder="Выберите ин. языки"
                                                isMulti={true}
                                                styles={customStyles} options={[
                                                    {value: 'Английский', label: 'Английский'},
                                                    {value: 'Арабский', label: 'Арабский'},
                                                    {value: 'Армянский', label: 'Армянский'},
                                                    {value: 'Грузинский', label: 'Грузинский'},
                                                    {value: 'Испанский', label: 'Испанский'},
                                                    {value: 'Итальянский', label: 'Итальянский'},
                                                    {value: 'Китайский', label: 'Китайский'},
                                                    {value: 'Немецкий', label: 'Немецкий'},
                                                    {value: 'Португальский', label: 'Португальский'},
                                                    {value: 'Русский', label: 'Русский'},
                                                    {value: 'Французский', label: 'Французский'},
                                                ]}
                                                value={languages}
                                                onChange={options => this.setState({languages: options})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row weekends">
                                        <td>Наличие свободного времени</td>
                                        <td>
                                            <div className="row">
                                                <label className="container">Будни
                                                    <input type="checkbox"
                                                           defaultChecked={weekdays}
                                                           onChange={e => this.setState({weekdays: e.target.checked})}/>
                                                    <span className="checkmark"/>
                                                </label>
                                                {
                                                    weekdays ?
                                                        <div className="row weekday">
                                                            <label className="container">Утро
                                                                <input type="checkbox"
                                                                       defaultChecked={weekdaysMorning}
                                                                       onChange={e => this.setState({weekdaysMorning: e.target.checked})}/>
                                                                <span className="checkmark"/>
                                                            </label>
                                                            <label className="container">День
                                                                <input type="checkbox"
                                                                       defaultChecked={weekdaysNoon}
                                                                       onChange={e => this.setState({weekdaysNoon: e.target.checked})}/>
                                                                <span className="checkmark"/>
                                                            </label>
                                                            <label className="container">Вечер
                                                                <input type="checkbox"
                                                                       defaultChecked={weekdaysEvening}
                                                                       onChange={e => this.setState({weekdaysEvening: e.target.checked})}/>
                                                                <span className="checkmark"/>
                                                            </label>
                                                        </div> : null
                                                }
                                            </div>
                                            <div className="row">
                                                <label className="container" style={{marginTop: '4px'}}>Выходные
                                                    <input type="checkbox"
                                                           defaultChecked={weekends}
                                                           onChange={e => this.setState({weekends: e.target.checked})}/>
                                                    <span className="checkmark"/>
                                                </label>
                                                {
                                                    weekends ?
                                                        <div className="row weekend">
                                                            <label className="container">Утро
                                                                <input type="checkbox"
                                                                       defaultChecked={weekendMorning}
                                                                       onChange={e => this.setState({weekendMorning: e.target.checked})}/>
                                                                <span className="checkmark"/>
                                                            </label>
                                                            <label className="container">День
                                                                <input type="checkbox"
                                                                       defaultChecked={weekendNoon}
                                                                       onChange={e => this.setState({weekendNoon: e.target.checked})}/>
                                                                <span className="checkmark"/>
                                                            </label>
                                                            <label className="container">Вечер
                                                                <input type="checkbox"
                                                                       defaultChecked={weekendEvening}
                                                                       onChange={e => this.setState({weekendEvening: e.target.checked})}/>
                                                                <span className="checkmark"/>
                                                            </label>
                                                        </div> : null
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td>Творческие достижения</td>
                                        <td>
                                            <textarea
                                                className="input-text small"
                                                placeholder="Введите творческие достижения"
                                                defaultValue={actor.creation}
                                                onChange={e => this.setState({creativeAchievements: e.target.value})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Опыт работы на сцене
                                        </td>
                                        <td className="value">
                                            <label className="container">
                                                <input type="checkbox"
                                                       defaultChecked={stageExperience}
                                                       onChange={e => this.setState({stageExperience: e.target.checked})}/>
                                                <span className="checkmark"/>
                                            </label>
                                            {
                                                stageExperience ?
                                                    <div style={{marginTop: '15px'}}>
                                                        <input
                                                            className="input-text small"
                                                            placeholder="Комментарий"
                                                            defaultValue={actor.scene}
                                                            onChange={e => this.setState({stageExperienceText: e.target.value})}
                                                        />
                                                    </div> :
                                                    null
                                            }
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Опыт студийной работы
                                        </td>
                                        <td className="value">
                                            <label className="container">
                                                <input type="checkbox"
                                                       defaultChecked={studioExperience}
                                                       onChange={e => this.setState({studioExperience: e.target.checked})}/>
                                                <span className="checkmark"/>
                                            </label>
                                            {
                                                studioExperience ?
                                                    <div style={{marginTop: '15px'}}>
                                                        <input
                                                            className="input-text small"
                                                            placeholder="Комментарий"
                                                            defaultValue={actor.studio}
                                                            onChange={e => this.setState({studioExperienceText: e.target.value})}
                                                        />
                                                    </div> :
                                                    null
                                            }
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Хореография
                                        </td>
                                        <td className="value">
                                            <label className="container">
                                                <input type="checkbox"
                                                       defaultChecked={!!actor.choreography}
                                                       onChange={e => this.setState({choreography: e.target.checked})}/>
                                                <span className="checkmark"/>
                                            </label>
                                            {
                                                choreography ?
                                                    <div style={{marginTop: '15px'}}>
                                                        <input
                                                            className="input-text small"
                                                            placeholder="Комментарий"
                                                            defaultValue={actor.choreography}
                                                            onChange={e => this.setState({choreographyText: e.target.value})}
                                                        />
                                                    </div> :
                                                    null
                                            }
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Цвет глаз
                                        </td>
                                        <td className="value">
                                            <Select
                                                className="select small"
                                                placeholder="Выберите цвет глаз"
                                                isMulti={true}
                                                styles={customStyles} options={[
                                                    {value: 'Болотный', label: 'Болотный'},
                                                    {value: 'Голубой', label: 'Голубой'},
                                                    {value: 'Жёлтый', label: 'Жёлтый'},
                                                    {value: 'Зеленый', label: 'Зеленый'},
                                                    {value: 'Каре-зелёный', label: 'Каре-зелёный'},
                                                    {value: 'Карий', label: 'Карий'},
                                                    {value: 'Серо-голубой', label: 'Серо-голубой'},
                                                    {value: 'Серый', label: 'Серый'},
                                                    {value: 'Синий', label: 'Синий'},
                                                    {value: 'Чёрный', label: 'Чёрный'},
                                                    {value: 'Янтарный', label: 'Янтарный'},
                                                ]}
                                                value={eyeСolor}
                                                onChange={options => this.setState({eyeСolor: options})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Цвет волос
                                        </td>
                                        <td className="value">
                                            <Select
                                                className="select small"
                                                placeholder="Выберите цвет волос"
                                                styles={customStyles} options={[
                                                    {value: 'Блондин', label: 'Блондин'},
                                                    {value: 'Брюнет', label: 'Брюнет'},
                                                    {value: 'Шатен', label: 'Шатен'},
                                                    {value: 'Седой', label: 'Седой'},
                                                    { value: 'Русый', label: 'Русый' },
                                                    {value: 'Рыжий', label: 'Рыжий'},
                                                    {value: 'Цветной', label: 'Цветной'},
                                                    { value: 'Чёрный', label: 'Чёрный' }
                                            ]}
                                                value={hairСolor}
                                                onChange={option => this.setState({hairСolor: option})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Рост
                                        </td>
                                        <td className="value">
                                            <input
                                                className="input-text small"
                                                placeholder="Введите рост"
                                                defaultValue={growth}
                                                onChange={e => this.setState({growth: e.target.value})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Вес
                                        </td>
                                        <td className="value">
                                            <input
                                                className="input-text small"
                                                placeholder="Введите вес"
                                                defaultValue={weight}
                                                onChange={e => this.setState({weight: e.target.value})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Объём груди
                                        </td>
                                        <td className="value">
                                            <input
                                                className="input-text small"
                                                placeholder="Введите объём груди"
                                                defaultValue={breastVolume}
                                                onChange={e => this.setState({breastVolume: e.target.value})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Объём талии
                                        </td>
                                        <td className="value">
                                            <input
                                                className="input-text small"
                                                placeholder="Введите объём талии"
                                                defaultValue={waist}
                                                onChange={e => this.setState({waist: e.target.value})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td className="key">
                                            Объём бёдер
                                        </td>
                                        <td className="value">
                                            <input
                                                className="input-text small"
                                                placeholder="Введите объём бёдер"
                                                defaultValue={hips}
                                                onChange={e => this.setState({hips: e.target.value})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td>Характер, достоинства</td>
                                        <td>
                                            <textarea
                                                className="input-text small"
                                                placeholder="Введите характер и достоинства"
                                                defaultValue={character}
                                                onChange={e => this.setState({character: e.target.value})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td>Недостатки</td>
                                        <td>
                                            <textarea
                                                className="input-text small"
                                                placeholder="Введите недостатки"
                                                defaultValue={limitations}
                                                onChange={e => this.setState({limitations: e.target.value})}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="row">
                                        <td>Фото</td>
                                        <td>
                                            <input type="file"
                                                   accept="image/*,image/jpeg"
                                                   multiple={true}
                                                   onChange={e => this.handleChangeFiles(e.target.files, 'photo')}
                                            />
                                            {
                                                photos && photos.length ?
                                                    <div className="object-photos">
                                                        {
                                                            photos.map((img, key) => <div
                                                                key={key}
                                                                className="object-photos__photo"
                                                                style={{background: `url('${img.link}') center / cover no-repeat`}}
                                                                onClick={e => {
                                                                    if (e.target.className !== 'remove')
                                                                        this.setState({isOpenLightbox: true, photoIndex: key})
                                                                }}
                                                            >
                                                                <div className="remove" title="Удалить"
                                                                     onClick={() => this.onRemovePhoto(img.id, 'photo')}/>
                                                            </div>)
                                                        }
                                                    </div> : null
                                            }
                                        </td>
                                    </tr>
                                    {/*<tr className="row">*/}
                                    {/*    <td>Видео</td>*/}
                                    {/*    <td>*/}
                                    {/*        <input type="file"*/}
                                    {/*               accept="video/*"*/}
                                    {/*               multiple={true}*/}
                                    {/*               onChange={e => this.handleChangeFiles(e.target.files, 'video')}*/}
                                    {/*        />*/}
                                    {/*        {*/}
                                    {/*            video && video.length ?*/}
                                    {/*                <div className="object-videos">*/}
                                    {/*                    {*/}
                                    {/*                        video.map((img, key) => <div*/}
                                    {/*                            key={key}*/}
                                    {/*                            className="object-videos__video"*/}
                                    {/*                            style={{background: `url('${img.link}') center / cover no-repeat`}}*/}
                                    {/*                            onClick={e => {*/}
                                    {/*                                if (e.target.className !== 'remove')*/}
                                    {/*                                    this.setState({isOpenLightbox: true, photoIndex: key})*/}
                                    {/*                            }}*/}
                                    {/*                        >*/}
                                    {/*                            <div className="remove" title="Удалить"*/}
                                    {/*                                 onClick={() => this.onRemovePhoto(img.id, 'video')}/>*/}
                                    {/*                        </div>)*/}
                                    {/*                    }*/}
                                    {/*                </div> : null*/}
                                    {/*        }*/}
                                    {/*    </td>*/}
                                    {/*</tr>*/}
                                    <tr>
                                        <td />
                                        <td>
                                            <button
                                                className="btn-primary"
                                                style={{marginTop: '50px'}}
                                                type="submit"
                                                onClick={this.onClickSave}
                                            >
                                                Сохранить
                                            </button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
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
                            </form> : null
                    }
                </div>
            </div>
        );
    }
}

export default Actor