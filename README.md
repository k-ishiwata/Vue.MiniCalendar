# Vue.MiniCalendar

シンプルなカレンダーを表示するVueコンポーネントです。  
Vue.jsの他にAxiosも使用しているので読み込んでください。

```html
<link rel="stylesheet" href="mini-calendar.css">
<mini-calendar />
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js"></script>
<script src="mini-calendar.js"></script>
<script>
var app = new Vue({
	el: '#app'
});
</script>
```

## イベントの表示

デフォルト設定ではhtmlと同階層に「data」というディレクトリを作成、その下に「年」のディレクトリを作り「月.json」というファイル名で作成します。  
例えば2021年7月のデータなら「/data/2021/7.json」のようになります。

```javascript
{
    "events": [
        {
            "day": 2,
            "title": "イベント",
            "type": "blue"
            
        },{
            "day": 6,
            "title": "イベント2",
            "type": "red"
        },{
            "day": 23,
            "title": "イベント3",
            "type": "green"
        }
    ],
    "holidays": [19]
}
```

## Props

設定はPropsで変更することができます。  

| Props | 説明 | 値 |
| --- | --- | --- |
| data-path | イベントデータのパス | './data/' |
| current-date | 表示するカレンダーの月 | '2021/6' |
| week-type | 曜日のラベル | ["日", "月", "火", "水", "木", "金", "土"] |

![キャプチャ画像](https://user-images.githubusercontent.com/1312692/123545728-8b789800-d794-11eb-81e4-411a689914a6.png)