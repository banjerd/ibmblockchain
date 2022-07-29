
'use strict'; 

const fs = require('fs');
const path = require('path');
const { Wallets } = require('fabric-network');
const { Gateway } = require('fabric-network'); 
const configPath = path.join(process.cwd(), '/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
let userName = config.userName;
let walletPahtConf = config.wallet;
let gatewayDiscovery = config.gatewayDiscovery;

// connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// create car transaction
exports.createCar = async function(request) {
    let response = {};
    try { 
        const walletPath = path.join(process.cwd(), walletPahtConf);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);  
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
        const network = await gateway.getNetwork('mychannel'); 
        const contract = network.getContract('fabcar');
        console.log(request);
        console.log(JSON.stringify(request)); 
        await contract.submitTransaction('createRequester', JSON.stringify(request));
        console.log('Transaction has been submitted');
        await gateway.disconnect(); 
        response.msg = 'createCar Transaction has been submitted';
        return response;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
};

// change car owner transaction
exports.changeCarOwner = async function(key, newOwner) {
    let response = {};
    try { 
        const walletPath = path.join(process.cwd(),walletPahtConf);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);  
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
        const network = await gateway.getNetwork('mychannel'); 
        const contract = network.getContract('fabcar'); 
        await contract.submitTransaction('changeCarOwner', key, newOwner);
        console.log('Transaction has been submitted'); 
        await gateway.disconnect(); 
        response.msg = 'changeCarOwner Transaction has been submitted';
        return response; 
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
};

// query all cars transaction
exports.queryAllCars = async function() {

    let response = {};
    try {
        console.log('queryAllCars'); 
        const walletPath = path.join(process.cwd(), walletPahtConf);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');
        const result = await contract.evaluateTransaction('queryAllCars');

        return result;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
};

function BufferFrom(value) {
    console.log(Buffer.from(value).toString('ascii'));
    console.log(Buffer.from(value).toString('base64'));
    console.log(Buffer.from(value).toString('binary'));
    console.log(Buffer.from(value).toString('hex'));
    console.log(Buffer.from(value).toString('latin1'));
    console.log(Buffer.from(value).toString('ucs-2'));
    console.log(Buffer.from(value).toString('ucs2'));
    console.log(Buffer.from(value).toString('utf-8'));
    console.log(Buffer.from(value).toString('utf16le'));
    console.log(Buffer.from(value).toString('utf8'));
}

exports.EventaddBlockListener = async function() {
    const walletPath = path.join(process.cwd(), walletPahtConf);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork('mychannel');
    network.getChannel
    const option = {
        type: 'full'
    }; 
    const listener = async (event, data) => {
    console.log(BufferFrom(event.blockData.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension.response.payload));
    };
    await network.addBlockListener(listener, option);
 };



// query the car identified by key
exports.querySingleCar = async function(key) {

    let response = {};
    try {
        console.log('querySingleCar'); 
        const walletPath = path.join(process.cwd(), walletPahtConf);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`); 
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');
        console.log(key);
        const result = await contract.evaluateTransaction('querySingleCar', key);
        return result;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
};


