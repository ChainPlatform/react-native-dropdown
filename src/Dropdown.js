import {
    useImperativeHandle,
    useState,
    useRef,
    forwardRef,
    useEffect,
} from "react";
import {
    Pressable,
    TouchableWithoutFeedback,
    StyleSheet,
    Text,
    View,
    Modal,
    FlatList,
    Animated,
    Easing,
    Platform,
    TextInput,
    Dimensions,
} from "react-native";
import ChevronDownSVG from "./ChevronDownSVG";
import ChevronUpSVG from "./ChevronUpSVG";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const DROPDOWN_MAX_HEIGHT = 160;

const Dropdown = (props, ref) => {
    const {
        disabled = false,
        placeholder = "",
        data = [],
        keyField = "value",
        labelField = "label",
        defaultIndex = 0,
        containerStyle,
        textStyle,
        stickerStyle,
        dropdownContainerStyle,
        itemStyle,
        onSelect,
        searchable = false,
        searchInputStyle,
        searchContainerStyle,
        searchPlaceholder = "Search...",
        searchEmptyText = "No results found",
        nativeID,
        emptyList = {},
        emptyListText = {},
        multiple = false
    } = props;

    const DropdownButton = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelected] = useState(undefined);
    const [selectedItems, setSelectedItems] = useState([]);
    const [dropdownTop, setDropdownTop] = useState(0);
    const [dropdownLeft, setDropdownLeft] = useState(0);
    const [dropdownWidth, setDropdownWidth] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [openUpwards, setOpenUpwards] = useState(false);

    const dropdownAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (disabled && modalVisible) {
            closeDropdownImmediate();
        }
    }, [disabled]);

    useEffect(() => {
        if (multiple) {
            if (Array.isArray(defaultIndex)) {
                const selectedDefaults = defaultIndex
                    .map(i => data[i])
                    .filter(Boolean);
                setSelectedItems(selectedDefaults);
            } else if (typeof defaultIndex === "number") {
                if (data[defaultIndex]) {
                    setSelectedItems([data[defaultIndex]]);
                } else {
                    setSelectedItems([]);
                }
            } else {
                setSelectedItems([]);
            }
        } else {
            if (data[defaultIndex]) {
                setSelected(prev => prev ?? data[defaultIndex]);
            } else {
                setSelected(undefined);
            }
        }
    }, [data, defaultIndex]);

    const filteredData = searchable
        ? data.filter((item) =>
            item?.[labelField].toLowerCase().includes(searchText.toLowerCase())
        )
        : data;

    useImperativeHandle(ref, () => ({
        setIndex: (index) => {
            if (disabled) return;
            if (data[index]) {
                setSelected(data[index]);
            }
        },
    }));

    const openDropdown = () => {
        if (disabled) return;

        DropdownButton?.current?.measure?.((_fx, _fy, _w, h, _px, py) => {
            if (disabled) return;

            const borderWidth = dropdownContainerStyle?.borderWidth ?? 1;
            const width = dropdownContainerStyle?.width ?? _w;

            const spaceBelow = SCREEN_HEIGHT - (py + h);
            const estimatedDropdownHeight = dropdownContainerStyle?.height ?? DROPDOWN_MAX_HEIGHT;

            let willOpenUpwards = false;
            let dropdownTopPosition = 0;

            if (spaceBelow < estimatedDropdownHeight) {
                willOpenUpwards = true;
                dropdownTopPosition = py - estimatedDropdownHeight + (h / 2);
                if (dropdownTopPosition < 0) {
                    dropdownTopPosition = 0;
                }
            } else {
                willOpenUpwards = false;
                dropdownTopPosition = py + h - borderWidth;
            }

            setDropdownWidth(width);
            setDropdownTop(dropdownTopPosition);
            setDropdownLeft(_px);
            setOpenUpwards(willOpenUpwards);

            setSearchText("");
            setModalVisible(true);

            Animated.timing(dropdownAnim, {
                toValue: 1,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: Platform.OS !== "web",
            }).start();
        });
    };

    const closeDropdown = () => {
        Animated.timing(dropdownAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: Platform.OS !== "web",
        }).start(() => {
            setModalVisible(false);
        });
    };

    const closeDropdownImmediate = () => {
        dropdownAnim.setValue(0);
        setModalVisible(false);
    };

    const toggleDropdown = () => {
        if (disabled) return;

        if (modalVisible) {
            closeDropdown();
        } else {
            openDropdown();
        }
    };

    const onItemPress = (index, item) => {
        if (disabled) return;

        if (multiple) {
            const isEmptyValue = item?.[keyField] === "";

            let updated = [];

            if (isEmptyValue) {
                updated = [item];
            } else {
                updated = selectedItems.filter(x => x[keyField] !== "");

                const exists = updated.some(
                    (x) => x?.[keyField] === item?.[keyField]
                );

                if (exists) {
                    updated = updated.filter(
                        (x) => x?.[keyField] !== item?.[keyField]
                    );
                } else {
                    updated = [...updated, item];
                }
            }

            setSelectedItems(updated);
            onSelect?.(updated);
            return;
        }

        setSelected(item);
        onSelect?.(index, item);
        closeDropdown();
    };

    const renderItem = ({ index, item }) => {
        const isSelected = multiple
            ? selectedItems.some(x => x[keyField] === item[keyField])
            : selectedItem?.[keyField] === item?.[keyField] ||
            (selectedItem == null && defaultIndex === index && !multiple);

        return (
            <Pressable
                style={[
                    styles.item,
                    itemStyle,
                    {
                        backgroundColor: isSelected
                            ? "rgb(221, 221, 221)"
                            : "#FFFFFF",
                    },
                    index === filteredData.length - 1
                        ? { borderBottomWidth: 0 }
                        : {},
                ]}
                onPress={() => onItemPress(index, item)}
            >
                <Text style={[styles.buttonText, textStyle]}>
                    {item?.[labelField]}
                </Text>
            </Pressable>
        );
    };

    const dropdownTranslateY = dropdownAnim.interpolate({
        inputRange: [0, 1],
        outputRange: openUpwards ? [10, 0] : [-10, 0],
    });

    const dropdownOpacity = dropdownAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const renderDropdown = () => (
        <Modal visible={modalVisible && !disabled} transparent animationType="none">
            <View style={styles.modalOverlayContainer}>
                <TouchableWithoutFeedback onPress={closeDropdown}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[
                        styles.container(dropdownTop, dropdownLeft, dropdownWidth, dropdownTranslateY, dropdownOpacity),
                        dropdownContainerStyle,
                        modalVisible ? (openUpwards ? {
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            borderBottomWidth: 0
                        } : {
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            borderTopWidth: 0
                        }) : {},
                    ]}
                >
                    {!openUpwards && searchable && (
                        <View style={[styles.searchContainer, searchContainerStyle, { borderTopWidth: 0 }]}>
                            <TextInput
                                style={[styles.searchInput, searchInputStyle]}
                                nativeID={"search_modal_" + nativeID}
                                placeholder={searchPlaceholder}
                                placeholderTextColor={"rgb(221, 221, 221)"}
                                value={searchText}
                                onChangeText={setSearchText}
                                autoCorrect={false}
                                autoCapitalize="none"
                                clearButtonMode="while-editing"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    )}

                    <FlatList
                        data={filteredData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ flexGrow: 0 }}
                        keyboardShouldPersistTaps="handled"
                        ListEmptyComponent={() => (
                            <View style={[styles.emptyList, emptyList]}>
                                <Text style={[styles.emptyListText, emptyListText]}>
                                    {searchEmptyText}
                                </Text>
                            </View>
                        )}
                    />

                    {openUpwards && searchable && (
                        <View style={[styles.searchContainer, searchContainerStyle, { borderBottomWidth: 0 }]}>
                            <TextInput
                                style={[styles.searchInput, searchInputStyle]}
                                nativeID={"search_modal_" + nativeID}
                                placeholder={searchPlaceholder}
                                placeholderTextColor={"rgb(221, 221, 221)"}
                                value={searchText}
                                onChangeText={setSearchText}
                                autoCorrect={false}
                                autoCapitalize="none"
                                clearButtonMode="while-editing"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );

    let currentLabel = placeholder;
    if (multiple) {
        if (selectedItems.length === 0) {
            currentLabel = placeholder;
        } else {
            const emptyItem = selectedItems.find(x => x[keyField] === "");
            if (emptyItem) {
                currentLabel = emptyItem[labelField];
            } else {
                currentLabel = selectedItems.map(x => x[labelField]).join(", ");
            }
        }
    } else {
        if (selectedItem) {
            currentLabel = selectedItem[labelField];
        } else if (data[defaultIndex]) {
            currentLabel = data[defaultIndex][labelField];
        }
    }

    const Chevron = modalVisible ? ChevronDownSVG : ChevronUpSVG;

    return (
        <>
            <Pressable
                ref={DropdownButton}
                pointerEvents={disabled ? "none" : "auto"}
                disabled={disabled}
                onPress={toggleDropdown}
                style={[
                    styles.button,
                    containerStyle,
                    modalVisible ? (!openUpwards ? {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0
                    } : {
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0
                    }) : {},
                    disabled ? styles.disabledButton : {},
                ]}
            >
                <View style={{ flex: 1 }}>
                    <Text style={[styles.buttonText, textStyle]}>{currentLabel}</Text>
                </View>

                <View style={[styles.stickerStyle, stickerStyle]}>
                    <Chevron
                        width={stickerStyle?.width ?? 20}
                        color={
                            disabled
                                ? "#bbbbbb"
                                : stickerStyle?.color ?? "rgb(221,221,221)"
                        }
                    />
                </View>
            </Pressable>
            {renderDropdown()}
        </>
    );
};

