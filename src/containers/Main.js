import React, { Component } from 'react';
import { Dimensions, StatusBar, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text } from 'native-base';
import PDFView from 'react-native-view-pdf/lib/index';
import Textarea from 'react-native-textarea';
import DeviceInfo from 'react-native-device-info';
import { PermissionsAndroid } from 'react-native';
import moment from 'moment';
const { width, height } = Dimensions.get('window');
const axios = require('axios');

export default class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            masukan: "",
            msisdn: "",
            ip_address: "",
            loading : true,
            kumpulan : []
        }
    }
    async submitSaran() {
        console.log(this.state)
        let formdata = new FormData();
        formdata.append("data", JSON.stringify({
            msisdn : this.state.msisdn,
            komentar : this.state.masukan
        }))
        await fetch('http://202.157.176.50/api/resource/TSEL%20CRM%20Customer%20List', {
            method : 'post',
            headers : {
                'Authorization': "token beedf00d2ff3f44:842818ade1dbb11"
            },
            body : formdata
        }).then((response) => {
            response.json().then((json) => {
                console.log(json)
                this.getMasukan()
            })
        }).catch((error) => {
            console.log(error)
        })
    }
    async getMasukan() {
        try {
          const response = await axios.get('http://202.157.176.50/api/resource/TSEL%20CRM%20Customer%20List?fields=[%22*%22]&limit_page_length=0', {
              headers : {
                'Authorization': "token beedf00d2ff3f44:842818ade1dbb11"
              }
          });
          await this.setState({
            loading : false,
            kumpulan : response.data.data
          })
          console.log(this.state.kumpulan);
        } catch (error) {
          console.error(error);
        }
      }
    async componentDidMount() {
        setInterval(() => {
            this.getMasukan()
        }, 500)
        // await this.getMasukan()
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
            {
                title: 'Phone Permission',
                message:
                    'This App need Your Phone Permission ',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK'
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            DeviceInfo.getPhoneNumber().then(phoneNumber => {
                this.setState({
                    msisdn : phoneNumber
                })
                // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value
            });                  
        }
    }
    onChange = (value) => {
        this.setState({ masukan: value });
    }
    render() {
        return (
            <Container
                style={{ flex: 1, width: width, height: height }}
            >
                <StatusBar backgroundColor='#131B4C' barStyle="light-content" />
                <Tabs locked={tru} >
                    <Tab heading={<TabHeading style={{ backgroundColor: '#131B4C' }}><Icon style={{ color: 'white' }} name="checkbox" /><Text style={{color : 'white'}}>DISKUSI</Text></TabHeading>}>
                        <View
                            style={{
                                width: width,
                                flex: 1,
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent : 'center'
                            }}
                        >
                            <ScrollView
                                style={{
                                    width: width, height : null, backgroundColor: 'white', flex: 1
                                }}
                            >
                                {this.state.loading ? null : this.state.kumpulan.map((item, index) => {
                                    if (item.msisdn === this.state.msisdn) {
                                        return (
                                            <View
                                            key={index}
                                            style={{width: width, height: null, marginVertical: 5, alignItems: 'center', justifyContent: 'center'}}
                                            >
                                                <View
                                                    style={{width: 0.95*width, height: null, padding : 5, borderWidth: 1, borderRadius: 5, backgroundColor: '#131B4C'}}
                                                >
                                                    <Text   
                                                        style={{
                                                            width: 0.95*width, 
                                                            textAlign : 'right', 
                                                            paddingHorizontal : 15, 
                                                            color : 'white',
                                                            fontSize: 15
                                                        }}
                                                    >
                                                        {moment(item.modified).format('dddd, DD MMMM YYYY HH:mm:ss')}{"\n"}My Self{"\n"}{item.komentar}
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    }
                                    return (
                                        <View
                                            key={index}
                                            style={{width: width, height: null, marginVertical: 5, alignItems: 'center', justifyContent: 'center'}}
                                        >
                                            <View
                                                style={{width: 0.95*width, height: null, padding : 5, borderWidth: 1, borderRadius: 5, borderColor: '#131B4C'}}
                                            >
                                                <Text   
                                                    style={{
                                                        width: width, 
                                                        textAlign : 'left', 
                                                        margin :5, 
                                                        color : '#131B4C',
                                                        fontSize: 15
                                                    }}
                                                >
                                                    {moment(item.modified).format('dddd, DD MMMM YYYY HH:mm:ss')}{"\n"}{item.msisdn}{"\n"}{item.komentar}
                                                </Text>
                                            </View>
                                        </View>
                                        
                                    )
                                })}
                            </ScrollView>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems : 'center',
                                    justifyContent : 'center',
                                    height: 100,
                                    borderTopColor :"#131B4C",
                                    borderTopWidth : 3
                                }}
                            >
                                <Textarea
                                    containerStyle={{
                                        height: 100,
                                        padding: 25,
                                        backgroundColor: 'white',
                                        width: 0.75*width
                                    }}
                                    style={{
                                        textAlignVertical: 'top',  // hack android
                                        height: 90,
                                        fontSize: 14,
                                        color: '#131B4C',
                                        padding: 10
                                    }}
                                    onChangeText={this.onChange}
                                    defaultValue={this.state.masukan}
                                    maxLength={120}
                                    placeholder={'Input Your Comment Here'}
                                    placeholderTextColor={'#131B4C'}
                                    underlineColorAndroid={'transparent'}
                                />
                                <TouchableOpacity
                                    style={{
                                        width: 0.25*width,
                                        height: 100,
                                        backgroundColor : '#131B4C',
                                        borderLeftWidth: 5,
                                        borderLeftColor: 'white',
                                        alignItems : 'center',
                                        justifyContent: 'center'
                                    }}
                                    onPress={async () => await this.submitSaran()}
                                >
                                    <Text style={{margin: 0, padding: 0, width: 0.2*width, textAlign : 'center', color: 'white'}}>SEND</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Tab>
                    <Tab heading={<TabHeading style={{ backgroundColor: '#131B4C' }}><Icon style={{ color: 'white' }} name="book" /><Text style={{color : 'white'}}>MATERI</Text></TabHeading>}>
                        <View
                            style={{
                                width: width,
                                flex: 1
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <PDFView
                                    fadeInDuration={0}
                                    style={{ flex: 1 }}
                                    resource={"http://202.157.176.50/files/REACT%20TECH.pdf"}
                                    resourceType={"url"}
                                />
                            </View>
                        </View>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}
