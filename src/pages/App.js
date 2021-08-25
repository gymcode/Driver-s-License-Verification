/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-deprecated */
import React, { Component } from 'react'
import { Switch, Route,} from 'react-router-dom'
import { connect } from 'react-redux'

import Console from './console'
import Identity from './identity'
// import Versions from './_Versions'
import Init from './_Init'

import { init } from 'actions/Network'
import AccountChooser from 'components/AccountChooser'

import { selectAccount, setCurrency, loadWallet } from 'actions/Wallet'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.initNetwork()
  }

  componentWillUnmount() {
    clearTimeout(this.hideNotice)
  }

  componentDidUpdate(prevProps) {
    if (
      window.innerWidth <= 575 &&
      this.props.location !== prevProps.location
    ) {
      window.scrollTo(0, 0)
    }
  }

  componentWillReceiveProps(nextProps) {
    // If no accounts are present, pre-populate for an easier demo experience.
    if (
      !this.props.wallet.loaded &&
      nextProps.wallet.loaded &&
      !nextProps.wallet.activeAddress
    ) {
      window.sessionStorage.privateKeys = JSON.stringify([
        // "0x24f3c3b01a0783948380fb683a9712f079e7d249c0461e1f40054b10b1bb0b23", // accounts[0] ClaimSignerKey
        //TODO
        // "0xd6079ba5123c57b9a8cb3e1fbde9f879c7a18eeca23fa2a965e8181d3ff59f0c",    // accounts[1] Identity
        // "0x20ea25d6c8d99bea5e81918d805b4268d950559b36c5e1cfcbb1cda0197faa08",    // accounts[2] Certifier
        // "0x25acb0da38f5364588f78b4e1f33c4a3981354c9b044d64bf201aad8f38f50ae",    // accounts[3] ClaimChecker
        '0x1aae4f8918c2c1fa3f911415491a49e541a528233da3a54df21e7eea5c675cd9',
        '0x7a8be97032a5c719d2cea4e4adaed0620e9fa9e49e2ccf689daf9180e3638f93',
        '0x85a676919234e90007b20bf3ae6b54b455b62b42bf298ac03669d164e4689c49'
      ])
      this.props.loadWallet()
      this.setState({ preloaded: true })
      this.hideNotice = setTimeout(
        () => this.setState({ preloaded: false }),
        3344
      )
    }
  }

  render() {
    return (
      <div>
        <Init onClose={() => this.props.history.push('/')} />
        {/* <nav className="navbar navbar-expand-sm ">
          <div className="container-fluid">
            <Link
              to="/"
              className="navbar-brand mr-3"
              onClick={() => this.setState({ toggled: false })}
            >
              <a href="http://localhost:3344/#/">DriLVerify</a>
              <a href="https://identity.vboss.tech">DriLVerify</a>
              
            </Link>
            
            <button
              className="navbar-toggler"
              type="button"
              onClick={() =>
                this.setState({
                  toggled: this.state.toggled ? false : true
                })
              }
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              className={`navbar-collapse collapse${
                this.state.toggled ? ' show' : ''
              }`}
            >
              <ul className="navbar-nav ml-auto text-right">
                {this.props.account &&
                  this.props.wallet && (
                    <li className="nav-item">
                      <AccountChooser
                        balance={this.props.balance}
                        wallet={this.props.wallet}
                        account={this.props.account}
                        selectAccount={a => this.props.selectAccount(a)}
                        setCurrency={c => this.props.setCurrency(c)}
                      />
                    </li>
                  )}
              </ul>
            </div>
          </div>
        </nav> */}

        <div className={"contained"}>
        <div style={{fontSize: 40, fontWeight: '900', color: "#1f3528"}} className={"d-flex justify-content-center"}>
          Driver's License <span style={{color: "#58b983", paddingLeft: 10, paddingRight: 10}}> Verification </span> System
        </div>
        <div style={{fontSize: 17, fontWeight: "lighter", color: '#999'}} className={"d-flex justify-content-center"}>Using ERC 725 and 735 concept</div>

        <div className="shadow" style={{marginTop: "3%"}}>
          {/* {!this.state.preloaded ? null : (
            <div className="alert alert-info mt-3">
              Logged in with a sample account!
              <a
                className="close"
                href="#"
                onClick={e => {
                  e.preventDefault()
                  this.setState({ preloaded: false })
                }}
              >
                &times;
              </a>
            </div>
          )} */}
          <div>
            <Switch>
              <Route path="/console" component={Console} />
              <Route path="/identity/:address" component={Identity} />
              <Route path="/claim-checker/:address" component={Identity} />
              <Route component={Identity} />
            </Switch>
          </div>
        </div>
        <div className="footer">
           {/* footer is there is one   */}
          <div className="hello">
            <div className="btn_btn">
            {this.props.account &&
                this.props.wallet && (
                  <AccountChooser
                    balance={this.props.balance}
                    wallet={this.props.wallet}
                    account={this.props.account}
                    selectAccount={a => this.props.selectAccount(a)}
                    setCurrency={c => this.props.setCurrency(c)}
                  />
              )}
            </div>
          </div>   
        </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  account: state.wallet.activeAddress,
  balance: state.wallet.balances[state.wallet.activeAddress],
  wallet: state.wallet,
  nodeAccounts: state.network.accounts
})

const mapDispatchToProps = dispatch => ({
  initNetwork: () => {
    dispatch(init())
  },
  loadWallet: () => {
    dispatch(loadWallet())
  },
  selectAccount: hash => dispatch(selectAccount(hash)),
  setCurrency: currency => dispatch(setCurrency(currency))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

require('react-styl')(`
  table.table
    thead tr th
      border-top: 0
    .btn-sm
      padding: 0.125rem 0.375rem
  .contained
    padding-top: 4%
    height: 120vh
    background-color: #f0f1f5;
    background-image: url("https://www.transparenttextures.com/patterns/concrete-wall.png");
    /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
    
  .navbar
    border-bottom: 1px solid #E5E9EF;
    -webkit-box-shadow: -2px 0px 7px -2px rgba(31,53,40,0.30); 
    box-shadow: -2px 0px 7px -2px rgba(31,53,40,0.30);
  .navbar-light .navbar-text .dropdown-item.active,
  .navbar-light .navbar-text .dropdown-item:active
    color: #fff;
  .pointer
    cursor: pointer
  .shadow
    -webkit-box-shadow: -1px 2px 80px -30px rgba(7,25,38,0.31);
    box-shadow: -1px 2px 80px -30px rgba(7,25,38,0.31);
    background: white
    margin-right: 12%
    margin-left: 12%
    padding: 3%
  .no-wrap
    white-space: nowrap
  .hello
    width: 88%
    display: flex
    color: red
    justify-content: flex-end
  .btn_btn
    width: 16%
    color: white
    background: #58b983
    border: 1px solid 
    border-color: #58b983
    border-radius: 10px
  .footer
    display: flex
    justify-content: between
    color: #000;
    margin: 1rem 0;
    padding-top: 1rem;
    
    font-size: 14px;
    a
      color: #000;
    .middle
      flex: 1
      text-align: center
    .right
      flex: 1
      text-align: right
    .powered-by
      flex: 1
      font-size: 14px;
      letter-spacing: -0.01rem;
      img
        opacity: .4;
        height: 12px;
        margin-top: -2px
        margin-right: 0.25rem
`)
