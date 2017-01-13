/**
 * Early Childhood Development App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
import IMPComponent from '../Impulse/IMPComponent'
import IMPLog from '../Impulse/IMPLog'
import AndroidBackButton from 'react-native-android-back-button'
import {
  Text,
  View,
  Alert,
  StyleSheet,
  Picker,
  DatePickerAndroid,
  ToastAndroid,
  InteractionManager
} from 'react-native'

import moment from 'moment'

import Config from '../Config'
import Routes from '../Routes'
import { FontSizes } from '../GlobalStyles'
import Api from '../Api'
import Sentry from '../Sentry'
import Session from '../Session'

import {
  ScrollableWaitableView,
  SceneHeading,
  FormHeading,
  NavBar,
  TextField,
  Button,
  Selector
} from '../Components'
import validRSAId from '../validRSAID'

/**
 * A scene for adding children to the centre
 * @extends IMPComponent
 */
export default class AddChildScene extends IMPComponent {

  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      validationErrors: [],
      classData: [],
      givenName: '',
      familyName: '',
      idNumber: '',
      dateOfBirth: null,
      classSelectedId: null
    }
  }

  componentWillFocus() {
    super.componentWillFocus()
    this._fetchData()
  }

  componentWillMount() {
    super.componentWillMount()
    this._fetchData()
  }

  /**
   * Fetch server data needed to render the page
   * @memberof AddChildScene
   * @returns {undefined}
   */
  _fetchData() {
    // Fetch list of available classes
    const sessionState = Session.getState()
    Api.fetchClasses(
      sessionState.userData.user.id,
      sessionState.userData._token
    )

    .then( data => {
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          classData: data,
          loaded: true
        })
      })
    })

    .catch( error => {
      alert('There was an error fetching the classes')
    })
  }

  _hardwareBackHandler = () => {
    this._goBack()
    return true
  }

  _goBack() {
    this.navigator.pop()
    this.setState({
      loaded: false
    })
  }

  _validateForm() {
    let validationErrors = []
    // First Name
    if(!this.state.givenName) validationErrors.push("Please enter a first name.")
    // Last Name
    if(!this.state.familyName) validationErrors.push("Please enter a family name.")
    // Date of Birth
    if(!this.state.dateOfBirth) validationErrors.push("Please select a date of birth.")
    // RSA ID
    if(this.state.idNumber.length !== 13 ||
       !this.state.idNumber.match(/^[0-9]{13}/) ||
       !validRSAId(this.state.idNumber)
    ) {
         validationErrors.push("Please enter a valid 13 digit RSA ID number.")
    }

    if(validationErrors.length > 0) {
      Alert.alert(
        "Validation errors",
        validationErrors.join(" "),
        [{text: 'Okay'}]
      )
      return false
    }
    return true
  }

  _submit() {
    if(!this._validateForm()) {
      return
    }
    // submit the form
    const sessionState = Session.getState()
    Api.addChild(
      this.state.givenName,
      this.state.familyName,
      this.state.idNumber,
      this.state.classSelectedId,
      sessionState.userData._token)

    .then( response => {
      console.log('SERVER SAID', response)
      ToastAndroid.show('Child added', ToastAndroid.SHORT)
      this._resetForm()
    })

    .catch( error => {
      alert('Could not add child');
    })
  }

  _resetForm() {
    this.setState({
      givenName: null,
      familyName: null,
      idNumber: '',
      classSelectedId: null,
      dateOfBirth: null,
      validationErrors: []
    })
  }

  _pickDateOfBirth() {

    DatePickerAndroid.open({
      date: new Date(),
      mode: 'spinner'
    })

    .then( ({action, year, month, day}) => {
      if(action === "dateSetAction") {
        this.setState({
          dateOfBirth: new Date(year, month, day)
        })
      }
    })

    .catch( (error) => {
      if(Config.debug) IMPLog.error('Could not open date picker', this._fileName)
    })
  }

  _friendlyDate() {
    if(this.state.dateOfBirth === null) {
      return 'Please select'
    } else {
      return moment(this.state.dateOfBirth).format('Do MMMM YYYY')
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <AndroidBackButton onPress={ () => this._hardwareBackHandler() }/>

        <NavBar
          navigator={ this.props.navigator }
          leftButtonAction={ () => this._goBack() }
        />

        <ScrollableWaitableView loaded={this.state.loaded}>
          <SceneHeading text="Add Child"/>
          <View style={{marginLeft: 20, marginRight: 20}}>

            {/* Class */}
            <Text style={{fontSize: FontSizes.small}}>Class:</Text>
            <Selector
              selectedValue={this.state.classSelectedId}
              onValueChange={ classSelectedId => this.setState({classSelectedId: classSelectedId}) }
              items={this.state.classData}
            />

            {/* First Name */}
            <Text style={{fontSize: FontSizes.small}}>First Name:</Text>
            <TextField
              value={ this.state.givenName }
              ref="givenName"
              onChangeText={ text => this.setState({ givenName: text }) }
              returnKeyType="next"
              onSubmitEditing={ () => this.refs.familyName.textInput.focus() }
            />

            {/* Family Name */}
            <Text style={{fontSize: FontSizes.small}}>Family Name:</Text>
            <TextField
              value={ this.state.familyName }
              ref="familyName"
              onChangeText={ text => this.setState({ familyName: text }) }
              onSubmitEditing={ () => this.refs.idNumber.textInput.focus() }

            />

            {/* ID Number */}
            <Text style={{fontSize: FontSizes.small}}>ID Number:</Text>
            <TextField
              value={ this.state.idNumber }
              ref="idNumber"
              onChangeText={ text => this.setState({ idNumber: text}) }
              keyboardType="phone-pad"
            />

            {/* Date of Birth */}
            <Text style={{fontSize: FontSizes.small}}>Date Of Birth:</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 5, marginRight: 5}}>

              <View style={{
                width: 180,
                height: 50,
                marginRight: 3,
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: 5,
                paddingTop: 12
              }}>
                <Text style={{marginLeft: 8, fontSize: FontSizes.p}}>{this._friendlyDate(this.state.dateOfBirth)}</Text>
              </View>

              <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 5, paddingLeft: 5}}>
                <Button text="Select" width={80} onPress={ () => this._pickDateOfBirth() }/>
              </View>

            </View>

            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Button text="Add" onPress={ () => this._submit() }/>
            </View>

          </View>
        </ScrollableWaitableView>

      </View>)
  }
}