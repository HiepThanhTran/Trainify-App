import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import APIs, { endPoints } from '../../configs/APIs';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { formatDate } from '../../utils/Utils';
import Activity from './Activity';
import BulletinStyle from './BulletinStyle';

const screenWidth = Dimensions.get('window').width;

const BulletinDetail = ({ navigation, route }) => {
    const [bulletindetail, setBulletinDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const bulletinID = route?.params?.bulletinID;

    const loadBulletinDetail = async () => {
        setLoading(true);
        try {
            let res = await APIs.get(endPoints['bulletin-detail'](bulletinID));
            setBulletinDetail(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bulletinID) {
            loadBulletinDetail();
        }
    }, [bulletinID]);

    return (
        <>
            {loading ? (
                <View style={GlobalStyle.Container}>
                    <ActivityIndicator size="large" color={Theme.PrimaryColor} />
                </View>
            ) : (
                <View style={GlobalStyle.BackGround}>
                    <View style={{ marginHorizontal: 12 }}>
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
            )}
        </>
    );
};

export default BulletinDetail;
