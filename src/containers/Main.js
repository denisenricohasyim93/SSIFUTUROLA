import React, { Component } from 'react';
import { Dimensions, StatusBar, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text } from 'native-base';
import PDFView from 'react-native-view-pdf/lib/index';
import Textarea from 'react-native-textarea';
import DeviceInfo from 'react-native-device-info';
import { PermissionsAndroid } from 'react-native';
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
        await this.getMasukan()
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
                <Tabs locked={true} >
                    <Tab heading={<TabHeading style={{ backgroundColor: '#131B4C' }}><Icon style={{ color: 'white' }} name="book" /></TabHeading>}>
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
                                    resource={"http://202.157.176.50/files/SINAU%20BARENG%20REACT%20TECH.pdf"}
                                    resourceType={"url"}
                                />
                            </View>
                        </View>
                    </Tab>
                    <Tab heading={<TabHeading style={{ backgroundColor: '#131B4C' }}><Icon style={{ color: 'white' }} name="checkbox" /></TabHeading>}>
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
                                    return (
                                        <Text
                                            key={index}
                                            style={{
                                                width: width, 
                                                textAlign : 'left', 
                                                padding :5, 
                                                color : '#131B4C',
                                                fontSize: 15
                                            }}
                                        >
                                            {item.msisdn}{"\n"}{item.komentar}
                                        </Text>
                                    )
                                })}
                            </ScrollView>
                            <Textarea
                                containerStyle={{
                                    height: 180,
                                    padding: 25,
                                    backgroundColor: '#131B4C'
                                }}
                                style={{
                                    textAlignVertical: 'top',  // hack android
                                    height: 170,
                                    fontSize: 14,
                                    color: 'white',
                                }}
                                onChangeText={this.onChange}
                                defaultValue={this.state.masukan}
                                maxLength={120}
                                placeholder={'Input Your Comment Here'}
                                placeholderTextColor={'white'}
                                underlineColorAndroid={'transparent'}
                            />
                            <TouchableOpacity
                                style={{
                                    width: width,
                                    height: 0.1*height,
                                    backgroundColor : '#131B4C',
                                    borderTopWidth: 5,
                                    borderTopColor: 'white',
                                    alignItems : 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={async () => await this.submitSaran()}
                            >
                                <Text
                                    style={{color : 'white', textAlignVertical : 'center', textAlign : 'center', fontSize : 15, color: 'white'}}
                                >
                                    SUBMIT SARAN
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}