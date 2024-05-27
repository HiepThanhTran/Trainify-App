import { View, Text, ActivityIndicator, Image, ScrollView } from "react-native";
import GlobalStyle from "../../styles/Style";
import { useState, useEffect } from "react";
import APIs, { endPoints } from "../../configs/APIs";
import Theme from "../../styles/Theme";
import RenderHTML from "react-native-render-html";
import { Dimensions } from "react-native";
import { formatDate } from "../Utils/Utils";
import AllStyle from "./AllStyle";

const screenWidth = Dimensions.get('window').width;

const ActivityDetail = ({ route }) => {
    const [activitydetail, setActivityDetail] = useState(null);
    const [activitydetailloading, setActivityDetailLoading] = useState(true);
    const activityID = route?.params?.activityID;

    const loadActivityDetail = async () => {
        try {
            setActivityDetailLoading(true);
            let res = await APIs.get(endPoints['activity-detail'](activityID));
            setActivityDetail(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setActivityDetailLoading(false);
        }
    };

    useEffect(() => {
        loadActivityDetail();
    }, [activityID]);

    return (
        <>
            {activitydetailloading ? (
                <View style={GlobalStyle.Container}>
                    <ActivityIndicator size="large" color={Theme.PrimaryColor} />
                </View>
            ) : (
                <View style={GlobalStyle.BackGround}>
                    <View style={AllStyle.ContainerScreenDetail}>
                        <ScrollView 
                            key={activitydetail?.id}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={AllStyle.Description}>
                                <View style={AllStyle.CardImage}>
                                    <Image
                                        source={{ uri: activitydetail.image }}
                                        style={AllStyle.ImageDetail}
                                    />
                                </View>
                                <RenderHTML
                                    contentWidth={screenWidth}
                                    source={{ html: activitydetail.description }}
                                    baseStyle={AllStyle.ContentDetail}
                                />
                                <Text style={AllStyle.AcitivityDetailText}>Đối tượng tham gia: {activitydetail.participant}</Text>
                                <Text style={AllStyle.AcitivityDetailText}>Địa điểm: {activitydetail.location}</Text>
                                <Text style={AllStyle.AcitivityDetailText}>
                                    Điểm cộng: {activitydetail.point}, {activitydetail.criterion}
                                </Text>
                                <Text style={AllStyle.AcitivityDetailText}>{activitydetail.semester}</Text>
                                <Text style={AllStyle.AcitivityDetailText}>Khoa: {activitydetail.faculty}</Text>
                                <Text style={AllStyle.AcitivityDetailText}>
                                    Ngày kết thúc: <Text>{formatDate(activitydetail.start_date)}</Text>
                                </Text>
                                <Text style={AllStyle.AcitivityDetailText}>
                                    Ngày kết thúc: <Text>{formatDate(activitydetail.end_date)}</Text>
                                </Text>
                                <Text style={AllStyle.AcitivityDetailText}>
                                    Ngày tạo: <Text>{formatDate(activitydetail.created_date)}</Text>
                                </Text>
                                <Text style={AllStyle.AcitivityDetailText}>
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