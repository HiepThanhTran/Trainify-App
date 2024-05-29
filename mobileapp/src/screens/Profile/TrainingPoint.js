import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import Loading from '../../components/Loading';
import APIs, { endPoints } from '../../configs/APIs';
import { Status } from '../../configs/Constants';
import { useAccount } from '../../store/contexts/AccountContext';
import { useGlobalContext } from '../../store/contexts/GlobalContext';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';

const TrainingPoint = ({ navigation }) => {
    const { semester, setSemester, loading, setLoading } = useGlobalContext();
    const currentAccount = useAccount();

    const [semesters, setSemesters] = useState();
    const sheetRef = useRef(BottomSheet);

    useEffect(() => {
        loadSemesters();
        renderHeaderButton();
    }, [navigation]);

    const loadSemesters = async () => {
        setLoading(true);
        try {
            let res = await APIs.get(endPoints['student-semesters'](currentAccount.data.user.id));

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
        } finally {
            setLoading(false);
        }
    };

    const handleClosePress = () => {
        sheetRef?.current.close();
    };

    const handleChooseSemester = (semesterId) => {
        setSemester(semesterId);
        handleClosePress();
    };

    const renderSemester = ({ item }) => (
        <TouchableOpacity onPress={() => handleChooseSemester(item.id)}>
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
    );

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

    if (loading) return <Loading />;

    return (
        <GestureHandlerRootView>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleClosePress}>
                <View style={GlobalStyle.Container}>
                    <View>
                        <Text>Training Point Screen</Text>
                    </View>

                    <BottomSheet
                        index={!semester ? 1 : -1}
                        ref={sheetRef}
                        snapPoints={['25%', '50%', '90%']}
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
        justifyContent: 'center',
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
        fontFamily: Theme.Bold,
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
        borderBottomWidth: 2,
        borderColor: '#eee',
    },
    ItemText: {
        fontSize: 20,
        padding: 8,
        fontFamily: Theme.SemiBold,
    },
});

export default TrainingPoint;
