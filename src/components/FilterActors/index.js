import React, {Component} from "react";
import Select from "react-select";
import moment from "moment";
import DatePicker from "../DatePicker";
import arrow_icon from "../../img/arrow-down.svg";



import "./FilterActors.scss";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"




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

class FilterActors extends Component {
    constructor(props) {
        super(props);

        this.state = {
            from: undefined,
            to: undefined,
            musical_instruments: [],
            languages: [],
            hair_color: [],
            eye_color: [],
            has_child: false, scene: false,
            studio: false, choreography: false,
            update: false,
            busy_type: undefined,
            height_from: 0, height_to: 0,
            weight_from: 0, weight_to: 0,
            breast_from: 0, breast_to: 0,
            waist_from: 0, waist_to: 0,
            hips_from: 0, hips_to: 0,
            isFiltered: false,
            isOpen: false
        };
    }

    componentDidUpdate() {
        const {
            from, to, musical_instruments, languages, hair_color, eye_color, update,
            has_child, scene, studio, choreography, height_from, height_to, weight_from,
            weight_to, breast_from, breast_to, waist_from, waist_to, hips_from, hips_to, busy_type
        } = this.state;

        if (update) {
            const musical_instruments_formatted = musical_instruments.map(tool => tool.value);
            const languages_formatted = languages.map(lang => lang.value);
            const hair_color_formatted = hair_color.map(lang => lang.value);
            const eye_color_formatted = eye_color.map(lang => lang.value);
            const filter = {
                musical_instruments: musical_instruments_formatted,
                languages: languages_formatted,
                hair_color: hair_color_formatted,
                eye_color: eye_color_formatted,
                has_child, scene, studio, choreography,
                height_from: height_from ? Number(height_from) : 0,
                weight_from: weight_from ? Number(weight_from) : 0,
                breast_from: breast_from ? Number(breast_from) : 0,
                waist_from: waist_from ? Number(waist_from) : 0,
                hips_from: hips_from ? Number(hips_from) : 0
            };

            if (from)
                filter.birth_from = moment(from).startOf('day').unix();

            if (to)
                filter.birth_to = moment(to).endOf('day').unix();

            if (height_to)
                filter.height_to = Number(height_to);

            if (weight_to)
                filter.weight_to = Number(weight_to);

            if (breast_to)
                filter.breast_to = Number(breast_to);

            if (waist_to)
                filter.waist_to = Number(waist_to);

            if (hips_to)
                filter.hips_to = Number(hips_to);

            if (busy_type)
                filter.busy_type = busy_type.value;

            this.props.onFilterData(filter);
            this.setState({update: false})
        }

        if (from === null && to === null) {
            const inputs = document.querySelectorAll('.filter-actors .date-range .DayPickerInput input');

            inputs[0].value = '';
            inputs[1].value = '';
        }
    }

    onResetFilter() {
        this.setState({
            from: null,
            to: null,
            musical_instruments: [],
            languages: [],
            hair_color: [],
            eye_color: [],
            has_child: false, scene: false,
            studio: false, choreography: false,
            height_from: 0, height_to: 0,
            weight_from: 0, weight_to: 0,
            breast_from: 0, breast_to: 0,
            waist_from: 0, waist_to: 0,
            hips_from: 0, hips_to: 0,
            busy_type: null,
            update: true,
            isFiltered: false
        })
    }

    handleFromChange(time) {
        this.setState({from: time, update: true, isFiltered: time ? true : this.state.isFiltered})
    }

    handleToChange(time) {
        this.setState({to: time, update: true, isFiltered: time ? true : this.state.isFiltered})
    }

