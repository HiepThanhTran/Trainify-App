import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, RefreshControl } from "react-native";
import GlobalStyle from "../../styles/Style";
import { MaterialIcons } from '@expo/vector-icons';
import { endPoints, authAPI } from "../../configs/APIs";
import Theme from "../../styles/Theme";
import { useEffect, useState, useCallback } from "react";
import { useAccount } from "../../store/contexts/AccountContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { statusCode } from "../../configs/Constants";
import Searchbar from "../../components/common/Searchbar"
import RenderHTML from "react-native-render-html";
import { screenWidth } from "react-native-gifted-charts/src/utils";
import { search, isCloseToBottom, loadMore, onRefresh } from "../../utils/Utilities";
import Loading from "../../components/common/Loading";

const ActivitySettings = ({navigation}) => {
    const currentUser = useAccount();
    const currentUserID = currentUser.data.user.id;
    const [activityUserCreate, setActivityUserCreate] = useState([]);
    const [page, setPage] = useState(1);
    const [activityName, setActivityName] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadActivityUserCreate = async () => {
        if (page <= 0) return;
        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('access-token');
            let res = await authAPI(accessToken).get(endPoints['activities'], {
                params: { organizer_id: currentUserID, page, name: activityName }
            })
            if (res.data.next === null) setPage(0);
            if (res.status === statusCode.HTTP_200_OK)
                setActivityUserCreate(page === 1 ? res.data.results : [...activityUserCreate, ...res.data.results]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadActivityUserCreate();
    }, [currentUserID, page, activityName, refreshing]);

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        if (isCloseToBottom({ layoutMeasurement, contentOffset, contentSize })) {
            loadMore(event.nativeEvent, loading, page, setPage);
        }
    }

    const goToCreateActivityForm = () => {
        navigation.navigate('CreateActivityForm')
    }

    const gotoUpdateAndDeleteActivity = (activityUserCreateID) => {
        navigation.navigate('UpdateAndDeleteActivity', {
            screen: 'UpdateAndDeleteActivity',
            params: { activityUserCreateID }
        })
    }

    return (
        <View style={GlobalStyle.BackGround}>
            <View style={ActivitySettingStyle.Container}>
                <Searchbar
                    placeholder="Tìm kiếm hoạt động"
                    value={activityName}
                    onChangeText={(value) => search(value, setPage, setActivityName)}
                />

                <View style={ActivitySettingStyle.Alignment}>
                    <Text style={ActivitySettingStyle.Text}>Danh sách hoạt động</Text>
                    <TouchableOpacity style={ActivitySettingStyle.AddActivity} onPress={goToCreateActivityForm}>
                        <MaterialIcons name="assignment-add" size={36} color={Theme.PrimaryColor} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={ActivitySettingStyle.Content}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => onRefresh({setPage, setRefreshing, setFilter: setActivityName})}
                        />
                    }
                >
                    {!refreshing && loading && page === 1 && <Loading />}
                    {activityUserCreate.map(activity => (
                        <View key={activity.id} style={ActivitySettingStyle.Card}>
                            <View style={ActivitySettingStyle.CardImage}>
                                <Image source={{ uri: activity.image }} style={ActivitySettingStyle.Image} />
                            </View>

                            <View style={ActivitySettingStyle.CardDes}>
                                <Text style={ActivitySettingStyle.CardDesName}>{activity.name}</Text>
                                <RenderHTML
                                    contentWidth={screenWidth}
                                    source={{ html: activity.description }}
                                    defaultTextProps={{
                                        numberOfLines: 3,
                                        ellipsizeMode: 'tail',
                                    }}
                                    baseStyle={ActivitySettingStyle.Des}
                                />
                            </View>

                            <TouchableOpacity style={ActivitySettingStyle.WatchDetailContainer} onPress={() => gotoUpdateAndDeleteActivity(activity.id)}>
                                <Text style={ActivitySettingStyle.WatchDetailTitle}>Xem chi tiết</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    {loading && page > 1 && <Loading />}
                </ScrollView>
            </View>
        </View>
    )
};

const ActivitySettingStyle = StyleSheet.create({
    Container: {
        marginTop: 20,
        marginRight: 16,
        marginLeft: 16,
        marginBottom: 130
    },
    Alignment: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    Text: {
        fontFamily: Theme.Bold,
        fontSize: 18
    },
    AddActivity: {
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        borderRadius: 8
    },
    Content: {
        marginTop: 25
    },
    Card: {
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 12,
        marginBottom: 20,
    },
    CardImage: {
        height: 100
    },
    Image: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    CardDes: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10
    },
    CardDesName: {
        fontFamily: Theme.Bold,
        fontSize: 25,
        marginBottom: 10
    },
    Des: {
        fontFamily: Theme.SemiBold,
        fontSize: 18,
        lineHeight: 25
    },
    WatchDetailContainer:{
        marginLeft: 20,
        marginBottom: 20
    },
    WatchDetailTitle:{
        fontFamily: Theme.Bold,
        fontSize: 16,
        color: Theme.PrimaryColor
    }
})

export default ActivitySettings;