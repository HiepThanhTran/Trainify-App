import { View, Text, StyleSheet, Alert, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import GlobalStyle from "../../Styles/Style";
import Theme from "../../Styles/Theme";
import { useEffect, useState } from "react";
import APIs, { endPoints, authAPI } from "../../Configs/APIs";
import { statusCode } from "../../Configs/Constants";
import { getTokens } from "../../Utils/Utilities";
import { AntDesign, Entypo } from '@expo/vector-icons';
import RenderHTML from "react-native-render-html";
import { screenWidth } from "../../Styles/Style";
import moment from "moment";

const MissingReportsOfStudent = ({navigation}) => {
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const loadReports = async () => {
            if (page <= 0) return;
            setLoading(true);
            try {
                const { accessToken } = await getTokens();
                const res = await authAPI(accessToken).get(endPoints['reports'], { params: { page } });
                if (res.status === statusCode.HTTP_200_OK) {
                    if (page === 1) {
                        setReports(res.data.results);
                    } else {
                        setReports((prevReports) => [...prevReports, ...res.data.results]);
                    }
                }
                if (res.data.next === null) {
                    setPage(0);
                }
            } catch (error) {
                console.error('Reports list:', error);
                Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

        loadReports();
    }, [page, refreshing]);

    const gotoMissingReportsOfStudentDetail = (report) => {
        navigation.navigate('MissingReportsOfStudentDetail', { reportID: report.id });
    }

    return (
        <View style={GlobalStyle.BackGround}>
            <ScrollView style={MissingReportsOfStudentStyle.Container}>
                {reports.map((report) => (
                    <View key={report.id}>
                        {report.evidence ? (
                            <ImageBackground
                                source={{ uri: report.evidence }}
                                style={MissingReportsOfStudentStyle.imageBackground}
                            >
                                <TouchableOpacity>
                                    {report.is_resolved ? (
                                        <View style={MissingReportsOfStudentStyle.Resolved}>
                                            <Text style={MissingReportsOfStudentStyle.Solved}>Đã giải quyết</Text>
                                            <AntDesign name="checkcircle" size={24} color="#6ac239" />
                                        </View>
                                    ) : (
                                        <View style={MissingReportsOfStudentStyle.Resolved}>
                                            <Text style={MissingReportsOfStudentStyle.NotResolved}>Chưa giải quyết</Text>
                                            <Entypo name="circle-with-cross" size={24} color="red" />
                                        </View>
                                    )}

                                    <Text style={MissingReportsOfStudentStyle.TitleActivity}>{report.activity.name}</Text>

                                    {report.content ? (
                                        <RenderHTML
                                            contentWidth={screenWidth}
                                            source={{ html: report.activity.description }}
                                            baseStyle={MissingReportsOfStudentStyle.ContentText}
                                            defaultTextProps={{
                                                numberOfLines: 3,
                                                ellipsizeMode: 'tail',
                                            }}
                                        />
                                    ) : (
                                        <Text style={MissingReportsOfStudentStyle.ContentText}>Không có nội dung minh chứng</Text>
                                    )}

                                    <Text style={MissingReportsOfStudentStyle.Text}>Ngày gửi: {moment(report.created_date).format('DD/MM/YYYY')}</Text>

                                    {report.is_resolved && (
                                        <Text style={MissingReportsOfStudentStyle.Text}>Ngày giải quyết: {moment(report.updated_date).format('DD/MM/YYYY')}</Text>
                                    )}

                                    <Text style={MissingReportsOfStudentStyle.Text}>Người gửi: {report.student.full_name}</Text>
                                </TouchableOpacity>
                            </ImageBackground>
                        ) : (
                            <LinearGradient
                                colors={Theme.LinearColors4}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1.5 }}
                                style={MissingReportsOfStudentStyle.linearGradient}
                            >
                                <TouchableOpacity onPress={() => gotoMissingReportsOfStudentDetail(report)}>
                                    {report.is_resolved ? (
                                        <View style={MissingReportsOfStudentStyle.Resolved}>
                                            <Text style={MissingReportsOfStudentStyle.Solved}>Đã giải quyết</Text>
                                            <AntDesign name="checkcircle" size={24} color="#6ac239" />
                                        </View>
                                    ) : (
                                        <View style={MissingReportsOfStudentStyle.Resolved}>
                                            <Text style={MissingReportsOfStudentStyle.NotResolved}>Chưa giải quyết</Text>
                                            <Entypo name="circle-with-cross" size={24} color="red" />
                                        </View>
                                    )}

                                    <Text style={MissingReportsOfStudentStyle.TitleActivity}>{report.activity.name}</Text>

                                    {report.content ? (
                                        <RenderHTML
                                            contentWidth={screenWidth}
                                            source={{ html: report.activity.description }}
                                            baseStyle={MissingReportsOfStudentStyle.ContentText}
                                            defaultTextProps={{
                                                numberOfLines: 3,
                                                ellipsizeMode: 'tail',
                                            }}
                                        />
                                    ) : (
                                        <Text style={MissingReportsOfStudentStyle.ContentText}>Không có nội dung minh chứng</Text>
                                    )}

                                    <Text style={MissingReportsOfStudentStyle.Text}>Ngày gửi: {moment(report.created_date).format('DD/MM/YYYY')}</Text>

                                    {report.is_resolved && (
                                        <Text style={[MissingReportsOfStudentStyle.Text]}>Ngày giải quyết: {moment(report.updated_date).format('DD/MM/YYYY')}</Text>
                                    )}

                                    <Text style={MissingReportsOfStudentStyle.Text}>Người gửi: {report.student.full_name}</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const MissingReportsOfStudentStyle = StyleSheet.create({
    Container: {
        marginTop: 20,
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 50
    },
    imageBackground: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
    },
    linearGradient: {
        width: '100%',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    Resolved: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    Solved: {
        fontFamily: Theme.Bold,
        color: '#6ac239',
        marginRight: 5
    },
    NotResolved: {
        fontFamily: Theme.Bold,
        color: 'red',
        marginRight: 5
    },
    TitleActivity: {
        fontFamily: Theme.Bold,
        fontSize: 18
    },
    ContentText: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: Theme.Regular,
        lineHeight: 25
    },
    Text: {
        fontSize: 16,
        fontFamily: Theme.SemiBold,
        marginTop: 10
    }
});

export default MissingReportsOfStudent;