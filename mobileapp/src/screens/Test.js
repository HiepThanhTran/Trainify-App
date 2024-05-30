import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import APIs, { endPoints } from '../configs/APIs';
import { Status } from '../configs/Constants';

const Test = () => {
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        loadSemesters();
    }, []);

    const loadSemesters = async () => {
        try {
            let res = await APIs.get(endPoints['student-semesters'](321));

            if (res.status === Status.HTTP_200_OK) setSemesters(res.data);
        } catch (error) {
            if (error.response) {
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                console.error(error.request);
            } else {
                console.error(`Error message: ${error.message}`);
            }
        }
    };

    // hooks
    const sheetRef = useRef(BottomSheet);
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    // callbacks
    const handleSheetChange = useCallback((index) => {
        console.log('handleSheetChange', index);
    }, []);
    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);

    // render
    const renderItem = useCallback(
        (item) => (
            <TouchableOpacity>
                <View
                    style={{
                        // ...TrainingPointStyle.ItemContainer,
                        // ...(semester && semester.id === item?.id ? { backgroundColor: Theme.SecondaryColor } : null),
                    }}
                >
                    <Text
                        // style={TrainingPointStyle.ItemText}
                    >
                        {item?.original_name} - {item?.academic_year}
                    </Text>
                </View>
            </TouchableOpacity>
        ),
        [],
    );
    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
                <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
                <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
                <Button title="Close" onPress={() => handleClosePress()} />
                <BottomSheet ref={sheetRef} index={1} snapPoints={snapPoints} onChange={handleSheetChange}>
                    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                        {semesters.map(renderItem)}
                    </BottomSheetScrollView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 200,
    },
    contentContainer: {
        backgroundColor: 'white',
    },
    itemContainer: {
        padding: 6,
        margin: 6,
        backgroundColor: '#eee',
    },
});

export default Test;
