import React, {Component} from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import {formatDate, parseDate} from "react-day-picker/moment";

import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

import "react-day-picker/lib/style.css";
import moment from "moment";


const MONTHS = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
];
const WEEKDAYS_LONG = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье',
];
const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const FORMAT = 'DD.MM.YYYY';
const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear, 0);
const toMonth = new Date(currentYear - 80, 11);


function YearMonthForm({ date, onChange }) {
    const years = [];
    for (let i = fromMonth.getFullYear(); i >= toMonth.getFullYear(); i -= 1) {
        years.push(i);
    }

    const handleChange = function handleChange(e) {
        const { year, month } = e.target.form;
        onChange(new Date(year.value, month.value));
    };

    return (
        <form className="DayPicker-Caption">
            <select name="month" onChange={handleChange} value={date.getMonth()}>
                {MONTHS.map((month, i) => (
                    <option key={month} value={i}>
                        {month}
                    </option>
                ))}
            </select>
            <select name="year" onChange={handleChange} value={date.getFullYear()}>
                {years.map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </form>
    );
}

class DatePicker extends Component {
    constructor(props) {
        super(props);

        this.handleToChange = this.handleToChange.bind(this);
        this.handleYearMonthChange = this.handleYearMonthChange.bind(this);

        this.state = {
            month: fromMonth
        }
    }

    handleYearMonthChange(month) {
        this.setState({ month });
    }

    showFromMonth() {
        const { from, to } = this.props;
        if (!from) {
            return;
        }
        if (moment(to).diff(moment(from), 'months') < 2) {
            this.to.getDayPicker().showMonth(from);
        }
    }

    handleToChange(to) {
        this.props.handleToChange(to);
        this.showFromMonth();
    }

    render() {
        const {from, to, isRange, handleFromChange} = this.props;

        return (
            <div className="date-range">
                <DayPickerInput
                    ref={el => (this.from = el)}
                    placeholder="дд.мм.гггг"
                    value={from}
                    format={FORMAT}
                    formatDate={formatDate}
                    parseDate={parseDate}
                    dayPickerProps={{
                        locale: "ru",
                        months: MONTHS,
                        weekdaysLong: WEEKDAYS_LONG,
                        weekdaysShort: WEEKDAYS_SHORT,
                        firstDayOfWeek: 0,
                        selectedDays: [from],
                        onDayClick: () => isRange ? this.to.getInput().focus() : null,
                        month: this.state.month,
                        fromMonth: fromMonth,
                        toMonth: toMonth,
                        captionElement: ({ date }) => (
                            <YearMonthForm
                                date={date}
                                onChange={this.handleYearMonthChange}
                            />
                        )
                    }}
                    onDayChange={time => handleFromChange(time)}
                />
                { isRange ? <span>–</span> : null }
                {
                    isRange ?
                        <span className="InputFromTo-to">
                            <DayPickerInput
                                ref={el => (this.to = el)}
                                value={to || ''}
                                placeholder="дд.мм.гггг"
                                format={FORMAT}
                                formatDate={formatDate}
                                parseDate={parseDate}
                                dayPickerProps={{
                                    locale: "ru",
                                    months: MONTHS,
                                    weekdaysLong: WEEKDAYS_LONG,
                                    weekdaysShort: WEEKDAYS_SHORT,
                                    selectedDays: [to],
                                    firstDayOfWeek: 0,
                                    month: this.state.month,
                                    fromMonth: fromMonth,
                                    toMonth: toMonth,
                                    captionElement: ({date}) => (
                                        <YearMonthForm
                                            date={date}
                                            onChange={this.handleYearMonthChange}
                                        />
                                    )
                                }}
                                onDayChange={this.handleToChange}
                            />
                        </span> : null
                }
            </div>
        );
    }
}

export default DatePicker
