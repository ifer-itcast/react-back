# 一套后台管理初始化模板

## 创建项目

```
npx create-react-app react-back
```

## 集成 AntD

```
npm i antd
```

## 按需加载 AntD

```
npm i react-app-rewired customize-cra -D
npm i babel-plugin-import -D
```

```javascript
// package.json
{
    "scripts": {
        "start": "react-app-rewired start",
        "build": "react-app-rewired build",
        "test": "react-app-rewired test",
        "eject": "react-scripts eject"
    },
}
```

```javascript
// config-overrides.js
const { override, fixBabelImports } = require('customize-cra');

module.exports = override(
    fixBabelImports('antd', {
        libraryDirectory: 'es',
        style: 'css'
    })
);
```

## 自定义主题

注意安装 `less-loader@5` 这个版本，详见 [less-loader](https://github.com/ant-design/ant-design/issues/23624)

```
npm i less less-loader@5 -D
```

```javascript
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
	fixBabelImports('antd', {
		libraryDirectory: 'es',
		style: true
	}),
	addLessLoader({
		javascriptEnabled: true,
		modifyVars: require('./theme')
	})
);
```

## i18n

AntD 默认文案是英文，需要 [国际化](https://ant.design/docs/react/i18n-cn)

src/index.js

```javascript
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

ReactDOM.render(
	<ConfigProvider locale={zhCN}>
		<App />
	</ConfigProvider>,
	document.getElementById('root')
);
```