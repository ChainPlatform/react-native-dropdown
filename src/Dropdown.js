import { useImperativeHandle, useState, useRef, forwardRef } from 'react';
import { Pressable, StyleSheet, Text, View, Modal, FlatList } from 'react-native';
import ChevronDownSVG from './ChevronDownSVG';
import ChevronUpSVG from './ChevronUpSVG';

const Dropdown = (props, ref) => {

    useImperativeHandle(ref, () => ({
        setIndex: (set_index) => { setIndex(set_index) }
    }))

    let defaultLabel = typeof props.placeholder != "undefined" ? props.placeholder : "";
    const DropdownButton = useRef();
    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelected] = useState(undefined);
    const [dropdownTop, setDropdownTop] = useState(0);
    const [dropdownLeft, setDropdownLeft] = useState(0);
    const [dropdownWidth, setDropdownWidth] = useState(0);

    const setIndex = (item) => {
        setSelected(item);
    }

    const toggleDropdown = () => {
        visible ? setVisible(false) : openDropdown();
    };

    const openDropdown = () => {
        DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
            setDropdownWidth(_w)
            setDropdownTop(py + h);
            setDropdownLeft(_px);
            setVisible(true);
        });
    };

    const onItemPress = (index, item) => {
        setSelected(item);
        props.onSelect(index, item);
        setVisible(false);
    };

    const renderItem = ({ index, item }) => (
        <Pressable
            style={[styles.item,
            typeof props.itemStyle != "undefined" ? props.itemStyle : {},
            {
                backgroundColor:
                    (
                        (typeof selectedItem != 'undefined' && selectedItem != null && selectedItem.value == item.value)
                        ||
                        (typeof selectedItem == "undefined" && props.defaultIndex === index)
                    ) ? 'rgb(221, 221, 221)' : "#FFFFFF",
            },
            index == props.data.length - 1 ? { borderBottomWidth: 0 } : {}]}
            onPress={() => onItemPress(index, item)}>
            <Text style={[styles.buttonText, typeof props.textStyle != "undefined" ? props.textStyle : {}]}>{item.label}</Text>
        </Pressable>
    );

    const renderDropdown = () => {
        return (
            <Modal
                visible={visible}
                transparent
                animationType="none">
                <Pressable
                    activeOpacity={1}
                    style={styles.overlay}
                    onPress={() => setVisible(false)}>
                    <FlatList
                        style={[
                            {
                                zIndex: 10,
                                top: dropdownTop,
                                left: dropdownLeft,
                                maxHeight: 160,
                                flexGrow: 0,
                                borderRadius: 4,
                                borderColor: 'rgb(221, 221, 221)',
                                borderWidth: 1,
                                overflow: "hidden"
                            },
                            typeof props.dropdownContainerStyle != "undefined" ? props.dropdownContainerStyle : {},
                            typeof props.dropdownContainerStyle != "undefined" && typeof props.dropdownContainerStyle.width == "undefined" ? { width: dropdownWidth } : {},
                            visible ? { borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTopWidth: 0 } : {}
                        ]}
                        data={props.data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Pressable>
            </Modal>
        );
    };

    if (typeof selectedItem != 'undefined' && selectedItem != null) {
        defaultLabel = selectedItem.label;
    } else if (props.data != null && props.data.length > 0 && typeof props.data[props.defaultIndex] != 'undefined') {
        defaultLabel = props.data[props.defaultIndex].label;
    }

    let Chevron = ChevronUpSVG;
    if (visible) {
        Chevron = ChevronDownSVG;
    }
    return (
        <Pressable
            ref={DropdownButton}
            activeOpacity={1}
            style={[
                styles.button,
                typeof props.containerStyle != "undefined" ? props.containerStyle : {},
                visible ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {}
            ]}
            onPress={toggleDropdown}>
            {renderDropdown()}
            <View style={[{ flex: 1 }]}>
                <Text style={[
                    styles.buttonText,
                    typeof props.textStyle != "undefined" ? props.textStyle : {}
                ]}>{defaultLabel}</Text>
            </View>
            <View style={[
                {
                    marginRight: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20
                },
                typeof props.stickerStyle != "undefined" ? props.stickerStyle : {}
            ]}>
                <Chevron
                    width={typeof props.stickerStyle != "undefined" && typeof props.stickerStyle.width != "undefined" ? props.stickerStyle.width : 20}
                    color={typeof props.stickerStyle != "undefined" ? props.stickerStyle.color : 'rgb(221, 221, 221)'}
                />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    item: {
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderColor: 'rgb(221, 221, 221)',
        borderBottomWidth: 1
    },
    button: {
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderRadius: 4,
        borderColor: 'rgb(221, 221, 221)',
        borderWidth: 1
    },
    buttonText: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: "left",
        padding: 11.5,
        width: '100%'
    },
    overlay: {
        width: '100%',
        height: '100%'
    }
});

export default forwardRef(Dropdown);