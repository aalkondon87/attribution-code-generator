import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
  import { Navbar,Nav,NavDropdown,Form,FormControl,Button, Container } from 'react-bootstrap'
import AWS from 'aws-sdk';
import logo from './logo.svg';
import './App.css';

AWS.config.update({
    region: "us-east-1",
    //endpoint: "http://localhost:3000",
    accessKeyId: "AKIATPYABGGAYLE56Y47",
    secretAccessKey: "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"
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      changeAskChannel:false,
      code: {
        askChannel: 'W',
        channelVariable: 'X',
        audience: '0',
        reCampaignId: '1',
        pu: 'U',
        solicitor: 'N',
        offer: 'S',
        askType: '1',
        region: '00',
        day: '01',
        month: '01',
        year: '2022',
        evergreen: '0',
        effort: '1'
      },
      submitting: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    event.preventDefault();

    let code = this.state.code;
    let name = event.target.name;
    let value = event.target.value;

    code[name] = value;
    this.setState(code);

    if(name === "askChannel") {
      this.setState({changeAskChannel:true});
      switch(value) {
        case "E":
          code["channelVariable"] = "A";
          return;
        case 'S':
          code["channelVariable"] = "F";
          return;
        case 'P':
          code["channelVariable"] = "G";
          return;          
        case 'M':
          code["channelVariable"] = "A";
          return;          
        case 'C':
          code["channelVariable"] = "A";
          return;          
        default:
          code["channelVariable"] = "X";
          return;        
      }
    }

    if(name === "audience") {
      switch(value) {
        case "3":
          code["reCampaignId"] = "1";
          return;        
        default:
          code["reCampaignId"] = "1";
          return;        
      }
    }

    if(name === "evergreen") {
      switch(value) {
        case "999999":
          code["evergreen"] = "999999";
          code["year"] = "";
          code["month"] = "";
          code["day"] = "";
          return;        
        default:
          code["evergreen"] = "0";
          code["year"] = value;
          code["month"] = value;
          code["day"] = value;
          return;        
      }
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({submitting:true});

    //const { askChannel, channelVariable, audience, reCampaignId, pu, solicitor, offer, askType, region, day, month, year, evergreen, effort} = this.state.code;

    let code = this.state.code;
    let lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});
    let lambda_parameters = {
      FunctionName : 'arn:aws:lambda:us-east-1:239981375873:function:Attribution_Code_Generator',
      InvocationType : 'RequestResponse',
      LogType : 'None',
      Payload : JSON.stringify({code})
    };

    console.log(event.target);
    console.log(JSON.stringify({code}))

    lambda.invoke(lambda_parameters, function(err, data) {
      if(err) {
        console.log(err);
      } else {
        var response = eval(JSON.parse(data.Payload));
        console.log(response);
        console.log(typeof(response.statusCode));
        console.log(response.statusCode);
      }
    });

    setTimeout(() => {
      this.setState({submitting: false});
    }, 3000)
  }

  renderChannelVariables = () => {
    // Show conditional options based on Ask Channel
    switch(this.state.code.askChannel) {
      case 'W':
        return ( 
          <>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>      
              <label>
                <h6>Audience</h6>
                <small>Position 2</small></label><br></br>
                <select name="audience" value={this.state.code.audience} onChange={this.handleChange} className="form-select">
                  <option value="0">Acquisition</option>
                  <option value="1">Prospects</option>
                  <option value="2">Current Donors</option>
                  <option value="3">Sustainers</option>
                  <option value="4">Midlevel</option>
                  <option value="5">Major Gifts</option>
                  <option value="6">Activists</option>
                  <option value="7">Streamers</option>
                  <option value="8">Culinary</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            { this.renderReCampaignId() }
          </div>
          <div className="col-12 mt-3 mb-3">
            <div className="form-group">      
              <label>
                <h6>Other</h6>
                <small>Position 1</small></label><br></br>
                <select name="channelVariable" value={this.state.code.channelVariable} onChange={this.handleChange} className="form-select">
                  <option value="X">General</option>
                </select>
            </div> 
          </div>
          <div className="col-4 mt-3 mb-3">          
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Paid / Unpaid</h6>
                <small>Position 4</small></label><br></br>
                <select name="pu" value={this.state.code.pu} onChange={this.handleChange} className="form-select">
                  <option value="U">Unpaid</option>
                  <option value="P">Paid</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Solicitor</h6>
                <small>Position 5</small></label><br></br>
                <select name="solicitor" value={this.state.code.solicitor} onChange={this.handleChange} className="form-select">
                  <option value="N">NKH</option>
                  <option value="S">SOS</option>
                  <option value="G">Major Gifts</option>
                  <option value="M">Midlevel Relationship Manager</option>
                  <option value="P">Display</option>
                  <option value="T">Telemarketing</option>
                  <option value="C">Direct Mail</option>
                  <option value="D">DRTV</option>
                  <option value="F">P2P</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Offer</h6>
                <small>Position 6</small></label><br></br>
                <select name="offer" value={this.state.code.offer} onChange={this.handleChange} className="form-select">
                  <option value="S">Standard</option>
                  <option value="M">Match</option>
                  <option value="E">Event</option>
                  <option value="A">Advocacy</option>
                  <option value="F">Fundraise</option>
                  <option value="C">Challenge</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Ask Type</h6>
               <small>Position 7</small></label><br></br>
                <select name="askType" value={this.state.code.askType} onChange={this.handleChange} className="form-select">
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">Sustainer</option>
                  <option value="5">Upgrade</option>
                  <option value="6">Advocacy</option>
                  <option value="7">Fundraise</option>
                  <option value="8">Engage</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Region</h6>
                <small>Position 8 & 9</small></label><br></br>
                <select name="region" value={this.state.code.region} onChange={this.handleChange} className="form-select">
                  <option value="00">US</option>
                  <option value="01">AK</option>
                  <option value="02">AL</option>
                  <option value="03">AR</option>
                  <option value="04">AZ</option>
                  <option value="05">CA</option>
                  <option value="06">CO</option>
                  <option value="07">CT</option>
                  <option value="08">DE</option>
                  <option value="09">FL</option>
                  <option value="10">GA</option>
                  <option value="11">HI</option>
                  <option value="12">IA</option>
                  <option value="13">ID</option>
                  <option value="14">IL</option>
                  <option value="15">IN</option>
                  <option value="16">KS</option>
                  <option value="17">KY</option>
                  <option value="18">LA</option>
                  <option value="19">MA</option>
                  <option value="20">MD</option>
                  <option value="21">ME</option>
                  <option value="22">MI</option>
                  <option value="23">MN</option>
                  <option value="24">MO</option>
                  <option value="25">MS</option>
                  <option value="26">MT</option>
                  <option value="27">NC</option>
                  <option value="28">ND</option>
                  <option value="29">NE</option>
                  <option value="30">NH</option>
                  <option value="31">NJ</option>
                  <option value="32">NM</option>
                  <option value="33">NV</option>
                  <option value="34">NY</option>
                  <option value="35">OH</option>
                  <option value="36">OK</option>
                  <option value="37">OR</option>
                  <option value="38">PA</option>
                  <option value="39">RI</option>
                  <option value="40">SC</option>
                  <option value="41">SD</option>
                  <option value="42">TN</option>
                  <option value="43">TX</option>
                  <option value="44">UT</option>
                  <option value="45">VA</option>
                  <option value="46">VT</option>
                  <option value="47">WA</option>
                  <option value="48">WI</option>
                  <option value="49">WV</option>
                  <option value="50">WY</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 10-15</small></label><br></br>
                <select name="evergreen" value={this.state.code.evergreen} onChange={this.handleChange} className="form-select">
                  <option value="">Not Evergreen</option>
                  <option value="999999">Evergreen</option>
                </select>
            </div>
          </div>
          { this.evergreenCheck() }
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Effort</h6>
                <small>Position 16</small></label><br></br>
                <select name="effort" value={this.state.code.effort} onChange={this.handleChange} className="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
            </div>
          </div> 
          </> )    
      case 'E':
        return ( 
          <>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>      
              <label>
                <h6>Audience</h6>
                <small>Position 2</small></label><br></br>
                <select name="audience" value={this.state.code.audience} onChange={this.handleChange} className="form-select">
                  <option value="0">Acquisition</option>
                  <option value="1">Prospects</option>
                  <option value="2">Current Donors</option>
                  <option value="3">Sustainers</option>
                  <option value="4">Midlevel</option>
                  <option value="5">Major Gifts</option>
                  <option value="6">Activists</option>
                  <option value="7">Streamers</option>
                  <option value="8">Culinary</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            { this.renderReCampaignId() }
          </div>
          <div className="col-12 mt-3 mb-3">
            <div className="form-group">      
            <label>
              <h6>Email</h6>
              <small>Position 1</small></label><br></br>
              <select name="channelVariable" value={this.state.code.channelVariable} onChange={this.handleChange} className="form-select">
                <option value="A">Appeal</option>
                <option value="U">Thank You</option>
                <option value="K">Acknowledgement</option>
                <option value="C">Cultivation</option>
                <option value="S">Stewardship</option>
                <option value="N">Newsletter</option>
                <option value="L">Legacy Giving</option>
                <option value="W">Welcome</option>
              </select>
            </div> 
          </div>
          <div className="col-4 mt-3 mb-3">          
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Paid / Unpaid</h6>
                <small>Position 4</small></label><br></br>
                <select name="pu" value={this.state.code.pu} onChange={this.handleChange} className="form-select">
                  <option value="U">Unpaid</option>
                  <option value="P">Paid</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Solicitor</h6>
                <small>Position 5</small></label><br></br>
                <select name="solicitor" value={this.state.code.solicitor} onChange={this.handleChange} className="form-select">
                  <option value="N">NKH</option>
                  <option value="S">SOS</option>
                  <option value="G">Major Gifts</option>
                  <option value="M">Midlevel Relationship Manager</option>
                  <option value="P">Display</option>
                  <option value="T">Telemarketing</option>
                  <option value="C">Direct Mail</option>
                  <option value="D">DRTV</option>
                  <option value="F">P2P</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Offer</h6>
                <small>Position 6</small></label><br></br>
                <select name="offer" value={this.state.code.offer} onChange={this.handleChange} className="form-select">
                  <option value="S">Standard</option>
                  <option value="M">Match</option>
                  <option value="E">Event</option>
                  <option value="A">Advocacy</option>
                  <option value="F">Fundraise</option>
                  <option value="C">Challenge</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Ask Type</h6>
               <small>Position 7</small></label><br></br>
                <select name="askType" value={this.state.code.askType} onChange={this.handleChange} className="form-select">
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">Sustainer</option>
                  <option value="5">Upgrade</option>
                  <option value="6">Advocacy</option>
                  <option value="7">Fundraise</option>
                  <option value="8">Engage</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Region</h6>
                <small>Position 8 & 9</small></label><br></br>
                <select name="region" value={this.state.code.region} onChange={this.handleChange} className="form-select">
                  <option value="00">US</option>
                  <option value="01">AK</option>
                  <option value="02">AL</option>
                  <option value="03">AR</option>
                  <option value="04">AZ</option>
                  <option value="05">CA</option>
                  <option value="06">CO</option>
                  <option value="07">CT</option>
                  <option value="08">DE</option>
                  <option value="09">FL</option>
                  <option value="10">GA</option>
                  <option value="11">HI</option>
                  <option value="12">IA</option>
                  <option value="13">ID</option>
                  <option value="14">IL</option>
                  <option value="15">IN</option>
                  <option value="16">KS</option>
                  <option value="17">KY</option>
                  <option value="18">LA</option>
                  <option value="19">MA</option>
                  <option value="20">MD</option>
                  <option value="21">ME</option>
                  <option value="22">MI</option>
                  <option value="23">MN</option>
                  <option value="24">MO</option>
                  <option value="25">MS</option>
                  <option value="26">MT</option>
                  <option value="27">NC</option>
                  <option value="28">ND</option>
                  <option value="29">NE</option>
                  <option value="30">NH</option>
                  <option value="31">NJ</option>
                  <option value="32">NM</option>
                  <option value="33">NV</option>
                  <option value="34">NY</option>
                  <option value="35">OH</option>
                  <option value="36">OK</option>
                  <option value="37">OR</option>
                  <option value="38">PA</option>
                  <option value="39">RI</option>
                  <option value="40">SC</option>
                  <option value="41">SD</option>
                  <option value="42">TN</option>
                  <option value="43">TX</option>
                  <option value="44">UT</option>
                  <option value="45">VA</option>
                  <option value="46">VT</option>
                  <option value="47">WA</option>
                  <option value="48">WI</option>
                  <option value="49">WV</option>
                  <option value="50">WY</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 10-15</small></label><br></br>
                <select name="evergreen" value={this.state.code.evergreen} onChange={this.handleChange} className="form-select">
                  <option value="">Not Evergreen</option>
                  <option value="999999">Evergreen</option>
                </select>
            </div>
          </div>
          { this.evergreenCheck() }
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Effort</h6>
                <small>Position 16</small></label><br></br>
                <select name="effort" value={this.state.code.effort} onChange={this.handleChange} className="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
            </div>
          </div> 
          </> )
      case 'K':
        return ( 
          <>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>      
              <label>
                <h6>Audience</h6>
                <small>Position 2</small></label><br></br>
                <select name="audience" value={this.state.code.audience} onChange={this.handleChange} className="form-select">
                  <option value="0">Acquisition</option>
                  <option value="1">Prospects</option>
                  <option value="2">Current Donors</option>
                  <option value="3">Sustainers</option>
                  <option value="4">Midlevel</option>
                  <option value="5">Major Gifts</option>
                  <option value="6">Activists</option>
                  <option value="7">Streamers</option>
                  <option value="8">Culinary</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            { this.renderReCampaignId() }
          </div>
          <div className="col-12 mt-3 mb-3">
            <div className="form-group">      
              <label>
                <h6>Other</h6>
                <small>Position 1</small></label><br></br>
                <select name="channelVariable" value={this.state.code.channelVariable} onChange={this.handleChange} className="form-select">
                  <option value="X">General</option>
                </select>
            </div> 
          </div>
          <div className="col-4 mt-3 mb-3">          
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Paid / Unpaid</h6>
                <small>Position 4</small></label><br></br>
                <select name="pu" value={this.state.code.pu} onChange={this.handleChange} className="form-select">
                  <option value="U">Unpaid</option>
                  <option value="P">Paid</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Solicitor</h6>
                <small>Position 5</small></label><br></br>
                <select name="solicitor" value={this.state.code.solicitor} onChange={this.handleChange} className="form-select">
                  <option value="N">NKH</option>
                  <option value="S">SOS</option>
                  <option value="G">Major Gifts</option>
                  <option value="M">Midlevel Relationship Manager</option>
                  <option value="P">Display</option>
                  <option value="T">Telemarketing</option>
                  <option value="C">Direct Mail</option>
                  <option value="D">DRTV</option>
                  <option value="F">P2P</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Offer</h6>
                <small>Position 6</small></label><br></br>
                <select name="offer" value={this.state.code.offer} onChange={this.handleChange} className="form-select">
                  <option value="S">Standard</option>
                  <option value="M">Match</option>
                  <option value="E">Event</option>
                  <option value="A">Advocacy</option>
                  <option value="F">Fundraise</option>
                  <option value="C">Challenge</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Ask Type</h6>
               <small>Position 7</small></label><br></br>
                <select name="askType" value={this.state.code.askType} onChange={this.handleChange} className="form-select">
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">Sustainer</option>
                  <option value="5">Upgrade</option>
                  <option value="6">Advocacy</option>
                  <option value="7">Fundraise</option>
                  <option value="8">Engage</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Region</h6>
                <small>Position 8 & 9</small></label><br></br>
                <select name="region" value={this.state.code.region} onChange={this.handleChange} className="form-select">
                  <option value="00">US</option>
                  <option value="01">AK</option>
                  <option value="02">AL</option>
                  <option value="03">AR</option>
                  <option value="04">AZ</option>
                  <option value="05">CA</option>
                  <option value="06">CO</option>
                  <option value="07">CT</option>
                  <option value="08">DE</option>
                  <option value="09">FL</option>
                  <option value="10">GA</option>
                  <option value="11">HI</option>
                  <option value="12">IA</option>
                  <option value="13">ID</option>
                  <option value="14">IL</option>
                  <option value="15">IN</option>
                  <option value="16">KS</option>
                  <option value="17">KY</option>
                  <option value="18">LA</option>
                  <option value="19">MA</option>
                  <option value="20">MD</option>
                  <option value="21">ME</option>
                  <option value="22">MI</option>
                  <option value="23">MN</option>
                  <option value="24">MO</option>
                  <option value="25">MS</option>
                  <option value="26">MT</option>
                  <option value="27">NC</option>
                  <option value="28">ND</option>
                  <option value="29">NE</option>
                  <option value="30">NH</option>
                  <option value="31">NJ</option>
                  <option value="32">NM</option>
                  <option value="33">NV</option>
                  <option value="34">NY</option>
                  <option value="35">OH</option>
                  <option value="36">OK</option>
                  <option value="37">OR</option>
                  <option value="38">PA</option>
                  <option value="39">RI</option>
                  <option value="40">SC</option>
                  <option value="41">SD</option>
                  <option value="42">TN</option>
                  <option value="43">TX</option>
                  <option value="44">UT</option>
                  <option value="45">VA</option>
                  <option value="46">VT</option>
                  <option value="47">WA</option>
                  <option value="48">WI</option>
                  <option value="49">WV</option>
                  <option value="50">WY</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 10-15</small></label><br></br>
                <select name="evergreen" value={this.state.code.evergreen} onChange={this.handleChange} className="form-select">
                  <option value="">Not Evergreen</option>
                  <option value="999999">Evergreen</option>
                </select>
            </div>
          </div>
          { this.evergreenCheck() }
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Effort</h6>
                <small>Position 16</small></label><br></br>
                <select name="effort" value={this.state.code.effort} onChange={this.handleChange} className="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
            </div>
          </div> 
          </> )
      case 'V':
        return ( 
          <>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>      
              <label>
                <h6>Audience</h6>
                <small>Position 2</small></label><br></br>
                <select name="audience" value={this.state.code.audience} onChange={this.handleChange} className="form-select">
                  <option value="0">Acquisition</option>
                  <option value="1">Prospects</option>
                  <option value="2">Current Donors</option>
                  <option value="3">Sustainers</option>
                  <option value="4">Midlevel</option>
                  <option value="5">Major Gifts</option>
                  <option value="6">Activists</option>
                  <option value="7">Streamers</option>
                  <option value="8">Culinary</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            { this.renderReCampaignId() }
          </div>
          <div className="col-12 mt-3 mb-3">
            <div className="form-group">      
              <label>
                <h6>Other</h6>
                <small>Position 1</small></label><br></br>
                <select name="channelVariable" value={this.state.code.channelVariable} onChange={this.handleChange} className="form-select">
                  <option value="X">General</option>
                </select>
            </div> 
          </div>
          <div className="col-4 mt-3 mb-3">          
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Paid / Unpaid</h6>
                <small>Position 4</small></label><br></br>
                <select name="pu" value={this.state.code.pu} onChange={this.handleChange} className="form-select">
                  <option value="U">Unpaid</option>
                  <option value="P">Paid</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Solicitor</h6>
                <small>Position 5</small></label><br></br>
                <select name="solicitor" value={this.state.code.solicitor} onChange={this.handleChange} className="form-select">
                  <option value="N">NKH</option>
                  <option value="S">SOS</option>
                  <option value="G">Major Gifts</option>
                  <option value="M">Midlevel Relationship Manager</option>
                  <option value="P">Display</option>
                  <option value="T">Telemarketing</option>
                  <option value="C">Direct Mail</option>
                  <option value="D">DRTV</option>
                  <option value="F">P2P</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Offer</h6>
                <small>Position 6</small></label><br></br>
                <select name="offer" value={this.state.code.offer} onChange={this.handleChange} className="form-select">
                  <option value="S">Standard</option>
                  <option value="M">Match</option>
                  <option value="E">Event</option>
                  <option value="A">Advocacy</option>
                  <option value="F">Fundraise</option>
                  <option value="C">Challenge</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Ask Type</h6>
               <small>Position 7</small></label><br></br>
                <select name="askType" value={this.state.code.askType} onChange={this.handleChange} className="form-select">
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">Sustainer</option>
                  <option value="5">Upgrade</option>
                  <option value="6">Advocacy</option>
                  <option value="7">Fundraise</option>
                  <option value="8">Engage</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Region</h6>
                <small>Position 8 & 9</small></label><br></br>
                <select name="region" value={this.state.code.region} onChange={this.handleChange} className="form-select">
                  <option value="00">US</option>
                  <option value="01">AK</option>
                  <option value="02">AL</option>
                  <option value="03">AR</option>
                  <option value="04">AZ</option>
                  <option value="05">CA</option>
                  <option value="06">CO</option>
                  <option value="07">CT</option>
                  <option value="08">DE</option>
                  <option value="09">FL</option>
                  <option value="10">GA</option>
                  <option value="11">HI</option>
                  <option value="12">IA</option>
                  <option value="13">ID</option>
                  <option value="14">IL</option>
                  <option value="15">IN</option>
                  <option value="16">KS</option>
                  <option value="17">KY</option>
                  <option value="18">LA</option>
                  <option value="19">MA</option>
                  <option value="20">MD</option>
                  <option value="21">ME</option>
                  <option value="22">MI</option>
                  <option value="23">MN</option>
                  <option value="24">MO</option>
                  <option value="25">MS</option>
                  <option value="26">MT</option>
                  <option value="27">NC</option>
                  <option value="28">ND</option>
                  <option value="29">NE</option>
                  <option value="30">NH</option>
                  <option value="31">NJ</option>
                  <option value="32">NM</option>
                  <option value="33">NV</option>
                  <option value="34">NY</option>
                  <option value="35">OH</option>
                  <option value="36">OK</option>
                  <option value="37">OR</option>
                  <option value="38">PA</option>
                  <option value="39">RI</option>
                  <option value="40">SC</option>
                  <option value="41">SD</option>
                  <option value="42">TN</option>
                  <option value="43">TX</option>
                  <option value="44">UT</option>
                  <option value="45">VA</option>
                  <option value="46">VT</option>
                  <option value="47">WA</option>
                  <option value="48">WI</option>
                  <option value="49">WV</option>
                  <option value="50">WY</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 10-15</small></label><br></br>
                <select name="evergreen" value={this.state.code.evergreen} onChange={this.handleChange} className="form-select">
                  <option value="">Not Evergreen</option>
                  <option value="999999">Evergreen</option>
                </select>
            </div>
          </div>
          { this.evergreenCheck() }
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Effort</h6>
                <small>Position 16</small></label><br></br>
                <select name="effort" value={this.state.code.effort} onChange={this.handleChange} className="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
            </div>
          </div> 
          </> )
      case 'T':
        return ( 
          <>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>      
              <label>
                <h6>Audience</h6>
                <small>Position 2</small></label><br></br>
                <select name="audience" value={this.state.code.audience} onChange={this.handleChange} className="form-select">
                  <option value="0">Acquisition</option>
                  <option value="1">Prospects</option>
                  <option value="2">Current Donors</option>
                  <option value="3">Sustainers</option>
                  <option value="4">Midlevel</option>
                  <option value="5">Major Gifts</option>
                  <option value="6">Activists</option>
                  <option value="7">Streamers</option>
                  <option value="8">Culinary</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            { this.renderReCampaignId() }
          </div>
          <div className="col-12 mt-3 mb-3">
            <div className="form-group">      
              <label>
                <h6>Other</h6>
                <small>Position 1</small></label><br></br>
                <select name="channelVariable" value={this.state.code.channelVariable} onChange={this.handleChange} className="form-select">
                  <option value="X">General</option>
                </select>
            </div> 
          </div>
          <div className="col-4 mt-3 mb-3">          
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Paid / Unpaid</h6>
                <small>Position 4</small></label><br></br>
                <select name="pu" value={this.state.code.pu} onChange={this.handleChange} className="form-select">
                  <option value="U">Unpaid</option>
                  <option value="P">Paid</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Solicitor</h6>
                <small>Position 5</small></label><br></br>
                <select name="solicitor" value={this.state.code.solicitor} onChange={this.handleChange} className="form-select">
                  <option value="N">NKH</option>
                  <option value="S">SOS</option>
                  <option value="G">Major Gifts</option>
                  <option value="M">Midlevel Relationship Manager</option>
                  <option value="P">Display</option>
                  <option value="T">Telemarketing</option>
                  <option value="C">Direct Mail</option>
                  <option value="D">DRTV</option>
                  <option value="F">P2P</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Offer</h6>
                <small>Position 6</small></label><br></br>
                <select name="offer" value={this.state.code.offer} onChange={this.handleChange} className="form-select">
                  <option value="S">Standard</option>
                  <option value="M">Match</option>
                  <option value="E">Event</option>
                  <option value="A">Advocacy</option>
                  <option value="F">Fundraise</option>
                  <option value="C">Challenge</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Ask Type</h6>
               <small>Position 7</small></label><br></br>
                <select name="askType" value={this.state.code.askType} onChange={this.handleChange} className="form-select">
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">Sustainer</option>
                  <option value="5">Upgrade</option>
                  <option value="6">Advocacy</option>
                  <option value="7">Fundraise</option>
                  <option value="8">Engage</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Region</h6>
                <small>Position 8 & 9</small></label><br></br>
                <select name="region" value={this.state.code.region} onChange={this.handleChange} className="form-select">
                  <option value="00">US</option>
                  <option value="01">AK</option>
                  <option value="02">AL</option>
                  <option value="03">AR</option>
                  <option value="04">AZ</option>
                  <option value="05">CA</option>
                  <option value="06">CO</option>
                  <option value="07">CT</option>
                  <option value="08">DE</option>
                  <option value="09">FL</option>
                  <option value="10">GA</option>
                  <option value="11">HI</option>
                  <option value="12">IA</option>
                  <option value="13">ID</option>
                  <option value="14">IL</option>
                  <option value="15">IN</option>
                  <option value="16">KS</option>
                  <option value="17">KY</option>
                  <option value="18">LA</option>
                  <option value="19">MA</option>
                  <option value="20">MD</option>
                  <option value="21">ME</option>
                  <option value="22">MI</option>
                  <option value="23">MN</option>
                  <option value="24">MO</option>
                  <option value="25">MS</option>
                  <option value="26">MT</option>
                  <option value="27">NC</option>
                  <option value="28">ND</option>
                  <option value="29">NE</option>
                  <option value="30">NH</option>
                  <option value="31">NJ</option>
                  <option value="32">NM</option>
                  <option value="33">NV</option>
                  <option value="34">NY</option>
                  <option value="35">OH</option>
                  <option value="36">OK</option>
                  <option value="37">OR</option>
                  <option value="38">PA</option>
                  <option value="39">RI</option>
                  <option value="40">SC</option>
                  <option value="41">SD</option>
                  <option value="42">TN</option>
                  <option value="43">TX</option>
                  <option value="44">UT</option>
                  <option value="45">VA</option>
                  <option value="46">VT</option>
                  <option value="47">WA</option>
                  <option value="48">WI</option>
                  <option value="49">WV</option>
                  <option value="50">WY</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 10-15</small></label><br></br>
                <select name="evergreen" value={this.state.code.evergreen} onChange={this.handleChange} className="form-select">
                  <option value="">Not Evergreen</option>
                  <option value="999999">Evergreen</option>
                </select>
            </div>
          </div>
          { this.evergreenCheck() }
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Effort</h6>
                <small>Position 16</small></label><br></br>
                <select name="effort" value={this.state.code.effort} onChange={this.handleChange} className="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
            </div>
          </div> 
          </> )
      case 'D':
        return ( 
          <>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>      
              <label>
                <h6>Audience</h6>
                <small>Position 2</small></label><br></br>
                <select name="audience" value={this.state.code.audience} onChange={this.handleChange} className="form-select">
                  <option value="0">Acquisition</option>
                  <option value="1">Prospects</option>
                  <option value="2">Current Donors</option>
                  <option value="3">Sustainers</option>
                  <option value="4">Midlevel</option>
                  <option value="5">Major Gifts</option>
                  <option value="6">Activists</option>
                  <option value="7">Streamers</option>
                  <option value="8">Culinary</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            { this.renderReCampaignId() }
          </div>
          <div className="col-12 mt-3 mb-3">
            <div className="form-group">      
              <label>
                <h6>Other</h6>
                <small>Position 1</small></label><br></br>
                <select name="channelVariable" value={this.state.code.channelVariable} onChange={this.handleChange} className="form-select">
                  <option value="X">General</option>
                </select>
            </div> 
          </div>
          <div className="col-4 mt-3 mb-3">          
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Paid / Unpaid</h6>
                <small>Position 4</small></label><br></br>
                <select name="pu" value={this.state.code.pu} onChange={this.handleChange} className="form-select">
                  <option value="U">Unpaid</option>
                  <option value="P">Paid</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Solicitor</h6>
                <small>Position 5</small></label><br></br>
                <select name="solicitor" value={this.state.code.solicitor} onChange={this.handleChange} className="form-select">
                  <option value="N">NKH</option>
                  <option value="S">SOS</option>
                  <option value="G">Major Gifts</option>
                  <option value="M">Midlevel Relationship Manager</option>
                  <option value="P">Display</option>
                  <option value="T">Telemarketing</option>
                  <option value="C">Direct Mail</option>
                  <option value="D">DRTV</option>
                  <option value="F">P2P</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Offer</h6>
                <small>Position 6</small></label><br></br>
                <select name="offer" value={this.state.code.offer} onChange={this.handleChange} className="form-select">
                  <option value="S">Standard</option>
                  <option value="M">Match</option>
                  <option value="E">Event</option>
                  <option value="A">Advocacy</option>
                  <option value="F">Fundraise</option>
                  <option value="C">Challenge</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Ask Type</h6>
               <small>Position 7</small></label><br></br>
                <select name="askType" value={this.state.code.askType} onChange={this.handleChange} className="form-select">
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">Sustainer</option>
                  <option value="5">Upgrade</option>
                  <option value="6">Advocacy</option>
                  <option value="7">Fundraise</option>
                  <option value="8">Engage</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Region</h6>
                <small>Position 8 & 9</small></label><br></br>
                <select name="region" value={this.state.code.region} onChange={this.handleChange} className="form-select">
                  <option value="00">US</option>
                  <option value="01">AK</option>
                  <option value="02">AL</option>
                  <option value="03">AR</option>
                  <option value="04">AZ</option>
                  <option value="05">CA</option>
                  <option value="06">CO</option>
                  <option value="07">CT</option>
                  <option value="08">DE</option>
                  <option value="09">FL</option>
                  <option value="10">GA</option>
                  <option value="11">HI</option>
                  <option value="12">IA</option>
                  <option value="13">ID</option>
                  <option value="14">IL</option>
                  <option value="15">IN</option>
                  <option value="16">KS</option>
                  <option value="17">KY</option>
                  <option value="18">LA</option>
                  <option value="19">MA</option>
                  <option value="20">MD</option>
                  <option value="21">ME</option>
                  <option value="22">MI</option>
                  <option value="23">MN</option>
                  <option value="24">MO</option>
                  <option value="25">MS</option>
                  <option value="26">MT</option>
                  <option value="27">NC</option>
                  <option value="28">ND</option>
                  <option value="29">NE</option>
                  <option value="30">NH</option>
                  <option value="31">NJ</option>
                  <option value="32">NM</option>
                  <option value="33">NV</option>
                  <option value="34">NY</option>
                  <option value="35">OH</option>
                  <option value="36">OK</option>
                  <option value="37">OR</option>
                  <option value="38">PA</option>
                  <option value="39">RI</option>
                  <option value="40">SC</option>
                  <option value="41">SD</option>
                  <option value="42">TN</option>
                  <option value="43">TX</option>
                  <option value="44">UT</option>
                  <option value="45">VA</option>
                  <option value="46">VT</option>
                  <option value="47">WA</option>
                  <option value="48">WI</option>
                  <option value="49">WV</option>
                  <option value="50">WY</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 10-15</small></label><br></br>
                <select name="evergreen" value={this.state.code.evergreen} onChange={this.handleChange} className="form-select">
                  <option value="">Not Evergreen</option>
                  <option value="999999">Evergreen</option>
                </select>
            </div>
          </div>
          { this.evergreenCheck() }
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Effort</h6>
                <small>Position 16</small></label><br></br>
                <select name="effort" value={this.state.code.effort} onChange={this.handleChange} className="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
            </div>
          </div> 
          </> )
      case 'O':
        return ( 
          <>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>      
              <label>
                <h6>Audience</h6>
                <small>Position 2</small></label><br></br>
                <select name="audience" value={this.state.code.audience} onChange={this.handleChange} className="form-select">
                  <option value="0">Acquisition</option>
                  <option value="1">Prospects</option>
                  <option value="2">Current Donors</option>
                  <option value="3">Sustainers</option>
                  <option value="4">Midlevel</option>
                  <option value="5">Major Gifts</option>
                  <option value="6">Activists</option>
                  <option value="7">Streamers</option>
                  <option value="8">Culinary</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            { this.renderReCampaignId() }
          </div>
          <div className="col-12 mt-3 mb-3">
            <div className="form-group">      
              <label>
                <h6>Other</h6>
                <small>Position 1</small></label><br></br>
                <select name="channelVariable" value={this.state.code.channelVariable} onChange={this.handleChange} className="form-select">
                  <option value="X">General</option>
                </select>
            </div> 
          </div>
          <div className="col-4 mt-3 mb-3">          
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Paid / Unpaid</h6>
                <small>Position 4</small></label><br></br>
                <select name="pu" value={this.state.code.pu} onChange={this.handleChange} className="form-select">
                  <option value="U">Unpaid</option>
                  <option value="P">Paid</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Solicitor</h6>
                <small>Position 5</small></label><br></br>
                <select name="solicitor" value={this.state.code.solicitor} onChange={this.handleChange} className="form-select">
                  <option value="N">NKH</option>
                  <option value="S">SOS</option>
                  <option value="G">Major Gifts</option>
                  <option value="M">Midlevel Relationship Manager</option>
                  <option value="P">Display</option>
                  <option value="T">Telemarketing</option>
                  <option value="C">Direct Mail</option>
                  <option value="D">DRTV</option>
                  <option value="F">P2P</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Offer</h6>
                <small>Position 6</small></label><br></br>
                <select name="offer" value={this.state.code.offer} onChange={this.handleChange} className="form-select">
                  <option value="S">Standard</option>
                  <option value="M">Match</option>
                  <option value="E">Event</option>
                  <option value="A">Advocacy</option>
                  <option value="F">Fundraise</option>
                  <option value="C">Challenge</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Ask Type</h6>
               <small>Position 7</small></label><br></br>
                <select name="askType" value={this.state.code.askType} onChange={this.handleChange} className="form-select">
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">Sustainer</option>
                  <option value="5">Upgrade</option>
                  <option value="6">Advocacy</option>
                  <option value="7">Fundraise</option>
                  <option value="8">Engage</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Region</h6>
                <small>Position 8 & 9</small></label><br></br>
                <select name="region" value={this.state.code.region} onChange={this.handleChange} className="form-select">
                  <option value="00">US</option>
                  <option value="01">AK</option>
                  <option value="02">AL</option>
                  <option value="03">AR</option>
                  <option value="04">AZ</option>
                  <option value="05">CA</option>
                  <option value="06">CO</option>
                  <option value="07">CT</option>
                  <option value="08">DE</option>
                  <option value="09">FL</option>
                  <option value="10">GA</option>
                  <option value="11">HI</option>
                  <option value="12">IA</option>
                  <option value="13">ID</option>
                  <option value="14">IL</option>
                  <option value="15">IN</option>
                  <option value="16">KS</option>
                  <option value="17">KY</option>
                  <option value="18">LA</option>
                  <option value="19">MA</option>
                  <option value="20">MD</option>
                  <option value="21">ME</option>
                  <option value="22">MI</option>
                  <option value="23">MN</option>
                  <option value="24">MO</option>
                  <option value="25">MS</option>
                  <option value="26">MT</option>
                  <option value="27">NC</option>
                  <option value="28">ND</option>
                  <option value="29">NE</option>
                  <option value="30">NH</option>
                  <option value="31">NJ</option>
                  <option value="32">NM</option>
                  <option value="33">NV</option>
                  <option value="34">NY</option>
                  <option value="35">OH</option>
                  <option value="36">OK</option>
                  <option value="37">OR</option>
                  <option value="38">PA</option>
                  <option value="39">RI</option>
                  <option value="40">SC</option>
                  <option value="41">SD</option>
                  <option value="42">TN</option>
                  <option value="43">TX</option>
                  <option value="44">UT</option>
                  <option value="45">VA</option>
                  <option value="46">VT</option>
                  <option value="47">WA</option>
                  <option value="48">WI</option>
                  <option value="49">WV</option>
                  <option value="50">WY</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 10-15</small></label><br></br>
                <select name="evergreen" value={this.state.code.evergreen} onChange={this.handleChange} className="form-select">
                  <option value="">Not Evergreen</option>
                  <option value="999999">Evergreen</option>
                </select>
            </div>
          </div>
          { this.evergreenCheck() }
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Effort</h6>
                <small>Position 16</small></label><br></br>
                <select name="effort" value={this.state.code.effort} onChange={this.handleChange} className="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
            </div>
          </div> 
          </> )        
      case 'S':
        return (
          <> 
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>      
              <label>
                <h6>Audience</h6>
                <small>Position 2</small></label><br></br>
                <select name="audience" value={this.state.code.audience} onChange={this.handleChange} className="form-select">
                  <option value="0">Acquisition</option>
                  <option value="1">Prospects</option>
                  <option value="2">Current Donors</option>
                  <option value="3">Sustainers</option>
                  <option value="4">Midlevel</option>
                  <option value="5">Major Gifts</option>
                  <option value="6">Activists</option>
                  <option value="7">Streamers</option>
                  <option value="8">Culinary</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            { this.renderReCampaignId() }
          </div>
          <div className="col-12 mt-3 mb-3">
            <div className="form-group">      
              <label>
                <h6>Social Media</h6>
                <small>Position 1</small></label><br></br>
                <select name="channelVariable" value={this.state.code.channelVariable} onChange={this.handleChange} className="form-select">
                  <option value="F">Facebook</option>
                  <option value="I">Instagram</option>
                  <option value="T">Twitter</option>
                  <option value="L">LinkedIn</option>
                  <option value="K">TikTok</option>
                  <option value="O">Other</option>
                </select>
            </div> 
          </div>
          <div className="col-4 mt-3 mb-3">          
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Paid / Unpaid</h6>
                <small>Position 4</small></label><br></br>
                <select name="pu" value={this.state.code.pu} onChange={this.handleChange} className="form-select">
                  <option value="U">Unpaid</option>
                  <option value="P">Paid</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Solicitor</h6>
                <small>Position 5</small></label><br></br>
                <select name="solicitor" value={this.state.code.solicitor} onChange={this.handleChange} className="form-select">
                  <option value="N">NKH</option>
                  <option value="S">SOS</option>
                  <option value="G">Major Gifts</option>
                  <option value="M">Midlevel Relationship Manager</option>
                  <option value="P">Display</option>
                  <option value="T">Telemarketing</option>
                  <option value="C">Direct Mail</option>
                  <option value="D">DRTV</option>
                  <option value="F">P2P</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Offer</h6>
                <small>Position 6</small></label><br></br>
                <select name="offer" value={this.state.code.offer} onChange={this.handleChange} className="form-select">
                  <option value="S">Standard</option>
                  <option value="M">Match</option>
                  <option value="E">Event</option>
                  <option value="A">Advocacy</option>
                  <option value="F">Fundraise</option>
                  <option value="C">Challenge</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Ask Type</h6>
               <small>Position 7</small></label><br></br>
                <select name="askType" value={this.state.code.askType} onChange={this.handleChange} className="form-select">
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">Sustainer</option>
                  <option value="5">Upgrade</option>
                  <option value="6">Advocacy</option>
                  <option value="7">Fundraise</option>
                  <option value="8">Engage</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Region</h6>
                <small>Position 8 & 9</small></label><br></br>
                <select name="region" value={this.state.code.region} onChange={this.handleChange} className="form-select">
                  <option value="00">US</option>
                  <option value="01">AK</option>
                  <option value="02">AL</option>
                  <option value="03">AR</option>
                  <option value="04">AZ</option>
                  <option value="05">CA</option>
                  <option value="06">CO</option>
                  <option value="07">CT</option>
                  <option value="08">DE</option>
                  <option value="09">FL</option>
                  <option value="10">GA</option>
                  <option value="11">HI</option>
                  <option value="12">IA</option>
                  <option value="13">ID</option>
                  <option value="14">IL</option>
                  <option value="15">IN</option>
                  <option value="16">KS</option>
                  <option value="17">KY</option>
                  <option value="18">LA</option>
                  <option value="19">MA</option>
                  <option value="20">MD</option>
                  <option value="21">ME</option>
                  <option value="22">MI</option>
                  <option value="23">MN</option>
                  <option value="24">MO</option>
                  <option value="25">MS</option>
                  <option value="26">MT</option>
                  <option value="27">NC</option>
                  <option value="28">ND</option>
                  <option value="29">NE</option>
                  <option value="30">NH</option>
                  <option value="31">NJ</option>
                  <option value="32">NM</option>
                  <option value="33">NV</option>
                  <option value="34">NY</option>
                  <option value="35">OH</option>
                  <option value="36">OK</option>
                  <option value="37">OR</option>
                  <option value="38">PA</option>
                  <option value="39">RI</option>
                  <option value="40">SC</option>
                  <option value="41">SD</option>
                  <option value="42">TN</option>
                  <option value="43">TX</option>
                  <option value="44">UT</option>
                  <option value="45">VA</option>
                  <option value="46">VT</option>
                  <option value="47">WA</option>
                  <option value="48">WI</option>
                  <option value="49">WV</option>
                  <option value="50">WY</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 10-15</small></label><br></br>
                <select name="evergreen" value={this.state.code.evergreen} onChange={this.handleChange} className="form-select">
                  <option value="">Not Evergreen</option>
                  <option value="999999">Evergreen</option>
                </select>
            </div>
          </div>
          { this.evergreenCheck() }
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Effort</h6>
                <small>Position 16</small></label><br></br>
                <select name="effort" value={this.state.code.effort} onChange={this.handleChange} className="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
            </div>
          </div>
          </> )
      case 'P':
        return (
          <> 
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>      
              <label>
                <h6>Audience</h6>
                <small>Position 2</small></label><br></br>
                <select name="audience" value={this.state.code.audience} onChange={this.handleChange} className="form-select">
                  <option value="0">Acquisition</option>
                  <option value="1">Prospects</option>
                  <option value="2">Current Donors</option>
                  <option value="3">Sustainers</option>
                  <option value="4">Midlevel</option>
                  <option value="5">Major Gifts</option>
                  <option value="6">Activists</option>
                  <option value="7">Streamers</option>
                  <option value="8">Culinary</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            { this.renderReCampaignId() }
          </div>
          <div className="col-12 mt-3 mb-3">
            <div className="form-group">      
              <label>
                <h6>Search</h6>
                <small>Position 1</small></label><br></br>
                <select name="channelVariable" value={this.state.code.channelVariable} onChange={this.handleChange} className="form-select">
                  <option value="G">Google</option>
                  <option value="B">Bing</option>
                </select>
            </div> 
          </div>
          <div className="col-4 mt-3 mb-3">          
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Paid / Unpaid</h6>
                <small>Position 4</small></label><br></br>
                <select name="pu" value={this.state.code.pu} onChange={this.handleChange} className="form-select">
                  <option value="U">Unpaid</option>
                  <option value="P">Paid</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Solicitor</h6>
                <small>Position 5</small></label><br></br>
                <select name="solicitor" value={this.state.code.solicitor} onChange={this.handleChange} className="form-select">
                  <option value="N">NKH</option>
                  <option value="S">SOS</option>
                  <option value="G">Major Gifts</option>
                  <option value="M">Midlevel Relationship Manager</option>
                  <option value="P">Display</option>
                  <option value="T">Telemarketing</option>
                  <option value="C">Direct Mail</option>
                  <option value="D">DRTV</option>
                  <option value="F">P2P</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Offer</h6>
                <small>Position 6</small></label><br></br>
                <select name="offer" value={this.state.code.offer} onChange={this.handleChange} className="form-select">
                  <option value="S">Standard</option>
                  <option value="M">Match</option>
                  <option value="E">Event</option>
                  <option value="A">Advocacy</option>
                  <option value="F">Fundraise</option>
                  <option value="C">Challenge</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Ask Type</h6>
               <small>Position 7</small></label><br></br>
                <select name="askType" value={this.state.code.askType} onChange={this.handleChange} className="form-select">
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">Sustainer</option>
                  <option value="5">Upgrade</option>
                  <option value="6">Advocacy</option>
                  <option value="7">Fundraise</option>
                  <option value="8">Engage</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Region</h6>
                <small>Position 8 & 9</small></label><br></br>
                <select name="region" value={this.state.code.region} onChange={this.handleChange} className="form-select">
                  <option value="00">US</option>
                  <option value="01">AK</option>
                  <option value="02">AL</option>
                  <option value="03">AR</option>
                  <option value="04">AZ</option>
                  <option value="05">CA</option>
                  <option value="06">CO</option>
                  <option value="07">CT</option>
                  <option value="08">DE</option>
                  <option value="09">FL</option>
                  <option value="10">GA</option>
                  <option value="11">HI</option>
                  <option value="12">IA</option>
                  <option value="13">ID</option>
                  <option value="14">IL</option>
                  <option value="15">IN</option>
                  <option value="16">KS</option>
                  <option value="17">KY</option>
                  <option value="18">LA</option>
                  <option value="19">MA</option>
                  <option value="20">MD</option>
                  <option value="21">ME</option>
                  <option value="22">MI</option>
                  <option value="23">MN</option>
                  <option value="24">MO</option>
                  <option value="25">MS</option>
                  <option value="26">MT</option>
                  <option value="27">NC</option>
                  <option value="28">ND</option>
                  <option value="29">NE</option>
                  <option value="30">NH</option>
                  <option value="31">NJ</option>
                  <option value="32">NM</option>
                  <option value="33">NV</option>
                  <option value="34">NY</option>
                  <option value="35">OH</option>
                  <option value="36">OK</option>
                  <option value="37">OR</option>
                  <option value="38">PA</option>
                  <option value="39">RI</option>
                  <option value="40">SC</option>
                  <option value="41">SD</option>
                  <option value="42">TN</option>
                  <option value="43">TX</option>
                  <option value="44">UT</option>
                  <option value="45">VA</option>
                  <option value="46">VT</option>
                  <option value="47">WA</option>
                  <option value="48">WI</option>
                  <option value="49">WV</option>
                  <option value="50">WY</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 10-15</small></label><br></br>
                <select name="evergreen" value={this.state.code.evergreen} onChange={this.handleChange} className="form-select">
                  <option value="">Not Evergreen</option>
                  <option value="999999">Evergreen</option>
                </select>
            </div>
          </div>
          { this.evergreenCheck() }
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Effort</h6>
                <small>Position 16</small></label><br></br>
                <select name="effort" value={this.state.code.effort} onChange={this.handleChange} className="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
            </div>
          </div>
          </> )
      case 'M':
        return ( 
          <>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>      
              <label>
                <h6>Audience</h6>
                <small>Position 2</small></label><br></br>
                <select name="audience" value={this.state.code.audience} onChange={this.handleChange} className="form-select">
                  <option value="0">Acquisition</option>
                  <option value="1">Prospects</option>
                  <option value="2">Current Donors</option>
                  <option value="3">Sustainers</option>
                  <option value="4">Midlevel</option>
                  <option value="5">Major Gifts</option>
                  <option value="6">Activists</option>
                  <option value="7">Streamers</option>
                  <option value="8">Culinary</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            { this.renderReCampaignId() }
          </div>
          <div className="col-12 mt-3 mb-3">
            <div className="form-group">      
              <label>
                <h6>Direct Mail</h6>
                <small>Position 1</small></label><br></br>
                <select name="channelVariable" value={this.state.code.channelVariable} onChange={this.handleChange} className="form-select">
                  <option value="A">Appeal</option>
                  <option value="U">Thank You</option>
                  <option value="K">Acknowledgement</option>
                  <option value="C">Cultivation</option>
                  <option value="S">Stewardship</option>
                  <option value="N">Newsletter</option>
                  <option value="L">Legacy Giving</option>
                  <option value="W">Welcome</option>
                </select>
            </div> 
          </div>
          <div className="col-4 mt-3 mb-3">          
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Paid / Unpaid</h6>
                <small>Position 4</small></label><br></br>
                <select name="pu" value={this.state.code.pu} onChange={this.handleChange} className="form-select">
                  <option value="U">Unpaid</option>
                  <option value="P">Paid</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Solicitor</h6>
                <small>Position 5</small></label><br></br>
                <select name="solicitor" value={this.state.code.solicitor} onChange={this.handleChange} className="form-select">
                  <option value="N">NKH</option>
                  <option value="S">SOS</option>
                  <option value="G">Major Gifts</option>
                  <option value="M">Midlevel Relationship Manager</option>
                  <option value="P">Display</option>
                  <option value="T">Telemarketing</option>
                  <option value="C">Direct Mail</option>
                  <option value="D">DRTV</option>
                  <option value="F">P2P</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Offer</h6>
                <small>Position 6</small></label><br></br>
                <select name="offer" value={this.state.code.offer} onChange={this.handleChange} className="form-select">
                  <option value="S">Standard</option>
                  <option value="M">Match</option>
                  <option value="E">Event</option>
                  <option value="A">Advocacy</option>
                  <option value="F">Fundraise</option>
                  <option value="C">Challenge</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Ask Type</h6>
               <small>Position 7</small></label><br></br>
                <select name="askType" value={this.state.code.askType} onChange={this.handleChange} className="form-select">
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">Sustainer</option>
                  <option value="5">Upgrade</option>
                  <option value="6">Advocacy</option>
                  <option value="7">Fundraise</option>
                  <option value="8">Engage</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Region</h6>
                <small>Position 8 & 9</small></label><br></br>
                <select name="region" value={this.state.code.region} onChange={this.handleChange} className="form-select">
                  <option value="00">US</option>
                  <option value="01">AK</option>
                  <option value="02">AL</option>
                  <option value="03">AR</option>
                  <option value="04">AZ</option>
                  <option value="05">CA</option>
                  <option value="06">CO</option>
                  <option value="07">CT</option>
                  <option value="08">DE</option>
                  <option value="09">FL</option>
                  <option value="10">GA</option>
                  <option value="11">HI</option>
                  <option value="12">IA</option>
                  <option value="13">ID</option>
                  <option value="14">IL</option>
                  <option value="15">IN</option>
                  <option value="16">KS</option>
                  <option value="17">KY</option>
                  <option value="18">LA</option>
                  <option value="19">MA</option>
                  <option value="20">MD</option>
                  <option value="21">ME</option>
                  <option value="22">MI</option>
                  <option value="23">MN</option>
                  <option value="24">MO</option>
                  <option value="25">MS</option>
                  <option value="26">MT</option>
                  <option value="27">NC</option>
                  <option value="28">ND</option>
                  <option value="29">NE</option>
                  <option value="30">NH</option>
                  <option value="31">NJ</option>
                  <option value="32">NM</option>
                  <option value="33">NV</option>
                  <option value="34">NY</option>
                  <option value="35">OH</option>
                  <option value="36">OK</option>
                  <option value="37">OR</option>
                  <option value="38">PA</option>
                  <option value="39">RI</option>
                  <option value="40">SC</option>
                  <option value="41">SD</option>
                  <option value="42">TN</option>
                  <option value="43">TX</option>
                  <option value="44">UT</option>
                  <option value="45">VA</option>
                  <option value="46">VT</option>
                  <option value="47">WA</option>
                  <option value="48">WI</option>
                  <option value="49">WV</option>
                  <option value="50">WY</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 10-15</small></label><br></br>
                <select name="evergreen" value={this.state.code.evergreen} onChange={this.handleChange} className="form-select">
                  <option value="">Not Evergreen</option>
                  <option value="999999">Evergreen</option>
                </select>
            </div>
          </div>
          { this.evergreenCheck() }
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Effort</h6>
                <small>Position 16</small></label><br></br>
                <select name="effort" value={this.state.code.effort} onChange={this.handleChange} className="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
            </div>
          </div>
          </> )
      case 'C':
        return ( 
          <>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>      
              <label>
                <h6>Audience</h6>
                <small>Position 2</small></label><br></br>
                <select name="audience" value={this.state.code.audience} onChange={this.handleChange} className="form-select">
                  <option value="0">Acquisition</option>
                  <option value="1">Prospects</option>
                  <option value="2">Current Donors</option>
                  <option value="3">Sustainers</option>
                  <option value="4">Midlevel</option>
                  <option value="5">Major Gifts</option>
                  <option value="6">Activists</option>
                  <option value="7">Streamers</option>
                  <option value="8">Culinary</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            { this.renderReCampaignId() }
          </div>
          <div className="col-12 mt-3 mb-3">
            <div className="form-group">      
              <label>
                <h6>P2P</h6>
                <small>Position 1</small></label><br></br>
                <select name="channelVariable" value={this.state.code.channelVariable} onChange={this.handleChange} className="form-select">
                  <option value="A">Appeal</option>
                  <option value="U">Thank You</option>
                  <option value="K">Acknowledgement</option>
                  <option value="C">Cultivation</option>
                  <option value="S">Stewardship</option>
                  <option value="N">Newsletter</option>
                  <option value="L">Legacy Giving</option>
                  <option value="W">Welcome</option>
                </select>
            </div> 
          </div>
          <div className="col-4 mt-3 mb-3">          
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Paid / Unpaid</h6>
                <small>Position 4</small></label><br></br>
                <select name="pu" value={this.state.code.pu} onChange={this.handleChange} className="form-select">
                  <option value="U">Unpaid</option>
                  <option value="P">Paid</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Solicitor</h6>
                <small>Position 5</small></label><br></br>
                <select name="solicitor" value={this.state.code.solicitor} onChange={this.handleChange} className="form-select">
                  <option value="N">NKH</option>
                  <option value="S">SOS</option>
                  <option value="G">Major Gifts</option>
                  <option value="M">Midlevel Relationship Manager</option>
                  <option value="P">Display</option>
                  <option value="T">Telemarketing</option>
                  <option value="C">Direct Mail</option>
                  <option value="D">DRTV</option>
                  <option value="F">P2P</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Offer</h6>
                <small>Position 6</small></label><br></br>
                <select name="offer" value={this.state.code.offer} onChange={this.handleChange} className="form-select">
                  <option value="S">Standard</option>
                  <option value="M">Match</option>
                  <option value="E">Event</option>
                  <option value="A">Advocacy</option>
                  <option value="F">Fundraise</option>
                  <option value="C">Challenge</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Ask Type</h6>
               <small>Position 7</small></label><br></br>
                <select name="askType" value={this.state.code.askType} onChange={this.handleChange} className="form-select">
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">Sustainer</option>
                  <option value="5">Upgrade</option>
                  <option value="6">Advocacy</option>
                  <option value="7">Fundraise</option>
                  <option value="8">Engage</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Region</h6>
                <small>Position 8 & 9</small></label><br></br>
                <select name="region" value={this.state.code.region} onChange={this.handleChange} className="form-select">
                  <option value="00">US</option>
                  <option value="01">AK</option>
                  <option value="02">AL</option>
                  <option value="03">AR</option>
                  <option value="04">AZ</option>
                  <option value="05">CA</option>
                  <option value="06">CO</option>
                  <option value="07">CT</option>
                  <option value="08">DE</option>
                  <option value="09">FL</option>
                  <option value="10">GA</option>
                  <option value="11">HI</option>
                  <option value="12">IA</option>
                  <option value="13">ID</option>
                  <option value="14">IL</option>
                  <option value="15">IN</option>
                  <option value="16">KS</option>
                  <option value="17">KY</option>
                  <option value="18">LA</option>
                  <option value="19">MA</option>
                  <option value="20">MD</option>
                  <option value="21">ME</option>
                  <option value="22">MI</option>
                  <option value="23">MN</option>
                  <option value="24">MO</option>
                  <option value="25">MS</option>
                  <option value="26">MT</option>
                  <option value="27">NC</option>
                  <option value="28">ND</option>
                  <option value="29">NE</option>
                  <option value="30">NH</option>
                  <option value="31">NJ</option>
                  <option value="32">NM</option>
                  <option value="33">NV</option>
                  <option value="34">NY</option>
                  <option value="35">OH</option>
                  <option value="36">OK</option>
                  <option value="37">OR</option>
                  <option value="38">PA</option>
                  <option value="39">RI</option>
                  <option value="40">SC</option>
                  <option value="41">SD</option>
                  <option value="42">TN</option>
                  <option value="43">TX</option>
                  <option value="44">UT</option>
                  <option value="45">VA</option>
                  <option value="46">VT</option>
                  <option value="47">WA</option>
                  <option value="48">WI</option>
                  <option value="49">WV</option>
                  <option value="50">WY</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 10-15</small></label><br></br>
                <select name="evergreen" value={this.state.code.evergreen} onChange={this.handleChange} className="form-select">
                  <option value="">Not Evergreen</option>
                  <option value="999999">Evergreen</option>
                </select>
            </div>
          </div>
          { this.evergreenCheck() }
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Effort</h6>
                <small>Position 16</small></label><br></br>
                <select name="effort" value={this.state.code.effort} onChange={this.handleChange} className="form-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
            </div>
          </div>
          </> )
      default:
        return null
    }
  }

  /*
            <div className="form-group">      
              <label>
                <h6>Other</h6>
                <small>Position 1</small></label><br></br>
                <select name="channelVariable" value={this.state.code.channelVariable} onChange={this.handleChange} className="form-select">
                  <option value="X">General</option>
                </select>
            </div> 
  */

  renderReCampaignId = () => {
    // Show conditional options based on Audience
    switch(this.state.code.audience) {
      case '3':
        return ( <div className="form-group">      
              <label>
                <h6>RE Campaign ID Sustainers</h6>
                <small>Position 3</small></label><br></br>
                <select name="reCampaignId" value={this.state.code.reCampaignId} onChange={this.handleChange} className="form-select">
                  <option value="1">New</option>
                  <option value="2">Lapsing/Delinquent</option>
                  <option value="3">Recaptured</option>
                  <option value="4">Lapsed</option>
                  <option value="5">Reactivated</option>
                  <option value="6">Cancelled</option>
                </select>
          </div> )
      default:
        return ( <div className="form-group">      
              <label>
                <h6>RE Campaign ID</h6>
                <small>Position 3</small></label><br></br>
                <select name="reCampaignId" value={this.state.code.reCampaignId} onChange={this.handleChange} className="form-select">
                  <option value="DE720">Membership</option>
                  <option value="DE721">Offline Direct Response</option>
                  <option value="DE722">Digital Direct Response</option>
                  <option value="DE723">Street Teams</option>
                  <option value="DE724">DRTV</option>
                  <option value="DE725">Foodathon</option>
                  <option value="GR610">Grassroots - Great American Bake Sale</option>
                  <option value="GR640">Grassroots - Personal Fundraising</option>
                </select>
          </div> )
    } 
  }

  evergreenCheck = () => {
    switch(this.state.code.evergreen) {
      case '0':
        return ( <><div className="col-4 mt-3 mb-3">
          <div className="form-group">
              <label>
                <h6>Date</h6>
                <small>Position 10-11</small></label><br></br>
                <select name="year" value={this.state.code.year} onChange={this.handleChange} className="form-select">
                  <option value="22">2022</option>
                  <option value="23">2023</option>
                  <option value="24">2024</option>
                  <option value="25">2025</option>
                  <option value="26">2026</option>
                  <option value="27">2027</option>
                  <option value="28">2028</option>
                  <option value="29">2029</option>
                  <option value="30">2030</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 12-13</small></label><br></br>
                <select name="month" value={this.state.code.month} onChange={this.handleChange} className="form-select">
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
            </div>
          </div>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Date</h6>
                <small>Position 14-15</small></label><br></br>
                <select name="day" value={this.state.code.day} onChange={this.handleChange} className="form-select">
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                  <option value="22">22</option>
                  <option value="23">23</option>
                  <option value="24">24</option>
                  <option value="25">25</option>
                  <option value="26">26</option>
                  <option value="27">27</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                  <option value="30">30</option>
                  <option value="31">31</option>
                </select>
            </div>
          </div></> )
      default:
        return null
    }     
  }

  render() {
    let {changeAskChannel} = this.state;
    return (
      <div className="container mt-5">
        <Navbar expand="lg">
          <Navbar.Brand href="#"><h2>Source Code Generator</h2></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#generator">Generator</Nav.Link>
              <Nav.Link href="#interpreter">Interpreter</Nav.Link>
              <Nav.Link href="#list">List</Nav.Link>                
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <hr></hr>
        <form className="row" onSubmit={this.handleSubmit}>
          <div className="col-4 mt-3 mb-3">
            <div className="form-group" disabled={this.state.submitting}>
              <label>
                <h6>Ask Channel</h6>              
      	        <small>Position 0</small></label><br></br>
                <select name="askChannel"  onChange={this.handleChange} className="form-select">
                  <option value="W">Web</option>
                  <option value="S">Social Media</option>
                  <option value="O">Mobile</option>
                  <option value="P">Search</option>
                  <option value="D">Display</option>
                  <option value="T">Telemarketing</option>
                  <option value="M">Direct Mail</option>
                  <option value="V">DRTV</option>
                  <option value="C">P2P</option>
                  <option value="K">Street Teams</option>
                  <option value="E">Email</option>
                </select>
            </div>
          </div>
          { changeAskChannel && ( this.renderChannelVariables() )}
          <div className="col-12 mt-3 mb-3">     
            <button type="submit" disabled={this.state.submitting} className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

export default App;