    render() {
        const {from, to, isFiltered, busy_type, has_child, musical_instruments, languages, studio, scene,
            choreography, eye_color, hair_color, height_from, height_to, weight_from, weight_to,
            breast_from, breast_to, waist_from, waist_to, hips_from, hips_to, isOpen} = this.state;

        return (
            <div className={`filter-actors ${isOpen ? 'open' : ''}`}>
                <div className="row open-filter">
                    <div className="key" onClick={() => this.setState({isOpen: !isOpen})}>
                        Фильтр
                        <img src={arrow_icon} alt=""/>
                    </div>
                </div>
                {
                    isFiltered &&
                    <div className="row">
                        <div className="value">
                            <button className="btn-primary" style={{width: '100%'}}
                                    onClick={() => this.onResetFilter()}>
                                Сбросить фильтр
                            </button>
                        </div>
                    </div>
                }
                <div className="row">
                    <div className="key">
                        Дата рождения
                    </div>
                    <div className="value">
                        <DatePicker
                            isRange={true}
                            from={from} to={to}
                            handleFromChange={time => this.handleFromChange(time)}
                            handleToChange={time => this.handleToChange(time)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Деятельность
                    </div>
                    <div className="value">
                        <Select
                            className="select small"
                            placeholder="Выберите деятельность"
                            styles={customStyles} options={[
                                { value: '1', label: 'Учусь' },
                                { value: '2', label: 'Работаю' },
                                { value: '3', label: 'Учусь и работаю' },
                                { value: '4', label: 'Полностью свободен' }
                            ]}
                            value={busy_type}
                            onChange={option => this.setState({busy_type: option, update: true, isFiltered: option ? true : this.state.isFiltered})}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Есть ли дети
                    </div>
                    <div className="value">
                        <label className="container">
                            <input type="checkbox"
                                   checked={has_child}
                                   onChange={e => this.setState({has_child: e.target.checked, update: true, isFiltered: e.target.checked ? true : this.state.isFiltered})} />
                            <span className="checkmark" />
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Музыкальные инструменты
                    </div>
                    <div className="value">
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
                            value={musical_instruments}
                            onChange={options => this.setState({musical_instruments: options || [], update: true, isFiltered: options ? true : this.state.isFiltered})}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Иностранные языки
                    </div>
                    <div className="value">
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
                            value={languages}
                            onChange={options => this.setState({languages: options || [], update: true, isFiltered: options ? true : this.state.isFiltered})}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Опыт работы на сцене
                    </div>
                    <div className="value">
                        <label className="container">
                            <input type="checkbox"
                                   checked={scene}
                                   onChange={e =>
                                       this.setState({
                                           scene: e.target.checked,
                                           update: true,
                                           isFiltered: e.target.checked ? true : this.state.isFiltered})
                                   } />
                            <span className="checkmark" />
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Опыт студийной работы
                    </div>
                    <div className="value">
                        <label className="container">
                            <input type="checkbox" checked={studio} onChange={e => this.setState({studio: e.target.checked, update: true,
                                isFiltered: e.target.checked ? true : this.state.isFiltered})} />
                            <span className="checkmark" />
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Хореография
                    </div>
                    <div className="value">
                        <label className="container">
                            <input type="checkbox" checked={choreography} onChange={e => this.setState({choreography: e.target.checked, update: true,
                                isFiltered: e.target.checked ? true : this.state.isFiltered})} />
                            <span className="checkmark" />
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Цвет глаз
                    </div>
                    <div className="value">
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
                            value={eye_color}
                            onChange={options => this.setState({eye_color: options || [], update: true,
                                isFiltered: options ? true : this.state.isFiltered})}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Цвет волос
                    </div>
                    <div className="value">
                        <Select
                            className="select small"
                            placeholder="Выберите цвет волос"
                            isMulti={true}
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
                            value={hair_color}
                            onChange={options => this.setState({hair_color: options || [], update: true,
                                isFiltered: options ? true : this.state.isFiltered})}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Рост
                    </div>
                    <div className="value">
                        <input className="input-text small" placeholder="от" value={height_from} onChange={e => this.setState({height_from: e.target.value, update: true,
                            isFiltered: e.target.value ? true : this.state.isFiltered})}/>
                        <span>–</span>
                        <input className="input-text small" placeholder="до" value={height_to} onChange={e => this.setState({height_to: e.target.value, update: true,
                            isFiltered: e.target.value ? true : this.state.isFiltered})}/>
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Вес
                    </div>
                    <div className="value">
                        <input className="input-text small" placeholder="от" value={weight_from} onChange={e => this.setState({weight_from: e.target.value, update: true,
                            isFiltered: e.target.value ? true : this.state.isFiltered})}/>
                        <span>–</span>
                        <input className="input-text small" placeholder="до" value={weight_to} onChange={e => this.setState({weight_to: e.target.value, update: true,
                            isFiltered: e.target.value ? true : this.state.isFiltered})}/>
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Объём груди
                    </div>
                    <div className="value">
                        <input className="input-text small" placeholder="от" value={breast_from} onChange={e => this.setState({breast_from: e.target.value, update: true,
                            isFiltered: e.target.value ? true : this.state.isFiltered})}/>
                        <span>–</span>
                        <input className="input-text small" placeholder="до" value={breast_to} onChange={e => this.setState({breast_to: e.target.value, update: true,
                            isFiltered: e.target.value ? true : this.state.isFiltered})}/>
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Объём талии
                    </div>
                    <div className="value">
                        <input className="input-text small" placeholder="от" value={waist_from} onChange={e => this.setState({waist_from: e.target.value, update: true,
                            isFiltered: e.target.value ? true : this.state.isFiltered})}/>
                        <span>–</span>
                        <input className="input-text small" placeholder="до" value={waist_to} onChange={e => this.setState({waist_to: e.target.value, update: true,
                            isFiltered: e.target.value ? true : this.state.isFiltered})}/>
                    </div>
                </div>
                <div className="row">
                    <div className="key">
                        Объём бёдер
                    </div>
                    <div className="value">
                        <input className="input-text small" placeholder="от" value={hips_from} onChange={e => this.setState({hips_from: e.target.value, update: true,
                            isFiltered: e.target.value ? true : this.state.isFiltered})}/>
                        <span>–</span>
                        <input className="input-text small" placeholder="до" value={hips_to} onChange={e => this.setState({hips_to: e.target.value, update: true,
                            isFiltered: e.target.value ? true : this.state.isFiltered})}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default FilterActors