import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import '../../global.css';


import React from "react";
import SearchBar from "../../components/SearchBar";
import { icons } from "../../constants/icons";
import { images } from "../../constants/images";

import { useRouter } from "expo-router";
import MoviesCart from "../../components/MoviesCart";
import { fetchMovies } from "../../services/api";
import useFetch from "../../services/useFetch";


export default function Index() {

    const router = useRouter();

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError
    } = useFetch(() => fetchMovies({ query: '' }));

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute w-full z-0" />

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{
                minHeight: '100%', paddingBottom: 100
            }}>
                <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

                {moviesLoading ? (
                    <ActivityIndicator
                        size='large'
                        color="#0000ff"
                        className="mt-10 self-center"
                    />
                ) : moviesError ? (
                    <Text>Error: {moviesError}</Text>
                ) : (
                    <View className="flex-1 mt-5">
                        <SearchBar onPress={() => router.push("/search")} placeholder="Search for a movies" />
                        <>
                            <Text className="text-white text-lg font-bold mt-5 mb-3">Latest Movies</Text>
                            <FlatList
                            data={movies}
                            renderItem={({item})=>(
                                <MoviesCart
                                    {...item}
                                />
                            )} 
                            keyExtractor={(item)=> item.id.toString()}
                            numColumns={3}
                            columnWrapperStyle={{justifyContent: "flex-start", gap: 20, paddingRight: 5, marginBottom: 10}}
                            />
                        </>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
