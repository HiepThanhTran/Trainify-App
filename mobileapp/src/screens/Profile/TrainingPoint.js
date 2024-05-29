import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import APIs, { endPoints } from '../../configs/APIs';
import { status } from '../../configs/Constants';
import { useGlobalContext } from '../../store/contexts/GlobalContext';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';

const TrainingPoint = ({ navigation }) => {
    const { semester, setSemester } = useGlobalContext();
    const [semesters, setSemesters] = useState();
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
    const sheetRef = useRef(BottomSheet);

    useEffect(() => {
        loadSemesters();
        renderHeaderButton();
    }, [navigation]);

    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);

    const renderSemester = useCallback(
        ({ item }) => (
            <TouchableOpacity onPress={() => setSemester(item.id)}>
                <View
                    style={{
                        ...TrainingPointStyle.ItemContainer,
                        ...(semester === item.id ? { backgroundColor: Theme.SecondaryColor } : null),
                    }}
                >
                    <Text style={TrainingPointStyle.ItemText}>
                        {item.original_name} - {item.academic_year}
                    </Text>
                </View>
            </TouchableOpacity>
        ),
        [semester],
    );

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

    const renderHeaderButton = () => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => sheetRef.current?.snapToIndex(1)}
                    style={{ ...GlobalStyle.Center, ...GlobalStyle.HeaderButton }}
                >
                    <Text style={GlobalStyle.HeaderButtonText}>Học kỳ</Text>
                </TouchableOpacity>
            ),
        });
    };

    return (
        <GestureHandlerRootView>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleClosePress}>
                <View style={GlobalStyle.Container}>
                    <View>
                        <Text>TEST</Text>
                    </View>

                    <BottomSheet
                        index={!semester ? 1 : -1}
                        ref={sheetRef}
                        snapPoints={snapPoints}
                        enablePanDownToClose={true}
                        handleStyle={{ display: 'none' }}
                    >
                        <View style={TrainingPointStyle.HandleContainer}>
                            <View style={TrainingPointStyle.HandleHeader}>
                                <Text style={TrainingPointStyle.HandleHeaderText}>Chọn học kỳ cần xem thống kê</Text>
                            </View>
                            <View style={TrainingPointStyle.HandleButton}>
                                <Button textColor="white" onPress={handleClosePress}>
                                    <Text style={TrainingPointStyle.HandleButtonText}>Đóng</Text>
                                </Button>
                            </View>
                        </View>
                        <BottomSheetFlatList
                            data={semesters}
                            extraData={semester}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderSemester}
                            contentContainerStyle={{ backgroundColor: 'white' }}
                        />
                    </BottomSheet>
                </View>
            </TouchableOpacity>
        </GestureHandlerRootView>
    );
};

const TrainingPointStyle = StyleSheet.create({
    HandleContainer: {
        flexDirection: 'row',
        overflow: 'hidden',
        paddingVertical: 20,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: Theme.PrimaryColor,
    },
    HandleHeader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    HandleHeaderText: {
        color: 'white',
        fontSize: 16,
        fontFamily: Theme.SemiBold,
    },
    HandleButton: {
        position: 'absolute',
        right: 8,
        color: 'white',
    },
    HandleButtonText: {
        fontSize: 16,
        fontFamily: Theme.Bold,
    },
    ItemContainer: {
        padding: 12,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
    },
    ItemText: {
        fontSize: 20,
        padding: 8,
        fontFamily: Theme.SemiBold,
    },
});

export default TrainingPoint;
