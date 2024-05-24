import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
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
    const [page, setPage] = useState(1)
    const loadBulletins = async () => {
        if (page > 0) {
            let url = `${endPoints['bulletins']}?page=${page}`;
            try {
                setLoading(true);
                let res = await APIs.get(url);
                if(page===1){
                    setBulletins(res.data.results);
                }else if(page>1){
                    setBulletins(current => {
                        return [...current, ...res.data.results]
                    })
                }
                if (res.data.next === null) {
                    setPage(0);
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
    }, [page]);

    const loadMore = ({ nativeEvent }) => {
        if (!loading && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
        }
    };

    const go = (bulletinID) => {
        navigation.navigate('BulletinDetail', { 'bulletinID': bulletinID })
    };

    return (
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
                    />
                </View>

                <ScrollView style={BulletinStyle.BulletinCardContainer} onScroll={loadMore}>
                    <RefreshControl onRefresh={() => loadBulletins()} />
                    {loading && <ActivityIndicator />}
                    {bulletins.map((bulletin, index) => (
                        <TouchableOpacity key={index} onPress={() => go(bulletin.id)}>
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

                                    <Text style={BulletinStyle.Date}>Ngày tạo: {formatDate(bulletin.created_date)}</Text>
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
