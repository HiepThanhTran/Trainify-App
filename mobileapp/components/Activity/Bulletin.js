import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, Keyboard } from "react-native"; 
import { AntDesign } from '@expo/vector-icons';
import { Dimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import GlobalStyle from '../../styles/Style';
import BulletinStyle from "./BulletinStyle";
import Theme from "../../styles/Theme";
import APIs, { endPoints } from '../../configs/APIs';
import { isCloseToBottom } from "../Utils/Utils";
import { formatDate } from "../Utils/Utils";

const screenWidth = Dimensions.get('window').width;

const Bulletin = ({ navigation }) => {
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");
    const [canLoadMore, setCanLoadMore] = useState(true);

    const loadBulletins = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let url = `${endPoints['bulletins']}?page=${page}`;
                if (q) {
                    url += `&title=${encodeURIComponent(q)}`;
                }
                let res = await APIs.get(url);
                if (res.data.next === null) {
                    setPage(0);
                    setCanLoadMore(false);
                }
                if (page === 1) {
                    setBulletins(res.data.results);
                } else {
                    setBulletins(current => [...current, ...res.data.results]);
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

    const go = (bulletinID) => {
        navigation.navigate('BulletinDetail', { 'bulletinID': bulletinID })
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <View style={GlobalStyle.BackGround} onTouchStart={dismissKeyboard}>
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

                <ScrollView style={BulletinStyle.BulletinCardContainer} onScroll={loadMore} 
                     showsVerticalScrollIndicator={false}
                     showsHorizontalScrollIndicator={false}
                >
                    <RefreshControl onRefresh={loadBulletins} />
                    {loading && <ActivityIndicator />}
                    {bulletins.map((bulletin) => (
                        <TouchableOpacity key={bulletin.id} onPress={() => go(bulletin.id)}>
                            <View style={BulletinStyle.BulletinCard}>
                                <View style={BulletinStyle.BulletinCardImage}>
                                    <Image
                                        style={BulletinStyle.Image}
                                        source={{ uri: bulletin.cover }}
                                    />
                                </View>

                                <View style={BulletinStyle.BulletinsCardDetail}>
                                    <Text style={BulletinStyle.Title}>{bulletin.title}</Text>

                                    <RenderHTML
                                        contentWidth={screenWidth}
                                        source={{ html: bulletin.content }}
                                        baseStyle={BulletinStyle.Content}
                                        defaultTextProps={{
                                            numberOfLines: 5,
                                            ellipsizeMode: 'tail'
                                        }}
                                    />

                                    <Text style={BulletinStyle.Date}>Ngày tạo: <Text>{formatDate(bulletin.created_date)}</Text></Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {loading && page > 1 && <ActivityIndicator />}
                </ScrollView>
            </View>
        </View>
    );
};

export default Bulletin;
