import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Keyboard,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import APIs, { endPoints } from '../../configs/APIs';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { formatDate, isCloseToBottom } from '../Utils/Utils';
import BulletinStyle from './BulletinStyle';

const screenWidth = Dimensions.get('window').width;

const Bulletin = ({ navigation }) => {
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState('');
    const [canLoadMore, setCanLoadMore] = useState(true);

    const loadBulletins = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let url = `${endPoints['bulletins']}?page=${page}&title=${q}`;
                let res = await APIs.get(url);
                if (res.data.next === null) {
                    setPage(0);
                    setCanLoadMore(false);
                }
                if (page === 1) {
                    setBulletins(res.data.results);
                } else {
                    setBulletins((current) => [...current, ...res.data.results]);
                }
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadBulletins();
    }, [page, q]);

    const loadMore = ({ nativeEvent }) => {
        if (!loading && canLoadMore && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
        }
    };

    const search = (value) => {
        setPage(1);
        setQ(value);
    };

    const goToBulletinDetail = (bulletinID, title) => {
        navigation.navigate('BulletinDetail', { bulletinID: bulletinID, title: title });
    };

    return (
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => Keyboard.dismiss()}>
            <View style={GlobalStyle.BackGround}>
                <View style={BulletinStyle.Container}>
                    <View style={BulletinStyle.TopContainer}>
                        <Text style={BulletinStyle.Text}>Bản tin</Text>
                        <AntDesign name="message1" size={28} color={Theme.PrimaryColor} />
                    </View>
                    <View style={BulletinStyle.Search}>
                        <TextInput
                            style={BulletinStyle.SearchInput}
                            placeholder="Tìm kiếm bản tin"
                            onChangeText={search}
                            value={q}
                        />
                    </View>

                    <ScrollView
                        style={BulletinStyle.BulletinCardContainer}
                        onScroll={loadMore}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <RefreshControl onRefresh={loadBulletins} />
                        {loading && <ActivityIndicator />}
                        {bulletins.map((bulletin) => (
                            <TouchableOpacity
                                key={bulletin.id}
                                onPress={() => goToBulletinDetail(bulletin.id, bulletin.title)}
                            >
                                <View style={BulletinStyle.BulletinCard}>
                                    <View style={BulletinStyle.BulletinCardImage}>
                                        <Image style={BulletinStyle.Image} source={{ uri: bulletin.cover }} />
                                    </View>

                                    <View style={BulletinStyle.BulletinsCardDetail}>
                                        <Text style={BulletinStyle.Title}>{bulletin.title}</Text>

                                        <RenderHTML
                                            contentWidth={screenWidth}
                                            source={{ html: bulletin.content }}
                                            baseStyle={BulletinStyle.Content}
                                            defaultTextProps={{
                                                numberOfLines: 2,
                                                ellipsizeMode: 'tail',
                                            }}
                                        />

                                        <Text style={BulletinStyle.Date}>
                                            Ngày tạo: <Text>{formatDate(bulletin.created_date)}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                        {loading && page > 1 && <ActivityIndicator />}
                    </ScrollView>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default Bulletin;
