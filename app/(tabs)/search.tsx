import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import MoviesCart from '../../components/MoviesCart';
import SearchBar from '../../components/SearchBar';
import { icons } from '../../constants/icons';
import { images } from '../../constants/images';
import { fetchMovies } from '../../services/api';
import { updateSearchCount } from '../../services/appwrite';
import useFetch from '../../services/useFetch';

const search = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const {
        data: movies,
        loading,
        error,
        fetchData: loadMovies,
        reset
    } = useFetch(() => fetchMovies({
        query: searchQuery
    }), false);

    useEffect(() => {
        updateSearchCount(searchQuery, movies[0]);

        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies();
            } else {
                reset()
            }
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        }

    }, [searchQuery]);

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute w-full z-0" resizeMode='cover' />

            <FlatList data={movies}
                renderItem={({ item }) => <MoviesCart {...item} />}
                keyExtractor={(item) => item.id.toString()}
                className="px-5"
                numColumns={3}
                columnWrapperStyle={{ justifyContent: "flex-start", gap: 20, paddingRight: 5, marginBottom: 10 }}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent=
                {
                    <>
                        <View className="w-full flex-row justify-center mt-20 items-center">
                            <Image source={icons.logo} className='w-12 h-10' />
                        </View>

                        <View className='my-5'>

                            <SearchBar
                                placeholder='Search movies ...'
                                value={searchQuery}
                                onChangeText={(text: string) => setSearchQuery(text)} />

                        </View>

                        {loading && (
                            <ActivityIndicator size='large' color="#0000ff" />
                        )}

                        {error && (
                            <Text className="text-red-500 px-3 my-3">
                                Error : {error}
                            </Text>
                        )}

                        {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
                            <Text className='text-xl text-white font-bold'>
                                Search Results for {''}
                                <Text className='text-accent'> {searchQuery}</Text>
                            </Text>
                        )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className='mt-10 px-5 '>
                            <Text className='text-white text-center'>
                                {searchQuery.trim() ? 'No results found' : 'Search for movies'}
                            </Text>
                        </View>
                    ) : null
                }
            />

        </View>
    )
}

export default search