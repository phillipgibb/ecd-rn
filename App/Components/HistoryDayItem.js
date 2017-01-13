/**
 * Early Childhood Development App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableNativeFeedback
} from 'react-native'
import { HistoryChildItem } from './'
import { FontSizes, Colours} from '../GlobalStyles'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class HistoryDayItem extends Component {
  /*
    absentChildren : array
    date : string
    totalChildren : number
  */
  constructor(props) {
    super(props)
    this.state = {
      childItemsVisible: false
    }
  }

  _toggleChildItemsVisible = () => {
    if(this.props.absentChildren.length > 0)
      this.setState({childItemsVisible: !this.state.childItemsVisible})
  }

  makeHistoryChildItems = absentChildren =>
    this.state.childItemsVisible ?
      (<View>
        <Text>Absent:</Text>
        {absentChildren.map((x, i) =>
            (<HistoryChildItem
              key={i}
              index={i + 1}
              givenName={x.given_name}
              familyName={x.family_name}
              className={x.class_name}
            />)
        )}
      </View>)
    :
      null

  render() {
    return (
      <View style={{marginBottom: 5}}>

        <View style={{flexDirection: 'row'}}>
          <TouchableNativeFeedback onPress={() => this._toggleChildItemsVisible() }>
            <Text style={{fontSize: FontSizes.h5}}>
              <Icon name="arrow-right-bold-circle-outline"/>
              {this.props.day + " " + moment(new Date(0,this.props.month - 1)).format("MMMM")} ({ (this.props.totalChildren - this.props.absentChildren.length )+"/"+(this.props.totalChildren) })
            </Text>
          </TouchableNativeFeedback>
          <View style={{flex: 2}}/>
        </View>


        <View style={{marginLeft: 10}}>
          {this.makeHistoryChildItems(this.props.absentChildren)}

        </View>

      </View>
    )
  }
}