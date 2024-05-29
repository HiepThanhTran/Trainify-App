import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BarChart } from 'react-native-gifted-charts';
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

    const [criterions, setCriterions] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [isRendered, setIsRendered] = useState(false);
    const sheetRef = useRef(BottomSheet);

    const initialBarData = [];
    const barData = [
        {
            label: 'Điều 1',
            value: 20,
            frontColor: Theme.PrimaryColor,
            spacing: 6,
            topLabelComponent: () => <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>20</Text>,
        },
        {
            value: 20,
            frontColor: Theme.MaxPointColor,
            topLabelComponent: () => <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>20</Text>,
        },

        {
            label: 'Điều 2',
            value: 25,
            frontColor: Theme.PrimaryColor,
            spacing: 6,
            topLabelComponent: () => <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>25</Text>,
        },
        {
            value: 25,
            frontColor: Theme.MaxPointColor,
            topLabelComponent: () => <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>20</Text>,
        },

        {
            label: 'Điều 3',
            value: 20,
            frontColor: Theme.PrimaryColor,
            spacing: 6,
            topLabelComponent: () => <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>20</Text>,
        },
        {
            value: 20,
            frontColor: Theme.MaxPointColor,
            topLabelComponent: () => <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>20</Text>,
        },

        {
            label: 'Điều 4',
            value: 25,
            frontColor: Theme.PrimaryColor,
            spacing: 6,
            topLabelComponent: () => <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>25</Text>,
        },
        {
            value: 25,
            frontColor: Theme.MaxPointColor,
            topLabelComponent: () => <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>20</Text>,
        },

        {
            label: 'Điều 5',
            value: 10,
            frontColor: Theme.PrimaryColor,
            spacing: 6,
            topLabelComponent: () => <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>10</Text>,
        },
        {
            value: 10,
            frontColor: Theme.MaxPointColor,
            topLabelComponent: () => <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>20</Text>,
        },

        {
            label: 'Điều 6',
            value: 10,
            frontColor: Theme.PrimaryColor,
            spacing: 6,
            topLabelComponent: () => <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>10</Text>,
        },
        {
            value: 10,
            frontColor: Theme.MaxPointColor,
            topLabelComponent: () => <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>20</Text>,
        },
    ];

    useEffect(() => {
        loadSemesters();
        loadCriterion();
        renderHeaderButton();
        setIsRendered(true)
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

    const loadCriterion = async () => {
        setLoading(true);
        try {
            let res = await APIs.get(endPoints['criterions']);

            if (res.status === Status.HTTP_200_OK) setCriterions(res.data);
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
    
    const loadDataOfChart = () => {};

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

    const renderChartTitle = () => {
        return (
            <View style={TrainingPointStyle.ChartTitle}>
                <Text style={TrainingPointStyle.ChartTitleText}>Tổng quan điểm rèn luyện</Text>
                <View style={TrainingPointStyle.ChartDetails}>
                    <View style={TrainingPointStyle.ChartDetailsWrap}>
                        <View style={{ ...TrainingPointStyle.ChartDetailsDot, backgroundColor: Theme.PrimaryColor }} />
                        <Text style={TrainingPointStyle.ChartDetailsText}>Điểm đã xác nhận</Text>
                    </View>
                    <View style={TrainingPointStyle.ChartDetailsWrap}>
                        <View style={{ ...TrainingPointStyle.ChartDetailsDot, backgroundColor: Theme.MaxPointColor }} />
                        <Text style={TrainingPointStyle.ChartDetailsText}>Điểm tối đa của điều</Text>
                    </View>
                </View>
            </View>
        );
    };

    if (!isRendered) return <Loading />;

    return (
        <GestureHandlerRootView>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleClosePress}>
                <View style={{ flex: 1 }}>
                    <View style={TrainingPointStyle.ChartContainer}>
                        {renderChartTitle()}
                        <View>
                            <BarChart
                                data={barData}
                                barStyle={{
                                }}
                                hideRules
                                height={140}
                                isAnimated
                                spacing={12}
                                barWidth={14}
                                labelWidth={40}
                                noOfSections={5}
                                barBorderTopLeftRadius={4}
                                barBorderTopRightRadius={4}
                                xAxisColor={'lightgray'}
                                yAxisColor={'lightgray'}
                                yAxisTextStyle={{ color: 'lightgray' }}
                                xAxisLabelTextStyle={{ color: 'lightgray', textAlign: 'center' }}
                            />
                        </View>
                    </View>

                    <BottomSheet
                        // index={!semester ? 1 : -1}
                        index={-1}
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
    ChartContainer: {
        backgroundColor: '#333340',
        paddingBottom: 40,
        borderRadius: 12,
        paddingHorizontal: 12,
        margin: 4,
    },
    ChartTitle: {
        marginTop: 32,
        marginBottom: 36,
    },
    ChartTitleText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    ChartDetails: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 24,
    },
    ChartDetailsWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ChartDetailsDot: {
        height: 12,
        width: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    ChartDetailsText: {
        height: 16,
        color: 'lightgray',
    },
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
        fontSize: 14,
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