const styles = StyleSheet.create({
    item: {
        zIndex: 10,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderColor: "rgb(221, 221, 221)",
        borderBottomWidth: 1
    },
    button: {
        zIndex: 10,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderRadius: 4,
        borderColor: "rgb(221, 221, 221)",
        borderWidth: 1,
        overflow: "hidden",
        backgroundColor: "white"
    },
    disabledButton: {
        opacity: 0.45
    },
    buttonText: {
        fontSize: 13,
        fontWeight: "600",
        textAlign: "left",
        padding: 11.5,
        width: "100%"
    },
    searchContainer: {
        padding: 10,
        borderColor: "rgb(221, 221, 221)",
        borderBottomWidth: 1,
        backgroundColor: "white"
    },
    searchInput: {
        paddingHorizontal: 10,
        borderColor: "rgb(221, 221, 221)",
        borderBottomWidth: 1,
        fontSize: 14,
        backgroundColor: "white"
    },
    modalOverlayContainer: {
        flex: 1,
        backgroundColor: "transparent"
    },
    overlay: {
        flex: 1
    },
    container: (dropdownTop, dropdownLeft, dropdownWidth, dropdownTranslateY, dropdownOpacity) => ({
        position: "absolute",
        top: dropdownTop,
        left: dropdownLeft,
        maxHeight: DROPDOWN_MAX_HEIGHT,
        borderRadius: 4,
        borderColor: "rgb(221, 221, 221)",
        borderWidth: 1,
        overflow: "hidden",
        width: dropdownWidth,
        maxWidth: dropdownWidth,
        transform: [{ translateY: dropdownTranslateY }],
        opacity: dropdownOpacity,
        zIndex: 10,
        backgroundColor: "white"
    }),
    stickerStyle: {
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
        width: 20,
        height: 20
    },
    emptyList: {
        padding: 18,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    emptyListText: {
        fontSize: 14,
        fontStyle: "italic",
        color: "#999",
    }
});

export default forwardRef(Dropdown);
