import { supabase } from '@/services/supabase'
import { RunData } from '@/types'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { FlatList, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native'

export default function Run() {
    const [runs, setRuns] = useState<RunData[]>([])

    async function fetchRuns() {
        // fetch data from supabase
        try {
            const { data, error } = await
                supabase
                    .from('runs')
                    .select('*')
                    .order('created_at', { ascending: true })

            if (error) {
                console.error('Error fetching runs:', error)
                return
            }
            setRuns(data as RunData[])
        } catch (error) {
            void error
            console.error('Error fetching runs:', error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchRuns()
        }, [])
    );

    const showListRuns = ({ item }: { item: RunData }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    router.push({
                        pathname: '/[id]',
                        params: { id: item.id.toString() },
                    })
                }}
                style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    marginVertical: 10,
                    borderRadius: 15,
                    overflow: 'hidden',
                    elevation: 2,
                    position: 'relative',
                }}>
                <Image
                    source={{ uri: item.image_url }}
                    style={{
                        width: 96,
                        height: 96,
                        borderTopLeftRadius: 15,
                        borderBottomLeftRadius: 15,
                    }}
                />

                <View style={{
                    flex: 1,
                    padding: 10,
                    justifyContent: 'center',
                }}>
                    <Text
                        style={{
                            fontSize: 20,
                            color: '#7d4407',
                            fontFamily: 'Kanit_700Bold',
                        }}>{item.location}</Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#999',
                            marginTop: 5,
                            fontFamily: 'Kanit_400Regular',
                        }}>{new Date(item.run_date).toLocaleDateString("th-TH", {
                            dateStyle: "long",
                        })}</Text>
                </View>
                {/* Distance */}
                <View style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: '#2595ff',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 14,
                        fontFamily: 'Kanit_600SemiBold',
                    }}>{item.distance} กม.</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
                flex: 1,
            }}>
            <Image source={require("@/assets/images/run_logo.png")}
                style={{
                    width: "45%",
                    height: 150,
                    marginHorizontal: "auto",
                    marginTop: 10,
                }}
                resizeMode="cover"
            />
            <View style={{
                flex: 1,
                paddingHorizontal: 20,
            }}>
                {runs.length === 0 ? (
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontSize: 18,
                            color: '#999',
                            fontFamily: 'Kanit_400Regular',
                        }}>ยังไม่มีข้อมูลการวิ่ง</Text>
                    </View>
                ) : (
                    <FlatList
                        data={runs}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={showListRuns}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
            {/* Add button (bottom right) */}
            <TouchableOpacity
                onPress={() => router.push('/add')}
                style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 20,
                    backgroundColor: '#2595ff',
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 5,
                }}>
                <Text style={{
                    color: 'white',
                    fontSize: 30,
                    lineHeight: 30,
                }}>+</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}