import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import APIs, { endPoints } from '../../configs/APIs';
import GlobalStyle from '../../styles/Style';
import { formatDate } from '../../utils/Utilities';
import Loading from '../Loading';
import Activity from './Activity';
import BulletinStyle from './BulletinStyle';

const screenWidth = Dimensions.get('window').width;

const BulletinDetail = ({ navigation, route }) => {
    const [bulletindetail, setBulletinDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const bulletinID = route?.params?.bulletinID;

    useEffect(() => {
        loadBulletinDetail();
    }, [bulletinID]);

    const loadBulletinDetail = async () => {
        setLoading(true);
        try {
            let res = await APIs.get(endPoints['bulletin-detail'](bulletinID));
            setBulletinDetail(res.data);
        } catch (error) {
            if (error.response) {
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                console.error(error.request);
            } else {
                console.error(`Error message: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
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
