Vue.component('miniCalendar', {
    template: `<div class="mini-calendar">
        <div class="calender-head">
            <h3 class="title-year-month">{{ currentYear }}年{{ currentMonth }}月</h3>
            <div class="month-change-btns">
                <button @click="changemonth(-1)">&lt; 前の月</button>
                <button @click="changemonth(1)">次の月 &gt;</button>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th
                        v-for="(type, index) in weekType"
                        :class="[
                            index === 0 ? 'cell-sun' : '',
                            index === 6 ? 'cell-sat' : ''
                        ]"
                    >{{ type }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) of days">
                    <td
                        v-for="(col, colIndex) in row"
                        :class="cellClass(col, colIndex)">
                        <i class="day-number">{{ col.day }}</i>
                        <template v-if="col.type !== 'none'" v-for="event in events">
                            <span
                                v-if="col.day === event.day"
                                class="event"
                                :class="['is-'+event.type]"
                            >
                                {{ event.title }}
                            </span>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>`,
    props: {
        weekType: {
            type: Array,
            required: false,
            default: function() {
                return ["日", "月", "火", "水", "木", "金", "土"];
            } 
        },
        currentDate: {
            type: String,
            required: false,
            default: function() {
                return new Date().toLocaleDateString();
            } 
        },
        dataPath: {
            type: String,
            required: false,
            default: './data/'
        }
    },
    data () {
        return {
            title: '',
            days: [],
            events: [],
            holidays: [],
            rowCount: 0,
            currentYear: 0,
            currentMonth: 0
        };
    },
    methods: {
        loadData () {
            const self = this;
            axios.get(this.dataPath + this.currentYear + '/' + this.currentMonth + '.json')
                .then(function (response) {
                    if (response.data.events) {
                        self.events = response.data.events;
                    }
                    if (response.data.holidays) {
                        self.holidays = response.data.holidays;
                    }
                })
                .catch(function (error) {
                    self.events = [];
                    self.holidays = [];
                })
                .then(function () {
                    self.makeCell();
                });
        },
        changemonth (addMonth) {
            this.currentMonth += addMonth;

            if (this.currentMonth < 1) {
                this.currentMonth = 12;
                this.currentYear--;
            } else if (this.currentMonth > 12) {
                this.currentMonth = 1;
                this.currentYear++;
            }
            this.loadData();
        },
        makeCell () {
            const currentYear = this.currentYear;
            const currentMonth = this.currentMonth;
    
            const startDate = new Date(currentYear, currentMonth - 1, 1);
            // 開始の曜日
            const startWeek = startDate.getDay();
    
            // 表示する月の最後の日
            const lastday = new Date(currentYear, currentMonth, 0).getDate();
    
            const lastWeek = new Date(currentYear, currentMonth, 0).getDay();

            // 前月の最後の日
            const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0).getDate();
    
            // 縦の数
            const rowCount = Math.ceil((lastday + startWeek) / 7);
    
            let cells = [];

            // 先月の表示数からカウント
            let day = prevMonthLastDay - startWeek + 1;

            for (let y = 0; y < rowCount; y++) {
                cells[y] = [];
                for (let x = 0; x < 7; x++) {
                    let type = null;

                    // 最初の行
                    if (y === 0 && x <= startWeek) {
                        type = 'none';
                        // 開始曜日を過ぎたら1から
                        if (x === startWeek) {
                            type = null;
                            day = 1;
                        }
                    }
                    // 最後の行
                    else if (y === (rowCount - 1) && lastWeek < x) {
                        type = 'none';
                        // 最後の曜日を過ぎたら1から
                        if (x === (lastWeek + 1)) {
                            day = 1;
                        }
                    }
                    // 休日(holiday)の処理
                    else if (this.holidays.indexOf(day) !== -1) {
                        type = 'holiday';
                    }
                    
                    cells[y][x] = {
                        day: day,
                        type: type
                    }
                    day++;
                }
            }
    
            this.days = cells;
        },
        cellClass: function (day, colIndex) {
            let className = '';

            // 土日
            if (colIndex === 0) {
                className += 'cell-sun';
            } else if(colIndex === 6) {
                className += 'cell-sat';
            }

            // 前次の月
            if (day.type === 'none') {
                className = ' cell-none';
            }
            // 休日
            else if (day.type === 'holiday') {
                className = ' cell-holiday';
            }

            return className;
        }
    },
    mounted () {
        var currentDate = new Date(this.currentDate);
        this.currentYear = currentDate.getFullYear();
        this.currentMonth = currentDate.getMonth() + 1;
        this.loadData();
    }
});
