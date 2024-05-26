import { View, Text, ActivityIndicator, Image, ScrollView } from "react-native";
import GlobalStyle from "../../styles/Style";
import { useState, useEffect } from "react";
import APIs, { endPoints } from "../../configs/APIs";
import ActivityStyle from "./ActivityStyle";
import Theme from "../../styles/Theme";
import RenderHTML from "react-native-render-html";
import { Dimensions } from "react-native";
import { formatDate } from "../Utils/Utils";

const screenWidth = Dimensions.get('window').width;

const ActivityDetail = ({ route }) => {
    const [activitydetail, setActivityDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const activityID = route?.params?.activityID;

    const loadActivityDetail = async () => {
        try {
            setLoading(true);
            let res = await APIs.get(endPoints['activity-detail'](activityID));
            setActivityDetail(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (activityID) {
            loadActivityDetail();
        }
    }, [activityID]);
    
    return (
        <>
            {loading ? (
                <View style={GlobalStyle.Container}>
                    <ActivityIndicator size="large" color={Theme.PrimaryColor} />
                </View>
            ) : (
                <View style={GlobalStyle.BackGround}>
                    <View style={{ marginHorizontal: 12 }}>
                        <ScrollView key={activitydetail.id}>
                            <View style={ActivityStyle.ActivityDes}>
                                <View style={ActivityStyle.ActivityCardImage}>
                                    <Image
                                        source={{ uri: activitydetail.image }}
                                        style={ActivityStyle.ActivityImageDetail}
                                    />
                                </View>
                                <RenderHTML
                                    contentWidth={screenWidth}
                                    source={{ html: activitydetail.description }}
                                    baseStyle={ActivityStyle.ActivityContentDetail}
                                />
                                <Text style={ActivityStyle.Text}>Đối tượng tham gia: {activitydetail.participant}</Text>
                                <Text style={ActivityStyle.Text}>Địa điểm: {activitydetail.location}</Text>
                                <Text style={[ActivityStyle.Text, ActivityStyle.Point]}>
                                    Điểm cộng: {activitydetail.point}, {activitydetail.criterion}
                                </Text>
                                <Text style={ActivityStyle.Text}>{activitydetail.semester}</Text>
                                <Text style={ActivityStyle.Text}>Khoa: {activitydetail.faculty}</Text>
                                <Text style={ActivityStyle.ActivityStartDate}>
                                    Ngày bắt đầu: {activitydetail.start_date}
                                </Text>
                                <Text style={ActivityStyle.ActivityEndDate}>
                                    Ngày kết thúc: {activitydetail.end_date}
                                </Text>
                                <Text style={ActivityStyle.ActivityCreateDate}>
                                    Ngày tạo: <Text>{formatDate(activitydetail.created_date)}</Text>
                                </Text>
                                <Text style={ActivityStyle.ActivityUpdateDate}>
                                    Ngày cập nhập: <Text>{formatDate(activitydetail.updated_date)}</Text>
                                </Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}
        </>
    );
}

export default ActivityDetail;