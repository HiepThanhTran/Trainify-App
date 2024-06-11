import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import GlobalStyle from "../../styles/Style";
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Theme from "../../styles/Theme";
import Searchbar from "../../components/common/Searchbar"
import { useEffect, useState } from "react";
import { authAPI, endPoints } from '../../configs/APIs';
import { formatDate } from "../../utils/Utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ActivitySettings = () => {
    const [activityList, setActivityList] = useState([]);
    const [page, setPage] = useState(1);
    const [activityName, setActivityName] = useState('');

    const loadActivityList = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('access-token');
            let res = await authAPI(accessToken).get(endPoints['activities']);
            setActivityList(res.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadActivityList();
    });

    return (
        <View style={GlobalStyle.BackGround}>
            <ScrollView style={ActivitySettingStyle.Container}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <Searchbar
                    placeholder="Tìm kiếm hoạt động"
                />

                <View style={ActivitySettingStyle.Top}>
                    <Text style={ActivitySettingStyle.TitleTop}>Danh sách hoạt động</Text>
                    <TouchableOpacity>
                        <Ionicons name="add-circle" size={32} color={Theme.PrimaryColor} />
                    </TouchableOpacity>
                </View>

                <View style={ActivitySettingStyle.Middle}>
                    <TouchableOpacity style={ActivitySettingStyle.ButtonMiddle}>
                        <Text style={ActivitySettingStyle.ButtonMiddleText}>Tất cả</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[ActivitySettingStyle.ButtonMiddle, { marginLeft: 10 }]}>
                        <Text style={ActivitySettingStyle.ButtonMiddleText}>Tôi</Text>
                    </TouchableOpacity>
                </View>

                <View style={ActivitySettingStyle.Bottom}>
                    {activityList.map(activity => (
                        <TouchableOpacity key={activity.id} style={ActivitySettingStyle.Card}>
                            <Text style={ActivitySettingStyle.CardTitle}>{activity.name}</Text>
                            <View style={ActivitySettingStyle.CardDes}>
                                <View style={ActivitySettingStyle.Date}>
                                    <View style={ActivitySettingStyle.Item}>
                                        <AntDesign name="clockcircle" size={28} color="black" />
                                        <View style={ActivitySettingStyle.ItemDes}>
                                            <Text style={ActivitySettingStyle.ItemDesTitle}>Ngày bắt đầu</Text>
                                            <Text style={ActivitySettingStyle.ItemDesDate}>{formatDate(activity.start_date)}</Text>
                                        </View>
                                    </View>

                                    <View style={ActivitySettingStyle.Item}>
                                        <AntDesign name="clockcircle" size={28} color="black" />
                                        <View style={ActivitySettingStyle.ItemDes}>
                                            <Text style={ActivitySettingStyle.ItemDesTitle}>Ngày kết thúc</Text>
                                            <Text style={ActivitySettingStyle.ItemDesDate}>{formatDate(activity.end_date)}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={ActivitySettingStyle.Location}>
                                    <Ionicons name="location" size={30} color="black" />
                                    <Text style={ActivitySettingStyle.LocationDes}>Địa điểm: {activity.location}</Text>
                                </View>

                                <View style={ActivitySettingStyle.Create}>
                                    <View style={ActivitySettingStyle.UserCreate}>
                                        <Ionicons name="people" size={30} color="black" />
                                        <Text style={ActivitySettingStyle.UserCreateDes}>Người tạo: {activity.created_by.full_name}</Text>
                                    </View>
                                </View>
                            </View>
                            <View />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
};

const ActivitySettingStyle = StyleSheet.create({
    Container: {
        marginTop: 16,
        marginRight: 16,
        marginLeft: 16,
        marginBottom: 50
    },
    Top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    TitleTop: {
        fontFamily: Theme.Bold,
        fontSize: 22,
    },
    Middle: {
        flexDirection: 'row',
        marginTop: 15
    },
    ButtonMiddle: {
        borderWidth: 1,
        borderColor: '#d6d9de',
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    ButtonMiddleText: {
        fontFamily: Theme.SemiBold,
        fontSize: 16,
        color: 'gray'
    },
    Bottom: {
        marginTop: 25
    },
    Card: {
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        padding: 10,
        marginBottom: 20,
        borderRadius: 12
    },
    CardTitle: {
        fontFamily: Theme.Bold,
        fontSize: 22
    },
    CardDes: {
        marginTop: 10
    },
    Date:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    Item:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    ItemDes:{
        marginLeft: 8
    },
    ItemDesTitle:{
        fontFamily: Theme.SemiBold,
        fontSize: 16
    },
    ItemDesDate:{
        fontFamily: Theme.Bold,
        fontSize: 16
    },
    Location:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    LocationDes:{
        fontFamily: Theme.Bold,
        fontSize: 16,
        marginLeft: 8
    },
    Create:{
        marginTop: 10
    },
    UserCreate:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    UserCreateDes:{
        fontFamily: Theme.Bold,
        fontSize: 16,
        marginLeft: 8
    }
})

export default ActivitySettings;