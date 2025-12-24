# React Native Dropdown
@chainplatform/dropdown is a React Native library that provides a Dropdown component for react-native and react-native-web.

<p align="center">
  <a href="https://github.com/ChainPlatform/react-native-dropdown/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/dropdown">
    <img src="https://img.shields.io/npm/v/@chainplatform/dropdown?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/dropdown">
    <img src="https://img.shields.io/npm/dt/@chainplatform/dropdown.svg"></img>
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/dropdown">
    <img src="https://img.shields.io/badge/platform-android%20%7C%20ios%20%7C%20web-blue"></img>
  </a>
  <a href="https://github.com/ChainPlatform/react-native-dropdown/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=doansan">
    <img src="https://img.shields.io/twitter/follow/doansan.svg?label=Follow%20@doansan" alt="Follow @doansan" />
  </a>
</p>

### Install
```
npm install @chainplatform/dropdown --save
```
or
```
yarn add @chainplatform/dropdown
```


### Usage

```js
import React from 'react';
import {StyleSheet} from 'react-native';
import CheckBox from '@chainplatform/dropdown';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lists: [{label: "the First"}],
            open: false,
            idefaultIdex: -1,
        };

        this.exchangeRef = React.createRef(null);
    }


  onSelectExchange(index, item) {
    console.log("onSelectExchange ", index, item);
  }

  render() {
    return (
      <View style={{flex:1}}>
            <Dropdown
                            ref={this.exchangeRef}
                            disabled={false}
                            placeholder={"search"}
                            containerStyle={{
                                width: "100%",
                                borderRadius: 4,
                                borderColor: "#DDD",
                                borderWidth: 1,
                                flexDirection: "row",
                                alignItems: "center"
                            }}
                            textStyle={{
                                fontSize: 13,
                                textAlign: "left",
                                padding: 11.5
                            }}
                            stickerStyle={{
                                marginRight: 8,
                                justifyContent: "center",
                                alignItems: "center",
                                width: 20,
                                height: 20,
                                color: "#DDD"
                            }}
                            dropdownContainerStyle={{
                                width: "100%",
                                maxHeight: 165,
                                maxWidth: 430,
                                borderColor: "#DDD",
                                borderWidth: 1,
                            }}
                            defaultIndex={this.state.idefaultIdex}
                            data={this.state.lists}
                            onSelect={(selected, item) => this.onSelectExchange(selected, item)}
                        />
      </View>
    );
  }
}
```
---

## 🪪 License
MIT © 2025 [Chain Platform](https://chainplatform.net)

---

## 💖 Support & Donate

If you find this package helpful, consider supporting the development:

| Cryptocurrency | Address |
|----------------|----------|
| **Bitcoin (BTC)** | `17grbSNSEcEybS1nHh4TGYVodBwT16cWtc` |
![alt text](image-1.png)
| **Ethereum (ETH)** | `0xa2fd119a619908d53928e5848b49bf1cc15689d4` |
![alt text](image-2.png)
| **Tron (TRX)** | `TYL8p2PLCLDfq3CgGBp58WdUvvg9zsJ8pd` |
![alt text](image.png)
| **DOGE (DOGE)** | `DDfKN2ys4frNaUkvPKcAdfL6SiVss5Bm19` |
| **USDT (SOLANA)** | `cPUZsb7T9tMfiZFqXbWbRvrUktxgZQXQ2Ni1HiVXgFm` |

Your contribution helps maintain open-source development under the Chain Platform ecosystem 🚀
