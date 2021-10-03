import React, { Component } from 'react'
import {CgPushLeft} from 'react-icons/cg'

class Home extends Component {

  render() {
    return (
      <div>
        <div className="mb-3">
          <CgPushLeft size={15} style={{marginRight: 10}}/>For more information, Choose a contract
        </div>
        <hr />
        <div className="mb-2">
          <div className="font-weight-bold">Identity</div>      
          These are controlled by keys which contain claims (has Valid Driver's License) to other identities
        </div>
        <div className="mb-2">
          <div className="font-weight-bold">Claim Issuer</div>
          Idenities Trusted by claim checkers to issue valid licenses
        </div>
        <div className="mb-2">
          <div className="font-weight-bold">Claim Checker</div>
          A contract only allowing interactions from Identites holding Claims
          from a Trusted Issuer.
        </div>
        <div className="mb-2">
          <div className="font-weight-bold">Claim</div>
          
          Claim: User/ Driver has a valid Driver's License
        </div>
      </div>
    ) 
  }
}

export default Home
