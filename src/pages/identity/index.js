/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-deprecated */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import {MdPermIdentity} from 'react-icons/md'
import {BsBuilding} from 'react-icons/bs'
import {VscUnverified} from 'react-icons/vsc'
import {FcLock, FcUnlock} from 'react-icons/fc'
import {AiFillLock, AiFillUnlock} from 'react-icons/ai'

import {
  deployIdentityContract,
  deployClaimVerifier,
  importIdentityContract
} from 'actions/Identity'

import { selectAccount } from 'actions/Wallet'

import IdentityDetail from './IdentityDetail'
import ClaimCheckerDetail from './ClaimCheckerDetail'
import Home from './Home'

import NewVerifier from './modals/_NewVerifier'
import NewIdentity from './modals/_NewIdentity'
import NewClaimIssuer from './modals/_NewClaimIssuer'

function identityLogo(identity) {
  if (identity.official) {
    return (
      <img
        src="images/logo.png"
        style={{ height: 14, opacity: 0.6, verticalAlign: -1 }}
      />
    )
  }
  return identity.owner.substr(0, 6)
}

class Identity extends Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.identity.lastDeployedIdentity !==
      nextProps.identity.lastDeployedIdentity
    ) {
      this.props.history.push(
        `/identity/${nextProps.identity.lastDeployedIdentity}`
      )
    }
  }

  render() {
    var identities = this.props.identities.filter(i => i.type !== 'certifier')
    var certifiers = this.props.identities.filter(i => i.type === 'certifier')

    return (
      <div className="pt-3">
        <div className="row">
          <div className="col-md-6">
            <table
              className={`table table-sm${
                identities.length ? ' table-hover' : ''
              } identities-list`}
            >
              <thead>
                <tr>
                  <th className="">
                    <a
                        href="#"
                        style={{color: "#000"}}
                        className={"text-decoration-none"}
                        onClick={e => {
                          e.preventDefault()
                          this.setState({
                            identityType: 'identity',
                            deploy: true
                          })
                        }}
                        // onClick={e => {
                        //   e.preventDefault()
                        //   this.setState({
                        //     identityType: 'identity',
                        //     deploy: true
                        //   })
                        // }}
                    >   
                      <div className={'d-flex mt-3'}>
                        <MdPermIdentity size={22}/> <div className={"pl-2"}>License Holder</div> 
                      </div>
                    </a>
                    {/* {!identities.length ? null : (
                      <a
                        href="#"
                        className="ml-2"
                        onClick={e => {
                          e.preventDefault()
                          this.setState({
                            identityType: 'identity',
                            deploy: true
                          })
                        }}
                      >
                        <i className="fa fa-plus" />
                      </a>
                    )} */}
                  </th>
                  <th
                    className="border-top-0 text-center"
                    style={{ width: 80 }}
                  >
                    Address
                  </th>
                  <th
                    className="border-top-0 text-center"
                    style={{ width: 80 }}
                  >
                    Owner
                  </th>
                </tr>
              </thead>
              <tbody>
                {!identities.length && (
                  <tr>
                    <td colSpan={2} className="p-2">
                      <button
                        href="#"
                        style={{width: 200, height: 40, color: "#000", background: "#58b983"}}
                        className="btn btn-sm btn-outline-success"
                        onClick={e => {
                          e.preventDefault()
                          this.setState({
                            identityType: 'identity',
                            deploy: true
                          })
                        }}
                      >
                       Add an Identity
                      </button>
                    </td>
                  </tr>
                )}
                {identities.map((identity, idx) => (
                  <tr
                    key={idx}
                    onClick={() => {
                      this.selectIdentity(identity.address, 'identity')
                    }}
                    style={{ cursor: 'pointer' }}
                    className={this.rowCls(identity)}
                  >
                    <td>
                      <div className={"d-flex"}>
                        {
                          this.props.wallet.activeAddress === identity.owner
                          ? 
                          (
                            <>
                              <AiFillUnlock size={20} style={{marginRight: 10}}/>
                            </>
                          )
                          : 
                          (
                            <>
                              <AiFillLock size={20} style={{marginRight: 10}} />
                            </>
                          )
                        }                    
                      {identity.name}
                      </div>
                    </td>
                    <td className="text-center">
                      {!identity.address ? '' : identity.address.substr(0, 6)}
                    </td>
                    <td className="text-center">
                      {!identity.owner ? '' : identity.owner.substr(0, 6)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table
              className={`table table-sm${
                certifiers.length ? ' table-hover' : ''
              } certifiers-list`}
            >
              <thead>
                <tr>
                  <th>
                    {!certifiers.length ? null : (
                      <a
                        href="#"
                        style={{color: "#000"}}
                        className={"text-decoration-none"}
                        onClick={e => {
                          e.preventDefault()
                          this.setState({
                            identityType: 'certifier',
                            newClaimIssuer: true
                          })
                        }}
                      >
                        <div className={'d-flex mt-3'}>
                          <BsBuilding size={22}/> <div className={"pl-2"}>Claim Issuer (DVLA)</div>
                        </div>  
                      </a>
                    )}
                  </th>
                  <th className="text-center" style={{ width: 80 }}>
                    Address
                  </th>
                  <th className="text-center" style={{ width: 80 }}>
                    Owner
                  </th>
                </tr>
              </thead>
              <tbody>
                {!certifiers.length && (
                  <tr>
                    <td colSpan={3} className="p-2">
                      <button
                        href="#"
                        className="btn btn-sm btn-outline-success"
                        style={{width: "10%"}}
                        onClick={e => {
                          e.preventDefault()
                          this.setState({
                            identityType: 'certifier',
                            newClaimIssuer: true
                          })
                        }}
                      >
                        <i className="fa fa-plus" /> Add a Claim Issuer
                      </button>
                    </td>
                  </tr>
                )}
                {certifiers.map((identity, idx) => (
                  <tr
                    key={idx}
                    onClick={() =>
                      this.selectIdentity(identity.address, 'claim-issuer')
                    }
                    style={{ cursor: 'pointer' }}
                    className={this.rowCls(identity)}
                  >
                    <td>
                      <div className={"d-flex"}>
                        {
                          this.props.wallet.activeAddress === identity.owner
                          ? 
                          (
                            <>
                              <FcUnlock size={20} style={{marginRight: 10}}/>
                            </>
                          )
                          : 
                          (
                            <>
                              <FcLock size={20} style={{marginRight: 10}} />
                            </>
                          )
                        }                    
                      {identity.name}
                      </div>
                    </td>
                    <td className="text-center">
                      {!identity.address ? '' : identity.address.substr(0, 6)}
                    </td>
                    <td className="text-center">
                      {!identity.owner ? '' : identityLogo(identity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table
              className={`table table-sm${
                this.props.verifiers.length ? ' table-hover' : ''
              } protected-list`}
            >
              <thead>
                <tr>
                  <th>
                    <a
                      href="#" 
                      style={{color: "#000"}}
                      className={"text-decoration-none"}
                      onClick={e => {
                        e.preventDefault()
                        this.setState({ newVerifier: true })
                      }}
                    >
                      <div className={"d-flex mt-4"}>
                        <VscUnverified size={22}/> <div className={"pl-2"}>Claim Verifier(Police) </div>
                      </div>
                    </a>
                    {/* {!this.props.verifiers.length ? null : (
                      <a
                        href="#"
                        className="ml-2"
                        onClick={e => {
                          e.preventDefault()
                          this.setState({ newVerifier: true })
                        }}
                      >
                        <i className="fa fa-plus" />
                      </a>
                    )} */}
                  </th>
                  <th className="text-center" style={{ width: 80 }}>
                    Address
                  </th>
                  <th className="text-center" style={{ width: 80 }}>
                    Owner
                  </th>
                </tr>
              </thead>
              <tbody>
                {!this.props.verifiers.length && (
                  <tr>
                    <td colSpan={2} className="p-2">
                      <button
                        href="#"
                        style={{width: 200, height: 40, color: "#000", background: "#58b983"}}
                        className="btn btn-sm btn-outline-success"
                        onClick={e => {
                          e.preventDefault()
                          this.setState({ newVerifier: true })
                        }}
                      >
                        Add a Claim Verifier
                      </button>
                    </td>
                  </tr>
                )}
                {this.props.verifiers.map((verifier, idx) => {
                  return (
                    <tr
                      key={idx}
                      onClick={() =>
                        this.selectIdentity(verifier.address, 'protected')
                      }
                      style={{ cursor: 'pointer' }}
                      className={this.rowCls(verifier)}
                    >
                      <td>
                      <div className={"d-flex"}>
                        {
                           this.props.wallet.activeAddress === verifier.owner
                          ? 
                          (
                            <>
                              <AiFillUnlock size={20} style={{marginRight: 10}}/>
                            </>
                          )
                          : 
                          (
                            <>
                              <AiFillLock size={20} style={{marginRight: 10}} />
                            </>
                          )
                        }                    
                      {verifier.name}
                      </div>
                      </td>
                      <td className="text-center">
                        {!verifier.address ? '' : verifier.address.substr(0, 6)}
                      </td>
                      <td className="text-center">
                        {!verifier.owner ? '' : verifier.owner.substr(0, 6)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <Switch>
              <Route path="/identity/:identity" component={IdentityDetail} />
              <Route path="/claim-checker/:id" component={ClaimCheckerDetail} />
              <Route component={Home} />
            </Switch>
          </div>
        </div>

        {this.state.deploy && (
          <NewIdentity
            onClose={() => this.setState({ deploy: false })}
            identityType={this.state.identityType}
            identities={this.props.identities}
            certifiers={certifiers}
            activeAddress={this.props.wallet.activeAddress}
            response={this.props.identity.createIdentityResponse}
            deployIdentityContract={this.props.deployIdentityContract}
            import={this.props.importIdentityContract}
          />
        )}

        {this.state.newClaimIssuer && (
          <NewClaimIssuer
            onClose={() => this.setState({ newClaimIssuer: false })}
            identityType={this.state.identityType}
            identities={this.props.identities}
            certifiers={certifiers}
            activeAddress={this.props.wallet.activeAddress}
            response={this.props.identity.createIdentityResponse}
            deployIdentityContract={this.props.deployIdentityContract}
          />
        )}

        {this.state.newVerifier && (
          <NewVerifier
            onClose={() => this.setState({ newVerifier: false })}
            deployClaimVerifier={this.props.deployClaimVerifier}
            response={this.props.identity.createVerifierResponse}
            identities={certifiers}
          />
        )}
      </div>
    )
  }

  renderSignerServices(identity) {
    if (!identity.signerServices || !identity.signerServices.length) {
      return null
    }
    return (
      <>
        {identity.signerServices.map((ss, idx) => (
          <a
            target="_blank"
            className="btn btn-outline-secondary btn-sm mr-1"
            key={idx}
            href={ss.uri}
            onClick={e => this.onCertify(e, identity)}
          >
            <i className={`fa fa-${ss.icon}`} />
          </a>
        ))}
      </>
    )
  }

  selectIdentity(address, type) {
    var activeType = 'ClaimHolder'
    if (type === 'protected') {
      this.props.history.push(`/claim-checker/${address}`)
    } else {
      this.props.history.push(`/identity/${address}`)
    }
    this.setState({
      activeIdentity: address,
      activeType
    })
  }

  rowCls(identity) {
    var cls = ''
    if (this.props.wallet.activeAddress !== identity.owner) {
      cls += 'text-muted '
    }
    if (this.props.activeIdentity === identity.address) {
      if (this.props.wallet.activeAddress === identity.owner) {
        cls += 'table-warning'
      } else {
        cls += 'table-active'
      }
    }
    return cls
  }
}

const mapStateToProps = (state, ownProps) => ({
  identity: state.identity,
  identities: [
    ...state.identity.identities,
    ...state.identity.officialIdentities
  ],
  verifiers: state.identity.claimVerifiers,
  wallet: state.wallet,
  activeIdentity: ownProps.match.params.address
})

const mapDispatchToProps = dispatch => ({
  deployIdentityContract: (...args) =>
    dispatch(deployIdentityContract(...args)),
  importIdentityContract: (...args) =>
    dispatch(importIdentityContract(...args)),
  deployClaimVerifier: (...args) => dispatch(deployClaimVerifier(...args)),
  selectAccount: hash => dispatch(selectAccount(hash))
})

export default connect(mapStateToProps, mapDispatchToProps)(Identity)

require('react-styl')(`
  .mono
    font-family: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  .circ
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: #2e8af7;
    display: inline-block;
    vertical-align: 1px;
    margin: 0 8px 0 1px
  .row-fa.fa-lock
    margin: 0 9px 0 2px
  .row-fa.fa-unlock
    margin: 0 6px 0 0px
  .fa-unlock
    color: green
`)
