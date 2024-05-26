import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, ScrollView } from "react-native";
import GlobalStyle from "../../styles/Style";
import APIs, { endPoints } from "../../configs/APIs";
import BulletinStyle from "./BulletinStyle";
import RenderHTML from "react-native-render-html";
import { Dimensions } from "react-native";
import { formatDate } from "../Utils/Utils";
import Activity from "./Activity";
import Theme from "../../styles/Theme";

const screenWidth = Dimensions.get('window').width;

const BulletinDetail = ({ navigation, route }) => {
    const [bulletindetail, setBulletinDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const bulletinID = route?.params?.bulletinID;

    const loadBulletinDetail = async () => {
        try {
            setLoading(true);
            let res = await APIs.get(endPoints['bulletin-detail'](bulletinID));
            setBulletinDetail(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (bulletinID) {
            loadBulletinDetail();
        }
    }, [bulletinID]);

    if (loading) {
        return (
            <View style={GlobalStyle.Center}>
                <ActivityIndicator size="large" color={Theme.PrimaryColor} />
            </View>
        );
    }

    return (
        <View style={GlobalStyle.BackGround}>
            <View style={{ marginHorizontal: 12 }}>
                {loading && <ActivityIndicator size="large" color={Theme.PrimaryColor} />}
                <ScrollView
                    key={bulletindetail.id}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={BulletinStyle.Description}>
                        <View style={BulletinStyle.BulletinCardImage}>
                            <Image style={BulletinStyle.ImageDetail} source={{ uri: bulletindetail.cover }} />
                        </View>

                        <RenderHTML
                            contentWidth={screenWidth}
                            source={{ html: bulletindetail.content }}
                            baseStyle={BulletinStyle.ContentDetail}
                        />

                        <Text style={BulletinStyle.DateDetail}>
                            Ngày tạo: <Text>{formatDate(bulletindetail.created_date)}</Text>
                        </Text>
                        <Text style={BulletinStyle.DateUpdate}>
                            Ngày cập nhập: <Text>{formatDate(bulletindetail.updated_date)}</Text>
                        </Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={BulletinStyle.TitleDetail}>Danh sách hoạt động</Text>
                        <Activity route={route} navigation={navigation} />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default BulletinDetail;
