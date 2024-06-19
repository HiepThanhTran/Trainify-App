import { View, Text, StyleSheet } from "react-native";
import GlobalStyle from "../../Styles/Style";
import Theme from "../../Styles/Theme";
import APIs, { authAPI, endPoints } from "../../Configs/APIs";
import { useState, useEffect } from "react";
import RenderHTML from "react-native-render-html";
import { screenWidth } from "react-native-gifted-charts/src/utils";
import { getTokens } from "../../Utils/Utilities";
import moment from "moment";
import Loading from '../../Components/Common/Loading'
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";

const MissingReportsOfStudentDetail = ({ navigation, route }) => {
    const reportID = route?.params?.reportID;
    const [reportDetail, setReportDetail] = useState({});
    const [isRendered, setIsRendered] = useState(false)

    const loadReportDetail = async () => {
        console.log(reportID)
        console.log(endPoints['report-detail'](reportID))
        try {
            const { accessToken } = await getTokens();
            let res = await authAPI(accessToken).get(endPoints['report-detail'](reportID));
            console.log(res.data)
            setReportDetail(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsRendered(true)
        }
    }

    useEffect(() => {
        loadReportDetail();
    }, [reportID]);

    if (!isRendered) return <Loading />

    return (
        <View style={GlobalStyle.BackGround}>
            <View style={MissingReportsOfStudentDetailStyle.Container}>
                <Text style={MissingReportsOfStudentDetailStyle.Title}>Phiếu báo thiếu thứ {reportDetail.id}</Text>
                <View style={MissingReportsOfStudentDetailStyle.Subject}>
                    <Text style={MissingReportsOfStudentDetailStyle.SubjectTitle}>Thông tin hoạt động báo thiếu</Text>
                    <Text style={MissingReportsOfStudentDetailStyle.SubjectLine}></Text>
                </View>
                <View style={MissingReportsOfStudentDetailStyle.Field}>
                    <AntDesign name="appstore1" size={24} color="#114e7f" style={MissingReportsOfStudentDetailStyle.Icon} />
                    <Text style={MissingReportsOfStudentDetailStyle.Text}>
                        <Text style={MissingReportsOfStudentDetailStyle.FieldDesTitle}>Tên hoạt động</Text>: {reportDetail.activity.name}
                    </Text>
                </View>

                <View style={MissingReportsOfStudentDetailStyle.Field}>
                    <AntDesign name="clockcircle" size={24} color="#114e7f" style={MissingReportsOfStudentDetailStyle.Icon} />
                    <Text style={MissingReportsOfStudentDetailStyle.Text}>
                        <Text style={MissingReportsOfStudentDetailStyle.FieldDesTitle}>Ngày bắt đầu: </Text>{moment(reportDetail.start_date).format('DD/MM/YYYY')}
                    </Text>
                </View>

                <View style={MissingReportsOfStudentDetailStyle.Field}>
                    <AntDesign name="clockcircle" size={24} color="#114e7f" style={MissingReportsOfStudentDetailStyle.Icon} />
                    <Text style={MissingReportsOfStudentDetailStyle.Text}>
                        <Text style={MissingReportsOfStudentDetailStyle.FieldDesTitle}>Ngày kết thúc: </Text>{moment(reportDetail.end_date).format('DD/MM/YYYY')}
                    </Text>
                </View>

                <View style={MissingReportsOfStudentDetailStyle.Field}>
                    <Ionicons name="location" size={24} color='#114e7f' style={MissingReportsOfStudentDetailStyle.Icon} />
                    <Text style={MissingReportsOfStudentDetailStyle.Text}>
                        <Text style={MissingReportsOfStudentDetailStyle.FieldDesTitle}>Địa điểm: </Text>{moment(reportDetail.end_date).format('DD/MM/YYYY')}
                    </Text>
                </View>

                <View style={MissingReportsOfStudentDetailStyle.Field}>
                    <AntDesign name="star" size={24} color='#114e7f' style={MissingReportsOfStudentDetailStyle.Icon} />
                    <Text style={MissingReportsOfStudentDetailStyle.Text}>
                        <Text style={MissingReportsOfStudentDetailStyle.FieldDesTitle}>Điểm cộng: </Text> {reportDetail.activity.point}
                    </Text>
                </View>

                <View style={MissingReportsOfStudentDetailStyle.Subject}>
                    <Text style={MissingReportsOfStudentDetailStyle.SubjectTitle}>Thông tin sinh viên báo thiếu</Text>
                    <Text style={MissingReportsOfStudentDetailStyle.SubjectLine}></Text>
                </View>

                <View style={MissingReportsOfStudentDetailStyle.Field}>
                    <Ionicons name="people" size={24} color='#114e7f' style={MissingReportsOfStudentDetailStyle.Icon} />
                    <Text style={MissingReportsOfStudentDetailStyle.Text}>
                        <Text style={MissingReportsOfStudentDetailStyle.FieldDesTitle}>Sinh viên báo thiếu: </Text> {reportDetail.student.full_name}
                    </Text>
                </View>

                <View style={MissingReportsOfStudentDetailStyle.Field}>
                    <Entypo name="calendar" size={24} color='#114e7f' style={MissingReportsOfStudentDetailStyle.Icon} />
                    <Text style={MissingReportsOfStudentDetailStyle.Text}>
                        <Text style={MissingReportsOfStudentDetailStyle.FieldDesTitle}>Năm sinh: </Text> {moment(reportDetail.student.date_of_birth).format('DD/MM/YYYY')}
                    </Text>
                </View>

                <View style={MissingReportsOfStudentDetailStyle.ButtonContainer}>
                    <TouchableOpacity style={MissingReportsOfStudentDetailStyle.ButtonAccept}>
                        <Text style={MissingReportsOfStudentDetailStyle.ButtonText}>Đồng ý</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={MissingReportsOfStudentDetailStyle.ButtonReject}>
                        <Text style={MissingReportsOfStudentDetailStyle.ButtonText}>Từ chối</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const MissingReportsOfStudentDetailStyle = StyleSheet.create({
    Container: {
        marginTop: 20,
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 50
    },
    Subject: {
        marginTop: 15
    },
    SubjectTitle: {
        fontFamily: Theme.Bold,
        fontSize: 18
    },
    SubjectLine: {
        width: '100%',
        backgroundColor: '#dadada',
        height: 1,
        marginTop: 5,
        marginBottom: 5
    },
    Title: {
        fontFamily: Theme.Bold,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    Text: {
        fontFamily: Theme.SemiBold,
        fontSize: 18,
        marginLeft: 10,
    },
    Field: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    Icon: {
        marginRight: 5
    },
    FieldDesTitle: {
        fontFamily: Theme.Bold,
        fontSize: 18,
        color: '#114e7f'
    },
    ButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    ButtonAccept: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    ButtonReject: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
    },
    ButtonText: {
        color: 'white',
        fontFamily: Theme.Bold,
        fontSize: 16,
        textAlign: 'center'
    }
})

export default MissingReportsOfStudentDetail;