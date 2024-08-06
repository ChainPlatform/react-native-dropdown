# React Native Dropdown
@chainplatform/dropdown is a React Native library that provides a Dropdown component for react-native and react-native-web.

<a href="https://npmjs.com/package/@chainplatform/dropdown">
  <img src="https://img.shields.io/npm/v/@chainplatform/dropdown.svg"></img>
  <img src="https://img.shields.io/npm/dt/@chainplatform/dropdown.svg"></img>
</a>
<a href="https://twitter.com/intent/follow?screen_name=doansan"><img src="https://img.shields.io/twitter/follow/doansan.svg?label=Follow%20@doansan" alt="Follow @doansan"></img></a>

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