import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import APIs, { endPoints } from '../../configs/APIs';
import { status } from '../../configs/Constants';
import { useGlobalContext } from '../../store/contexts/GlobalContext';

const TrainingPoint = () => {
    const { semester, setSemester } = useGlobalContext();
    const [semesters, setSemesters] = useState();
    const snapPoints = useMemo(() => ['25%', '50%'], []);
    const sheetRef = useRef(BottomSheet);

    useEffect(() => {
        loadSemesters();
    }, []);

    const loadSemesters = async () => {
        try {
            let res = await APIs.get(endPoints['semesters']);

            if (res.status === status.HTTP_200_OK) setSemesters(res.data);
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

    // const handleSnapPress = useCallback((index) => {
    //     sheetRef.current?.snapToIndex(index);
    // }, []);
    // const handleClosePress = useCallback(() => {
    //     sheetRef.current?.close();
    // }, []);

    const renderSemester = useCallback(
        ({ item }) => (
            <TouchableOpacity>
                <View style={styles.itemContainer}>
                    <Text>
                        {item.original_name} {item.academic_year}
                    </Text>
                </View>
            </TouchableOpacity>
        ),
        [],
    );

    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <Button title="Close" onPress={() => handleClosePress()} />
                <BottomSheet index={!semester ? 1 : -1} ref={sheetRef} snapPoints={snapPoints} enablePanDownToClose={true}>
                    <BottomSheetFlatList
                        data={semesters}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderSemester}
                        contentContainerStyle={styles.contentContainer}
                    />
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
};

const TrainingPointStyle = StyleSheet.create({});

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

export default TrainingPoint;
