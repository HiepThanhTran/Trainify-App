import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import GlobalStyle from "../../styles/Style";
import { MaterialIcons } from '@expo/vector-icons';
import { endPoints, authAPI } from "../../configs/APIs";
import Theme from "../../styles/Theme";
import { formatDate } from "../../utils/Utilities";
import { useEffect, useState } from "react";
import { useAccount } from "../../store/contexts/AccountContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { statusCode } from "../../configs/Constants";
import Searchbar from "../../components/common/Searchbar"
import RenderHTML from "react-native-render-html";
import { screenWidth } from "react-native-gifted-charts/src/utils";

const ActivitySettings = () => {
    const currentUser = useAccount();
    const currentUserID = currentUser.data.user.id;
    const [activityUserCreate, setActivityUserCreate] = useState([]);
    const [page, setPage] = useState(1);
    const [activityName, setActivityName] = useState('');
    const [loading, setLoading] = useState(false);
    const [refresing, setRefreshing] = useState(false);
    
    const loadActivityUserCreate = async() => {
        if(page<=0) return;
        setLoading(true);
        try{
            const accessToken = await AsyncStorage.getItem('access-token');
            let res = await authAPI(accessToken).get(endPoints['activities'],{
                params: {organizer_id: currentUserID, page, name: activityName}
            })
            if(res.data.next===null) setPage(0);
            if(res.status === statusCode.HTTP_200_OK)
                setActivityUserCreate(page === 1 ? res.data.results : [...activityUserCreate, ...res.data.results]);
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadActivityUserCreate();
    },[currentUserID, page, activityName]);

    return(
        <View style={GlobalStyle.BackGround}>
            <View style={ActivitySettingStyle.Container}>
                <Searchbar
                    placeholder="Tìm kiếm hoạt động"
                />

                <View style={ActivitySettingStyle.Alignment}>
                    <Text style={ActivitySettingStyle.Text}>Danh sách hoạt động</Text>
                    <TouchableOpacity style={ActivitySettingStyle.AddActivity}>
                        <MaterialIcons name="assignment-add" size={36} color={Theme.PrimaryColor} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={ActivitySettingStyle.Content}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {activityUserCreate.map(activity => (
                        <View style={ActivitySettingStyle.Card}>
                            <View style={ActivitySettingStyle.Top}>
                                <View style={ActivitySettingStyle.CardImage}>
                                    <Image source={{uri: activity.image}} style={ActivitySettingStyle.Image}/>
                                </View>

                                <View style={[ActivitySettingStyle.CardPoint, ActivitySettingStyle.Shadow]}>
                                    <Text style={ActivitySettingStyle.CardPointTitle}>Điểm</Text>
                                    <Text style={ActivitySettingStyle.Point}>{activity.point}</Text>
                                </View>
                            </View>

                            <View style={ActivitySettingStyle.CardDes}>
                                <Text style={ActivitySettingStyle.CardDesName}>{activity.name}</Text>
                                <RenderHTML
                                    contentWidth={screenWidth}
                                    source={{html: activity.description}}
                                    defaultTextProps={{
                                        numberOfLines: 3,
                                        ellipsizeMode: 'tail',
                                     }}
                                    baseStyle={ActivitySettingStyle.Des}
                                />
                            </View>

                            <View style={ActivitySettingStyle.CardButton}>
                                <TouchableOpacity style={ActivitySettingStyle.Button}>
                                    <Text style={ActivitySettingStyle.ButtonText}>Chỉnh sửa</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={ActivitySettingStyle.Button}>
                                    <Text style={ActivitySettingStyle.ButtonText}>Xóa</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
};

const ActivitySettingStyle = StyleSheet.create({
    Container:{
        marginTop: 20,
        marginRight: 16,
        marginLeft: 16,
        marginBottom: 130
    },
    Alignment:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    Shadow:{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    Text:{
        fontFamily: Theme.Bold,
        fontSize: 18
    },
    AddActivity:{
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        borderRadius: 8
    },
    Content:{
        marginTop: 25
    },
    Card:{
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden'
    },
    Top:{
        position: 'relative',
    },
    CardImage:{
        height: 100
    },
    Image:{
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    CardPoint:{
        borderWidth : 1,
        borderColor: '#e1e1e1',
        position: 'absolute',
        bottom: -35,
        left: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        width: 75,
        height: 70,
    },
    CardPointTitle:{
        fontFamily: Theme.SemiBold,
        fontSize: 16
    },
    Point:{
        fontFamily: Theme.Bold,
        fontSize: 25,
        color: Theme.PrimaryColor
    },
    CardDes:{
        marginTop: 55,
        marginLeft: 20,
        marginBottom: 10
    },
    CardDesName:{
        fontFamily: Theme.Bold,
        fontSize: 25,
        marginBottom: 10
    },
    Des:{
        fontFamily: Theme.SemiBold,
        fontSize: 18,
        lineHeight: 25
    },
    CardButton:{
        flexDirection: 'row',
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 20
    },
    Button:{
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        backgroundColor: Theme.PrimaryColor,
        borderRadius: 8
    },
    ButtonText:{
        fontFamily: Theme.Bold,
        fontSize: 16,
        color: 'white'
    }
})

export default ActivitySettings;