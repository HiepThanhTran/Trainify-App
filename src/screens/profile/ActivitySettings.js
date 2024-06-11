import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
    
    const loadActivityList = async() => {
        try{
            const accessToken = await AsyncStorage.getItem('access-token');
            let res = await authAPI(accessToken).get(endPoints['activities']);
            setActivityList(res.data.results);
        }catch(error){
            console.error(error);
        }
    };

    useEffect(() => {
        loadActivityList();
    });

    return(
        <View style={GlobalStyle.BackGround}>
            <View style={ActivitySettingStyle.Container}>
                <Searchbar
                    placeholder="Tìm kiếm hoạt động"
                />

                <View style={ActivitySettingStyle.Top}>
                    <Text style={ActivitySettingStyle.TitleTop}>Danh sách hoạt động</Text>
                    <TouchableOpacity>
                        <FontAwesome name="plus-square" size={32} color={Theme.PrimaryColor} />
                    </TouchableOpacity>
                </View>

                <View style={ActivitySettingStyle.Middle}>
                    <TouchableOpacity style={ActivitySettingStyle.ButtonMiddle}>
                        <Text style={ActivitySettingStyle.ButtonMiddleText}>Tất cả</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[ActivitySettingStyle.ButtonMiddle, {marginLeft: 10}]}>
                        <Text style={ActivitySettingStyle.ButtonMiddleText}>Của tôi</Text>
                    </TouchableOpacity>
                </View>

                <View style={ActivitySettingStyle.Bottom}>
                    {activityList.map(activity => (
                        <View key={activity.id} style={ActivitySettingStyle.Card}>
                            <Text style={ActivitySettingStyle.CardTitle}>{activity.name}</Text>
                            <View style={ActivitySettingStyle.CardDes}>
                                <View style={ActivitySettingStyle.CardDate}>
                                    <View style={ActivitySettingStyle.CardDateItem}>
                                        <AntDesign name="clockcircle" size={32} color="black" />
                                        <View style={ActivitySettingStyle.DateDes}>
                                            <Text style={ActivitySettingStyle.DateDesTitle}>Ngày bắt đầu:</Text>
                                            <Text style={ActivitySettingStyle.Date}>{formatDate(activity.start_date)}</Text>
                                        </View>
                                    </View>

                                    <View style={ActivitySettingStyle.CardDateItem}>
                                        <AntDesign name="clockcircle" size={32} color="black" />
                                        <View style={ActivitySettingStyle.DateDes}>
                                            <Text style={ActivitySettingStyle.DateDesTitle}>Ngày kết thúc:</Text>
                                            <Text style={ActivitySettingStyle.Date}>{formatDate(activity.end_date)}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={ActivitySettingStyle.CardLocation}>
                                    <Ionicons name="location" size={30} color="black" />
                                    <Text style={ActivitySettingStyle.CardLocationTitle}>Địa điểm: {activity.location}</Text>
                                </View>

                                <View style={ActivitySettingStyle.Create}>
                                    <MaterialIcons name="people-alt" size={32} color="black" />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )
};

const ActivitySettingStyle = StyleSheet.create({
    Container:{
        marginTop: 16,
        marginRight: 16,
        marginLeft: 16,
        marginBottom: 50
    },
    Top:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    TitleTop:{
        fontFamily: Theme.Bold,
        fontSize: 20
    },
    Middle:{
        flexDirection: 'row',
        marginTop: 15
    },
    ButtonMiddle:{
        borderWidth: 1.5,
        borderColor: 'black',
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    ButtonMiddleText:{
        fontFamily: Theme.Bold,
        fontSize: 16
    },
    Bottom:{
        marginTop: 20
    },
    Card:{
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        padding: 10,
        marginBottom: 20,
        borderRadius: 12
    },
    CardTitle:{
        fontFamily: Theme.Bold,
        fontSize: 20
    },
    CardDate:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    CardDateItem:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    DateDes:{
        marginLeft: 8
    },
    DateDesTitle:{
        fontFamily: Theme.SemiBold,
        fontSize: 16
    },
    Date:{
        fontFamily: Theme.Bold,
        fontSize: 16
    },
    CardLocation:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    CardLocationTitle:{
        fontFamily: Theme.Bold,
        fontSize: 18
    },
    Create:{
        marginTop: 10
    }
})

export default ActivitySettings;