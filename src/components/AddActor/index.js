import React, {Component} from "react";
import ReactDOM from "react-dom";
import Popup from "reactjs-popup";
import close from "../../img/icon_close.png";
import Select from "react-select";
import moment from "moment";
import axios from "axios";
import PhoneInput from 'react-phone-number-input';
import functions from "../../functions";
import emailMask from 'text-mask-addons/dist/emailMask';
import TextMask from 'react-text-mask';

import "./AddActor.scss";
import 'react-day-picker/lib/style.css';
import 'react-phone-number-input/style.css';
import DatePicker from "../DatePicker";






const modalRoot = document.body;
const contentStyle = {
    boxShadow: '0 0 40px rgba(0,0,0,0.3)',
    borderRadius: '2px',
    padding: '20px',
    width: '100%',
    maxWidth: '500px'
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

class AddActor extends Component {
    constructor(props) {
        super(props);

        this.handleFromChange = this.handleFromChange.bind(this);
        this.addItem = this.addItem.bind(this);
        this.el = document.createElement('div');
        this.el.className = 'ReactModal';
        this.state = {
            open: false,
            from: undefined,
            to: undefined,
            photo: undefined, fio: '',
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
            weekendNoon: false, weekendEvening: false
        }
    }

    componentDidMount() {
        modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }

    handleFromChange(from) {
        this.setState({ from, dateOfBirth: from });
    }

    addItem = e => {
        e.preventDefault();

        const {fio, dateOfBirth, phone, email, busy_type, busy_place, child, child_text, tools,
            languages, weekdays, weekends, weekdaysMorning, weekdaysNoon, weekdaysEvening, weekendMorning,
            weekendNoon, weekendEvening, creativeAchievements, stageExperience, studioExperience,
            choreography, eyeСolor, hairColor, growth, weight, waist, hips, character, limitations,
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

        if (hairColor)
            data.hair_color = hairColor.value;

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

        axios.post(`${functions.getHref()}actors`, data, functions.getAxiosHeaders())
            .then(response => {
                this.props.history.push(`/${response.data}`)
            })
            .catch(() => alert('Произошла ошибка'))
    };

    render() {
        const {open, from, child, studioExperience, stageExperience,
            choreography, weekdays, weekends} = this.state;
        const FORMAT = 'DD.MM.YYYY';

        return (
            <div className="add-actor">
                <button className="add-actor__button btn-primary" onClick={() => this.setState({open: true})}>+</button>
                <div className="add-actor__modal">
                    {
                        ReactDOM.createPortal(
                            <Popup
                                open={open}
                                closeOnDocumentClick
                                onClose={() => this.setState({open: false})}
                                contentStyle={contentStyle}
                                overlayStyle={{zIndex: 5, overflow: 'auto'}}
                            >
                                <div className="content">
                                    <div className="header">
                                        <div className="caption">Добавление актёра</div>
                                        <img src={close} alt="" onClick={() => this.setState({open: false})}/>
                                    </div>
                                    <form className="body">
                                        <table>
                                            <tbody>
                                            <tr className="row">
                                                <td>Ф.И.О.</td>
                                                <td>
                                                    <input
                                                        className="input-text small"
                                                        placeholder="Введите Ф.И.О."
                                                        required={true}
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
                                                            from={from}
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
                                                        onChange={phone => this.setState({phone}) } />
                                                </td>
                                            </tr>
                                            <tr className="row">
                                                <td>E-mail</td>
                                                <td>
                                                    <TextMask className="input-text small"
                                                              mask={emailMask}
                                                              placeholder="Введите E-mail"
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
                                                            { value: '1', label: 'Учусь' },
                                                            { value: '2', label: 'Работаю' },
                                                            { value: '3', label: 'Учусь и работаю' },
                                                            { value: '4', label: 'Полностью свободен' }
                                                        ]}
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
                                                        <input type="checkbox" onChange={e => this.setState({child: e.target.checked})}/>
                                                        <span className="checkmark" />
                                                    </label>
                                                    {
                                                        child ?
                                                            <div style={{marginTop: '15px'}}>
                                                                <input
                                                                    className="input-text small"
                                                                    placeholder="Пол/возраст"
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
                                                            { value: 'Аккордеон', label: 'Аккордеон' },
                                                            { value: 'Альт', label: 'Альт' },
                                                            { value: 'Арфа', label: 'Арфа' },
                                                            { value: 'Балалайка', label: 'Балалайка' },
                                                            { value: 'Барабан', label: 'Барабан' },
                                                            { value: 'Барабаны', label: 'Барабаны' },
                                                            { value: 'Бас-гитара', label: 'Бас-гитара' },
                                                            { value: 'Баян', label: 'Баян' },
                                                            { value: 'Бубен', label: 'Бубен' },
                                                            { value: 'Варган', label: 'Варган' },
                                                            { value: 'Виола', label: 'Виола' },
                                                            { value: 'Виолончель', label: 'Виолончель' },
                                                            { value: 'Волынка', label: 'Волынка' },
                                                            { value: 'Гармонь', label: 'Гармонь' },
                                                            { value: 'Гитара', label: 'Гитара' },
                                                            { value: 'Гусли', label: 'Гусли' },
                                                            { value: 'Дудка', label: 'Дудка' },
                                                            { value: 'Дудук', label: 'Дудук' },
                                                            { value: 'Кларнет', label: 'Кларнет' },
                                                            { value: 'Лира', label: 'Лира' },
                                                            { value: 'Контрабас', label: 'Контрабас' },
                                                            { value: 'Ксилофон', label: 'Ксилофон' },
                                                            { value: 'Маракас', label: 'Маракас' },
                                                            { value: 'Пианино', label: 'Пианино' },
                                                            { value: 'Саксофон', label: 'Саксофон' },
                                                            { value: 'Скрипка', label: 'Скрипка' },
                                                            { value: 'Укулеле', label: 'Укулеле' },
                                                            { value: 'Флейта', label: 'Флейта' },
                                                            { value: 'Фортепиано', label: 'Фортепиано' }
                                                        ]}
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
                                                            { value: 'Английский', label: 'Английский' },
                                                            { value: 'Арабский', label: 'Арабский' },
                                                            { value: 'Армянский', label: 'Армянский' },
                                                            { value: 'Грузинский', label: 'Грузинский' },
                                                            { value: 'Испанский', label: 'Испанский' },
                                                            { value: 'Итальянский', label: 'Итальянский' },
                                                            { value: 'Китайский', label: 'Китайский' },
                                                            { value: 'Немецкий', label: 'Немецкий' },
                                                            { value: 'Португальский', label: 'Португальский' },
                                                            { value: 'Русский', label: 'Русский' },
                                                            { value: 'Французский', label: 'Французский' },
                                                        ]}
                                                        onChange={options => this.setState({languages: options})}
                                                    />
                                                </td>
                                            </tr>
                                            <tr className="row weekends">
                                                <td>Наличие свободного времени</td>
                                                <td>
                                                    <div className="row">
                                                        <label className="container">Будни
                                                            <input type="checkbox" onChange={e => this.setState({weekdays: e.target.checked})} />
                                                            <span className="checkmark" />
                                                        </label>
                                                        {
                                                            weekdays ?
                                                                <div className="row weekday">
                                                                    <label className="container">Утро
                                                                        <input type="checkbox" onChange={e => this.setState({weekdaysMorning: e.target.checked})} />
                                                                        <span className="checkmark" />
                                                                    </label>
                                                                    <label className="container">День
                                                                        <input type="checkbox" onChange={e => this.setState({weekdaysNoon: e.target.checked})} />
                                                                        <span className="checkmark" />
                                                                    </label>
                                                                    <label className="container">Вечер
                                                                        <input type="checkbox" onChange={e => this.setState({weekdaysEvening: e.target.checked})} />
                                                                        <span className="checkmark" />
                                                                    </label>
                                                                </div> : null
                                                        }
                                                    </div>
                                                    <div className="row">
                                                        <label className="container" style={{marginTop: '4px'}}>Выходные
                                                            <input type="checkbox" onChange={e => this.setState({weekends: e.target.checked})} />
                                                            <span className="checkmark" />
                                                        </label>
                                                        {
                                                            weekends ?
                                                                <div className="row weekend">
                                                                    <label className="container">Утро
                                                                        <input type="checkbox" onChange={e => this.setState({weekendMorning: e.target.checked})} />
                                                                        <span className="checkmark" />
                                                                    </label>
                                                                    <label className="container">День
                                                                        <input type="checkbox" onChange={e => this.setState({weekendNoon: e.target.checked})} />
                                                                        <span className="checkmark" />
                                                                    </label>
                                                                    <label className="container">Вечер
                                                                        <input type="checkbox" onChange={e => this.setState({weekendEvening: e.target.checked})} />
                                                                        <span className="checkmark" />
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
                                                        <input type="checkbox" onChange={e => this.setState({stageExperience: e.target.checked})} />
                                                        <span className="checkmark" />
                                                    </label>
                                                    {
                                                        stageExperience ?
                                                            <div style={{marginTop: '15px'}}>
                                                                <input
                                                                    className="input-text small"
                                                                    placeholder="Комментарий"
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
                                                        <input type="checkbox" onChange={e => this.setState({studioExperience: e.target.checked})} />
                                                        <span className="checkmark" />
                                                    </label>
                                                    {
                                                        studioExperience ?
                                                            <div style={{marginTop: '15px'}}>
                                                                <input
                                                                    className="input-text small"
                                                                    placeholder="Комментарий"
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
                                                        <input type="checkbox" onChange={e => this.setState({choreography: e.target.checked})} />
                                                        <span className="checkmark" />
                                                    </label>
                                                    {
                                                        choreography ?
                                                            <div style={{marginTop: '15px'}}>
                                                                <input
                                                                    className="input-text small"
                                                                    placeholder="Комментарий"
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
                                                            { value: 'Болотный', label: 'Болотный' },
                                                            { value: 'Голубой', label: 'Голубой' },
                                                            { value: 'Жёлтый', label: 'Жёлтый' },
                                                            { value: 'Зеленый', label: 'Зеленый' },
                                                            { value: 'Каре-зелёный', label: 'Каре-зелёный' },
                                                            { value: 'Карий', label: 'Карий' },
                                                            { value: 'Серо-голубой', label: 'Серо-голубой' },
                                                            { value: 'Серый', label: 'Серый' },
                                                            { value: 'Синий', label: 'Синий' },
                                                            { value: 'Чёрный', label: 'Чёрный' },
                                                            { value: 'Янтарный', label: 'Янтарный' },
                                                        ]}
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
                                                            { value: 'Блондин', label: 'Блондин' },
                                                            { value: 'Брюнет', label: 'Брюнет' },
                                                            { value: 'Шатен', label: 'Шатен' },
                                                            { value: 'Седой', label: 'Седой' },
                                                            { value: 'Русый', label: 'Русый' },
                                                            { value: 'Рыжий', label: 'Рыжий' },
                                                            { value: 'Цветной', label: 'Цветной' },
                                                            { value: 'Чёрный', label: 'Чёрный' }
                                                    ]}
                                                        onChange={option => this.setState({hairColor: option})}
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
                                                        onChange={e => this.setState({limitations: e.target.value})}
                                                    />
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </form>
                                    <div className="footer">
                                        <button className="btn-primary" type="submit" onClick={this.addItem}>Добавить</button>
                                    </div>
                                </div>
                            </Popup>,
                            this.el
                        )
                    }
                </div>
            </div>
        );
    }
}

export default AddActor